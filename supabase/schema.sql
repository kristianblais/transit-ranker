-- ============================================================
-- Transit Ranker — Supabase Schema
-- ============================================================
-- Run this file top-to-bottom in the Supabase SQL editor to
-- recreate the full schema from scratch.
-- ============================================================


-- ------------------------------------------------------------
-- STATIONS
-- Stores one row per station with its current global ELO.
--
-- id:        "{city_id}:{system_id}:{primary_line_id}:{name_key}"
--            e.g. "vancouver:skytrain:expo:waterfront"
--            e.g. "seattle:link:one:sodo"
--            Line is included to disambiguate same-name stations on
--            different lines (e.g. Chicago's Roosevelt on Red vs Blue).
--            Multi-line shared stations use their primary line in the id;
--            all served lines are stored in line_ids.
-- city_id:   e.g. "seattle", "vancouver"
-- system_id: transit system within the city, e.g. "link", "skytrain"
-- line_ids:  all lines serving this station, e.g. '{one}' or '{one,two}'
-- slug:      Wikipedia page slug used to fetch station photos
-- elo:       global ELO rating, initialised at 1500
-- matches:   total number of times this station has been compared
-- wins:      number of times this station has won a comparison
-- ------------------------------------------------------------
create table stations (
  id        text    primary key,
  city_id   text    not null,
  system_id text    not null,
  line_ids  text[]  not null default '{}',
  slug      text    not null,
  name      text    not null,
  elo       float   not null default 1500,
  matches   int     not null default 0,
  wins      int     not null default 0
);


-- ------------------------------------------------------------
-- MATCHES
-- Append-only audit log of every pairwise comparison.
-- ELO values before and after are stored so the full history
-- can be replayed or recomputed with a different K-factor.
--
-- device_id: anonymous identifier stored in the user's
--            localStorage — no account required
-- ------------------------------------------------------------
create table matches (
  id                 uuid        primary key default gen_random_uuid(),
  device_id          text        not null,
  city_id            text        not null,
  system_id          text        not null,
  winner_id          text        not null references stations(id),
  loser_id           text        not null references stations(id),
  winner_elo_before  float       not null,
  loser_elo_before   float       not null,
  winner_elo_after   float       not null,
  loser_elo_after    float       not null,
  created_at         timestamptz not null default now()
);


-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- All writes go through the record_match RPC function (security
-- definer), so clients never need direct insert/update access.
-- ------------------------------------------------------------
alter table stations enable row level security;
alter table matches  enable row level security;

-- Anyone can read global ELO standings
create policy "public read stations" on stations
  for select using (true);

-- Anyone can read match history
create policy "public read matches" on matches
  for select using (true);


-- ------------------------------------------------------------
-- RECORD_MATCH RPC
-- Called by the frontend on each pairwise comparison.
-- Runs as SECURITY DEFINER so it can write to stations and
-- matches despite RLS blocking direct client writes.
--
-- Parameters:
--   p_device_id  anonymous device identifier from localStorage
--   p_winner_id  full station id e.g. "vancouver:skytrain:expo:waterfront"
--   p_loser_id   full station id of the other station
--
-- city_id and system_id are derived from the station rows — the frontend
-- only needs to pass station ids.
--
-- Returns the new ELO scores for both stations.
-- ------------------------------------------------------------
create or replace function record_match(
  p_device_id  text,
  p_winner_id  text,
  p_loser_id   text
)
returns json
language plpgsql
security definer
as $$
declare
  k            constant float := 32;
  winner       stations%rowtype;
  loser        stations%rowtype;
  expected_w   float;
  expected_l   float;
  new_elo_w    float;
  new_elo_l    float;
begin
  -- Lock both rows by primary key; consistent order prevents deadlocks
  select * into winner from stations where id = p_winner_id for update;
  select * into loser  from stations where id = p_loser_id  for update;

  if winner.id is null then
    raise exception 'Station not found: %', p_winner_id;
  end if;
  if loser.id is null then
    raise exception 'Station not found: %', p_loser_id;
  end if;

  -- ELO calculation
  expected_w := 1.0 / (1.0 + power(10.0, (loser.elo - winner.elo) / 400.0));
  expected_l := 1.0 - expected_w;
  new_elo_w  := winner.elo + k * (1.0 - expected_w);
  new_elo_l  := loser.elo  + k * (0.0 - expected_l);

  -- Update global ELO, match counts, and wins
  update stations set elo = new_elo_w, matches = matches + 1, wins = wins + 1 where id = p_winner_id;
  update stations set elo = new_elo_l, matches = matches + 1 where id = p_loser_id;

  -- Append to audit log; city_id and system_id derived from station rows
  insert into matches (
    device_id, city_id, system_id,
    winner_id, loser_id,
    winner_elo_before, loser_elo_before,
    winner_elo_after,  loser_elo_after
  ) values (
    p_device_id, winner.city_id, winner.system_id,
    p_winner_id, p_loser_id,
    winner.elo, loser.elo,
    new_elo_w,  new_elo_l
  );

  return json_build_object(
    'winner_elo', new_elo_w,
    'loser_elo',  new_elo_l
  );
end;
$$;
