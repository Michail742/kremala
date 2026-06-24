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
  guessed  jsonb not null default '{}'::jsonb,
  lives    int  not null default 6,
  status   text not null default 'playing',         -- playing | won | lost
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
