-- Kremala — Supabase schema
-- Τρέξε το ΟΛΟ αυτό το αρχείο στο Supabase → SQL Editor (μία φορά).
-- Δεν υπάρχει authentication: τα δωμάτια προστατεύονται από τον τυχαίο 4-ψήφιο κωδικό.

-- ── Πίνακες ──────────────────────────────────────────────────────────────────

create table if not exists public.rooms (
  code        text primary key,
  mode        text not null,                       -- 'setter-guesser' | 'race'
  status      text not null default 'ready-check', -- ready-check | setting-word | playing | finished
  word        text,
  winner      text,                                 -- pid του νικητή (race)
  setter_pid  text,                                 -- pid του παίκτη που δίνει λέξη αυτόν τον γύρο (setter-guesser, εναλλάσσεται)
  scores      jsonb not null default '{}'::jsonb,    -- { pid: πόντοι } — βαθμολογία δωματίου, μαζεύει σε όλους τους γύρους
  created_at  bigint not null                       -- epoch ms (χρησιμοποιείται για επιλογή λέξης)
);

create table if not exists public.players (
  code       text not null references public.rooms(code) on delete cascade,
  pid        text not null,
  name       text not null,
  role       text not null,                         -- host | player | setter | guesser
  ready      boolean not null default false,
  joined_at  bigint not null,
  primary key (code, pid)
);

create table if not exists public.states (
  code     text not null references public.rooms(code) on delete cascade,
  pid      text not null,                           -- pid παίκτη (race) ή 'shared' (setter-guesser)
  guessed  jsonb not null default '{}'::jsonb,       -- { γράμμα: pid_παίκτη_που_το_έπαιξε }
  lives    int  not null default 6,
  status   text not null default 'playing',         -- playing | won | lost
  log      jsonb not null default '[]'::jsonb,       -- [{pid, letter, hit}] — ιστορικό κινήσεων (κοινό board)
  primary key (code, pid)
);

create index if not exists players_code_idx on public.players (code);
create index if not exists states_code_idx  on public.states (code);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Παιχνίδι χωρίς login: επιτρέπουμε όλα στον anon ρόλο. Η ασφάλεια βασίζεται
-- στον τυχαίο κωδικό δωματίου (δεν αποθηκεύονται ευαίσθητα δεδομένα).

alter table public.rooms   enable row level security;
alter table public.players enable row level security;
alter table public.states  enable row level security;

drop policy if exists "anon all rooms"   on public.rooms;
drop policy if exists "anon all players" on public.players;
drop policy if exists "anon all states"  on public.states;

create policy "anon all rooms"   on public.rooms   for all using (true) with check (true);
create policy "anon all players" on public.players for all using (true) with check (true);
create policy "anon all states"  on public.states  for all using (true) with check (true);

-- ── Realtime ─────────────────────────────────────────────────────────────────
-- Ενεργοποίηση realtime broadcast αλλαγών για τους 3 πίνακες.

alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.states;

-- (προαιρετικό) στείλε ολόκληρη τη γραμμή στα DELETE events για cleanup στο client
alter table public.rooms   replica identity full;
alter table public.players replica identity full;
alter table public.states  replica identity full;

-- ── Ατομικό guess (κοινό board) ──────────────────────────────────────────────
-- Κάνει merge ΕΝΟΣ γράμματος στο shared state με κλείδωμα γραμμής, ώστε ταυτόχρονες
-- κινήσεις πολλών guessers να μη σβήνουν η μία την άλλη (το παλιό client-side overwrite
-- όλου του guessed object είχε race). Υπολογίζει lives/status/log server-side.
create or replace function public.kremala_guess(p_code text, p_pid text, p_letter text)
returns void language plpgsql as $$
declare
  v_word text; v_guessed jsonb; v_log jsonb;
  v_hit boolean; v_wrong int; v_lives int; v_allfound boolean; v_status text; v_pts int;
