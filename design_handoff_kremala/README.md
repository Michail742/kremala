# Handoff: ΚΡΕΜΑΛΑ — Greek Hangman (Mobile)

## Overview
A mobile-first Greek Hangman game (Κρεμάλα). Players guess a hidden Greek word one letter at a time using an on-screen Α–Ω keyboard. Instead of a macabre gallows, the "hangman" is reframed **positively**: a friendly avatar **builds up** piece-by-piece as the player progresses, and a row of hearts tracks remaining tries. The whole experience fits in a single mobile viewport with **no scrolling**.

## About the Design Files
The files in this bundle are **design references created in HTML/CSS** — static prototypes showing the intended look, layout, and visual states. They are **not** production code to ship directly. The task is to **recreate these designs in the target codebase's environment** (React, React Native, SwiftUI, Flutter, plain Vanilla JS, etc.) using its established patterns, then layer on real game logic. If no environment exists yet, pick the most appropriate framework for a small mobile game and implement there.

There is **no game logic** in these files — they are static. All "states" (correct/wrong keys, revealed letters, win/lose modals) are hard-coded to demonstrate appearance. The developer must implement the actual logic (see **State Management** and **Interactions** below).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, and component states are all specified and should be matched closely. Exact hex values and measurements are listed under **Design Tokens**.

The chosen production direction is **"Calm Mint"** (`.t-mint`). Two other complete palettes (`.t-pastel`, `.t-editorial`) exist in the stylesheet as alternatives — keep the token structure so re-theming is a one-class swap, but Mint is the default.

---

## Screens / Views

### 1. Play Screen (mid-game) — the only screen
A single full-height (`100dvh`) column, max-width **460px**, centered on larger viewports. Top→bottom flex layout, never scrolls. Source: `Kremala (Calm Mint).html`.

Vertical structure (in order):
1. **Top Nav** (fixed at top of column)
2. **Character Stage** (`flex: 1` — absorbs all spare vertical space, vertically centered)
3. **Word Display**
4. **Keyboard** (anchored at bottom)

#### Component: Top Nav
- Flex row, `space-between`, full width.
- **Left — Brand**: a 32×32 rounded-square mark (radius 10px, `--accent` background, white trophy icon, soft accent shadow) + wordmark "ΚΡΕΜΑΛΑ" (16px, weight 900, `--ink`).
- **Right — Score + Reset**:
  - **Score chip**: pill (`--surface` bg, 1px `--hair` border, radius 999px). Contains two stats separated by a 1px `--hair` divider. **Wins**: trophy icon (`--good`) + count, text `--good-ink`, weight 900, 13px. **Losses**: X icon + count, text `--muted`.
  - **Reset button**: 38×38 icon button, radius 12px, `--surface` bg, 1px `--hair` border, circular-arrow icon. Active state rotates −35° and scales to .95 with `--accent-soft` bg.

#### Component: Character Stage
- `flex: 1`, centered column, gap 14px.
- **Lives row**: 6 heart pips, 19×19 each. Remaining lives = filled `--accent`; lost lives = outlined (stroke `--muted`, ~.42 opacity). Example state shows 4 of 6 remaining.
- **Character**: SVG avatar in a 188×230 box on a soft elliptical `--accent-soft` "platform" shadow. Built pieces are solid; **un-earned pieces are dashed ghost outlines** (stroke `--muted`, `stroke-dasharray: 6 8`, ~.5 opacity). As the player succeeds, ghost pieces become solid. The Mint character is a rounded blob-body figure with a sprout/leaf crown, dot eyes, cheeks, and a smile. (Full SVG markup is in the HTML file — lift it verbatim.)
- **Caption**: progress text e.g. "2 / 5 γράμματα", 12.5px weight 700 `--muted`.

#### Component: Word Display
- Centered flex row, wraps, gap 10px.
- Each letter = a **tile**: 40×54px, font 32px weight 900 `--ink`, with a 4px bottom border.
  - **Hidden** (`.blank`): transparent text, `--tile-line` border (the underscore).
  - **Revealed** (`.filled`): visible letter, `--accent` bottom border/bar (radius 3px).
- Example word ΗΛΙΟΣ shown as `Η _ Ι _ _`.

#### Component: Keyboard
- CSS Grid, **6 columns**, gap 8px → 24 Greek letters Α–Ω in a 6×4 grid.
- Each **key**: `aspect-ratio: 1/1`, `min-height: 50px` (touch-friendly ≥48px), radius 14px, font 21px weight 800.
- **States** (all four must be visible/implemented):
  - **Normal**: `--key-bg` bg, 1px `--key-bd` border, 2px solid `--key-shadow` drop (faux-3D), `--key-ink` text.
  - **Hover**: bg → `--key-hover`.
  - **Touch/Active** (`:active` / `.is-press`): translateY(2px), shadow collapses, bg `--accent-soft`, text `--accent-strong`, border `--accent`.
  - **Correct** (`.is-correct`): bg `--good-soft`, text `--good-ink`, border `--good-bd`, no shadow, `pointer-events: none`.
  - **Wrong** (`.is-wrong`): transparent bg, `--muted` text, `--hair` border, opacity .45, `pointer-events: none`.

### 2. Victory Modal (overlay on Play Screen)
- **Scrim**: covers `.app`, `--scrim` color + 7px backdrop blur, flex-centered, 24px padding.
- **Modal card**: `--surface`, radius 28px, padding ~30px, centered text, soft shadow, 1px `--hair` border.
  - **Badge**: 78×78 rounded square (radius 24), `--good-soft` bg, `--good` trophy icon.
  - **Title**: "ΝΙΚΗ!" 30px weight 900.
  - **Message**: "Βρήκες τη λέξη 🎉" 15px `--muted`.
  - **Reveal**: the full word in a `--bg` pill, label "Η ΛΕΞΗ" above (11px, uppercase, letter-spacing .12em), letters 22px weight 900.
  - **Score row**: Νίκες / Ήττες with big 24px counts.
  - **Primary button**: "Νέα λέξη" — full width, 54px, radius 16, `--accent` bg, `--on-accent` text, accent shadow. Active = translateY(2px).
  - **Ghost button**: "Αρχική" — transparent, `--muted`, 46px.

### 3. Game Over Modal (overlay on Play Screen)
Identical structure to Victory with these differences:
- Badge bg `--accent-soft`, `--accent` redo/circular-arrow icon.
- Title "ΚΡΙΜΑ!", message "Σχεδόν τα κατάφερες".
- Primary button "Δοκίμασε ξανά".
- Reveal still shows the (missed) word so the player learns it.

> **Note:** The HTML includes a small floating **"Preview" switcher** (`.preview-ctl`) to toggle Play/Νίκη/Game Over while reviewing. It is **review-only scaffolding — delete it for production.**

---

## Interactions & Behavior
- **Tapping a letter key**: if the letter is in the word → mark matching tiles `.filled` (reveal) + key → `.is-correct`; else → key → `.is-wrong` and decrement lives (lose one heart) + reveal the next character piece of the avatar. Keys in correct/wrong states are non-interactive.
- **Win**: all tiles revealed → show Victory modal, increment Wins.
- **Lose**: lives reach 0 → show Game Over modal, increment Losses, reveal full word.
- **Reset button (nav)**: start a new round (new word, reset keyboard, reset lives & character, keep score).
- **Modal buttons**: "Νέα λέξη" / "Δοκίμασε ξανά" → new round; "Αρχική" → home (TBD by app).
- **Transitions**: key press translateY 2px (~80ms). Icon-btn reset active rotates −35°/.95 (~150ms). Buttons translateY 2px on press (~120ms). Modal scrim uses backdrop blur.
- **Responsive**: column is `max-width: 460px` centered; on phones it's full-bleed with 20px side padding. Layout is height-driven — must fit `100dvh` with no scroll on common phone heights.