begin
  select word into v_word from public.rooms where code = p_code;
  if v_word is null then return; end if;

  select guessed, log into v_guessed, v_log
    from public.states where code = p_code and pid = 'shared' for update;
  if v_guessed is null then return; end if;
  if v_guessed ? p_letter then return; end if;  -- ήδη παίχτηκε

  v_hit := position(p_letter in v_word) > 0;
  v_guessed := v_guessed || jsonb_build_object(p_letter, p_pid);
  v_log := coalesce(v_log, '[]'::jsonb) || jsonb_build_object(
             'pid', p_pid, 'letter', p_letter, 'hit', v_hit,
             't', (extract(epoch from clock_timestamp()) * 1000)::bigint);

  select count(*) into v_wrong from jsonb_object_keys(v_guessed) k where position(k in v_word) = 0;
  v_lives := 6 - v_wrong;

  select bool_and(v_guessed ? c) into v_allfound
    from regexp_split_to_table(v_word, '') as c where c <> '';

  v_status := case when v_allfound then 'won' when v_lives <= 0 then 'lost' else 'playing' end;

  update public.states set guessed = v_guessed, log = v_log, lives = v_lives, status = v_status
    where code = p_code and pid = 'shared';

  -- πόντοι: +1 σωστό γράμμα, +3 bonus σε όποιον κλείνει τη λέξη
  v_pts := (case when v_hit then 1 else 0 end) + (case when v_status = 'won' then 3 else 0 end);
  if v_pts > 0 then
    update public.rooms set scores = jsonb_set(coalesce(scores, '{}'::jsonb), array[p_pid],
        to_jsonb(coalesce((scores->>p_pid)::int, 0) + v_pts)) where code = p_code;
  end if;

  if v_status <> 'playing' then
    update public.rooms set status = 'finished' where code = p_code;
  end if;
end; $$;

grant execute on function public.kremala_guess(text, text, text) to anon, authenticated;

-- Ατομικό increment βαθμολογίας (race mode + win bonus): ένα locked UPDATE ανά κλήση,
-- ώστε ταυτόχρονες αυξήσεις πόντων να μη χάνονται.
create or replace function public.kremala_add_score(p_code text, p_pid text, p_points int)
returns void language sql as $$
  update public.rooms
    set scores = jsonb_set(coalesce(scores, '{}'::jsonb), array[p_pid],
        to_jsonb(coalesce((scores->>p_pid)::int, 0) + p_points))
    where code = p_code;
$$;
grant execute on function public.kremala_add_score(text, text, int) to anon, authenticated;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  PLATFORM — Κοινή βάση για ΟΛΑ τα παιχνίδια του GameHub                    ║
-- ║  (Κρεμάλα, Κάστορες, Bluffa, Ταμπού)                                       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Κοινό προφίλ παίκτη. player_id = το id που φτιάχνει & περνά το GameHub app.
create table if not exists public.profiles (
  player_id   text primary key,
  nickname    text not null,
  avatar      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Μία γραμμή ανά παίκτη ανά παρτίδα. Το γράφει κάθε παιχνίδι στο τέλος.
create table if not exists public.match_results (
  id         uuid primary key default gen_random_uuid(),
  game       text not null,                 -- 'kremala' | 'kastores' | 'bluffa' | 'taboo'
  player_id  text not null,
  nickname   text not null,                 -- snapshot, για να μη χρειάζεται join
  won        boolean not null default false,
  score      int not null default 0,
  opponents  jsonb not null default '[]'::jsonb,
  played_at  timestamptz not null default now()
);

create index if not exists match_results_game_idx   on public.match_results (game);
create index if not exists match_results_player_idx  on public.match_results (player_id);
create index if not exists match_results_played_idx  on public.match_results (played_at desc);

-- Leaderboard: σύνολα ανά παίκτη ανά παιχνίδι (+ συνολικά αν game αγνοηθεί στο client).
create or replace view public.leaderboard as
select
  game,
  player_id,
  max(nickname)            as nickname,
  count(*)                 as matches,
  count(*) filter (where won) as wins,
  coalesce(sum(score), 0)  as total_score,
  max(played_at)           as last_played
from public.match_results
group by game, player_id;

-- RLS (ίδια λογική — παιχνίδι χωρίς login)
alter table public.profiles      enable row level security;
alter table public.match_results enable row level security;

drop policy if exists "anon all profiles"      on public.profiles;
drop policy if exists "anon all match_results" on public.match_results;

create policy "anon all profiles"      on public.profiles      for all using (true) with check (true);
create policy "anon all match_results" on public.match_results for all using (true) with check (true);