## State Management
Needed state:
- `word: string` — the target Greek word (uppercase).
- `revealed: Set<letter>` or per-tile boolean array — which letters are shown.
- `guessed: Set<letter>` — keys already pressed (drives correct/wrong styling + disable).
- `livesRemaining: number` (start 6) / `livesTotal: 6`.
- `status: 'playing' | 'won' | 'lost'` — drives which modal (if any) is shown.
- `score: { wins: number, losses: number }` — persists across rounds (consider `localStorage`).
- Derived: progress count "X / N γράμματα", character build stage = `livesTotal - livesRemaining` (number of pieces revealed).

Transitions: key tap → update guessed + (revealed | lives) → re-evaluate status → maybe set won/lost. Reset / modal CTA → re-init word, clear guessed/revealed, restore lives, status='playing'.

Data: word list is **out of scope for these files** — the developer supplies it (array of Greek words, or fetched list). No external word list was loaded here.

## Design Tokens (Calm Mint — production default)
Colors:
- `--bg: #eef7f1` (app background, soft mint)
- `--surface: #ffffff` (cards, chips, keys)
- `--ink: #173a2e` (primary text)
- `--muted: #9bb8ab` (secondary text, lost lives, wrong keys)
- `--hair: #dcece2` (hairline borders, dividers)
- `--accent: #21b58e` / `--accent-strong: #149173` / `--accent-soft: #d3f0e4` / `--on-accent: #ffffff`
- `--char-skin: #bfe9d4`, `--char-line: #173a2e`
- `--good: #15a36e` `--good-ink: #0f7d54` `--good-soft: #d7f1e3` `--good-bd: #b3e3cd`
- `--tile-line: #d6e8de`
- Keyboard: `--key-bg: #fff` `--key-ink: #1c3a30` `--key-bd: #dcece2` `--key-shadow: #e1efe7` `--key-hover: #effaf4`
- `--scrim: rgba(23,58,46,.30)`
- Page backdrop behind the app frame: `#d7e4dd`

Alternative palettes (same token names, different values): **Pastel** (`.t-pastel`, coral `#ff7a4d` accent on warm cream `#fff6ee`) and **Editorial** (`.t-editorial`, indigo `#4f46e5` on `#f5f6f9`). See `style.css`.

Typography:
- Font family: **Nunito** (geometric-rounded, full Greek support), weights 400–900. Fallback `system-ui, sans-serif`. Wordmark/letters use 800–900.
- Secondary display font available: **Comfortaa** (loaded but optional).
- Sizes: keys 21px, word tiles 32px, modal title 30px, brand 16px, captions 12.5px, eyebrow/labels 11–13px.

Spacing / radii / shadows:
- Radii: keys 14px, icon-btn 12px, brand mark 10px, modal 28px, badge 24px, buttons 16px, score chip & buttons-pill 999px.
- Gaps: keyboard 8px, word 10px, stage 14px.
- App padding: `max(20px, env(safe-area-inset-top)) 20px 28px`.
- Key faux-3D: 2px solid bottom shadow that collapses on press.
- Modal shadow: `0 30px 60px -24px rgba(10,14,25,.5)`; modal blur backdrop 7px.

## Assets
- **Icons**: all inline SVG (trophy, X, reset/redo circular arrows, sun, hearts). No external icon library. Lift the SVG markup from the HTML.
- **Character avatars**: hand-built inline SVG (one per palette direction). No raster images.
- **Fonts**: Google Fonts (Nunito, Comfortaa) via `@import` in `style.css` — swap for the codebase's font-loading approach.
- No external images or word lists.

## Files
- `Kremala (Calm Mint).html` — **the production direction**: consolidated single game screen with Play + Victory + Game Over states (toggle via the review-only preview switcher).
- `index.html` — exploration gallery: all three directions (Pastel / Editorial / Mint) shown side-by-side in phone mockups, plus the two modal templates. Useful for seeing the alternatives.
- `style.css` — shared, token-driven stylesheet for both files. All three palettes + the game shell live here.
