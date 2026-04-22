import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Trophy, Trash2, RotateCcw, Train, Shuffle, Award, Loader2, SlidersHorizontal, Globe } from "lucide-react";
import { supabase, getDeviceId } from "./supabase.js";

// ----- Station data (all 54 current SkyTrain stations) -----
// Each station has a Wikipedia article slug used to fetch a lead image.
const STATIONS = [
  { id: "vancouver:skytrain:expo:waterfront",                name: "Waterfront",                lines: ["expo", "canada"],     slug: "Waterfront_station_(Vancouver)" },
  { id: "vancouver:skytrain:expo:burrard",                   name: "Burrard",                   lines: ["expo"],               slug: "Burrard_station" },
  { id: "vancouver:skytrain:expo:granville",                 name: "Granville",                 lines: ["expo"],               slug: "Granville_station_(SkyTrain)" },
  { id: "vancouver:skytrain:expo:stadium-chinatown",         name: "Stadium–Chinatown",         lines: ["expo"],               slug: "Stadium%E2%80%93Chinatown_station" },
  { id: "vancouver:skytrain:expo:main-street-science-world", name: "Main Street–Science World", lines: ["expo"],               slug: "Main_Street%E2%80%93Science_World_station" },
  { id: "vancouver:skytrain:expo:commercial-broadway",       name: "Commercial–Broadway",       lines: ["expo", "millennium"], slug: "Commercial%E2%80%93Broadway_station" },
  { id: "vancouver:skytrain:expo:nanaimo",                   name: "Nanaimo",                   lines: ["expo"],               slug: "Nanaimo_station" },
  { id: "vancouver:skytrain:expo:29th-avenue",               name: "29th Avenue",               lines: ["expo"],               slug: "29th_Avenue_station" },
  { id: "vancouver:skytrain:expo:joyce-collingwood",         name: "Joyce–Collingwood",         lines: ["expo"],               slug: "Joyce%E2%80%93Collingwood_station" },
  { id: "vancouver:skytrain:expo:patterson",                 name: "Patterson",                 lines: ["expo"],               slug: "Patterson_station_(SkyTrain)" },
  { id: "vancouver:skytrain:expo:metrotown",                 name: "Metrotown",                 lines: ["expo"],               slug: "Metrotown_station" },
  { id: "vancouver:skytrain:expo:royal-oak",                 name: "Royal Oak",                 lines: ["expo"],               slug: "Royal_Oak_station_(SkyTrain)" },
  { id: "vancouver:skytrain:expo:edmonds",                   name: "Edmonds",                   lines: ["expo"],               slug: "Edmonds_station_(SkyTrain)" },
  { id: "vancouver:skytrain:expo:22nd-street",               name: "22nd Street",               lines: ["expo"],               slug: "22nd_Street_station_(SkyTrain)" },
  { id: "vancouver:skytrain:expo:new-westminster",           name: "New Westminster",           lines: ["expo"],               slug: "New_Westminster_station" },
  { id: "vancouver:skytrain:expo:columbia",                  name: "Columbia",                  lines: ["expo"],               slug: "Columbia_station_(SkyTrain)" },
  { id: "vancouver:skytrain:expo:sapperton",                 name: "Sapperton",                 lines: ["expo"],               slug: "Sapperton_station" },
  { id: "vancouver:skytrain:expo:braid",                     name: "Braid",                     lines: ["expo"],               slug: "Braid_station" },
  { id: "vancouver:skytrain:expo:lougheed-town-centre",      name: "Lougheed Town Centre",      lines: ["expo", "millennium"], slug: "Lougheed_Town_Centre_station" },
  { id: "vancouver:skytrain:expo:production-way-university", name: "Production Way–University", lines: ["expo", "millennium"], slug: "Production_Way%E2%80%93University_station" },
  { id: "vancouver:skytrain:expo:scott-road",                name: "Scott Road",                lines: ["expo"],               slug: "Scott_Road_station" },
  { id: "vancouver:skytrain:expo:gateway",                   name: "Gateway",                   lines: ["expo"],               slug: "Gateway_station_(SkyTrain)" },
  { id: "vancouver:skytrain:expo:surrey-central",            name: "Surrey Central",            lines: ["expo"],               slug: "Surrey_Central_station" },
  { id: "vancouver:skytrain:expo:king-george",               name: "King George",               lines: ["expo"],               slug: "King_George_station" },
  { id: "vancouver:skytrain:millennium:vcc-clark",           name: "VCC–Clark",                 lines: ["millennium"],         slug: "VCC%E2%80%93Clark_station" },
  { id: "vancouver:skytrain:millennium:renfrew",             name: "Renfrew",                   lines: ["millennium"],         slug: "Renfrew_station" },
  { id: "vancouver:skytrain:millennium:rupert",              name: "Rupert",                    lines: ["millennium"],         slug: "Rupert_station" },
  { id: "vancouver:skytrain:millennium:gilmore",             name: "Gilmore",                   lines: ["millennium"],         slug: "Gilmore_station_(SkyTrain)" },
  { id: "vancouver:skytrain:millennium:brentwood-town-centre", name: "Brentwood Town Centre",   lines: ["millennium"],         slug: "Brentwood_Town_Centre_station" },
  { id: "vancouver:skytrain:millennium:holdom",              name: "Holdom",                    lines: ["millennium"],         slug: "Holdom_station" },
  { id: "vancouver:skytrain:millennium:sperling-burnaby-lake", name: "Sperling–Burnaby Lake",   lines: ["millennium"],         slug: "Sperling%E2%80%93Burnaby_Lake_station" },
  { id: "vancouver:skytrain:millennium:lake-city-way",       name: "Lake City Way",             lines: ["millennium"],         slug: "Lake_City_Way_station" },
  { id: "vancouver:skytrain:millennium:burquitlam",          name: "Burquitlam",                lines: ["millennium"],         slug: "Burquitlam_station" },
  { id: "vancouver:skytrain:millennium:moody-centre",        name: "Moody Centre",              lines: ["millennium"],         slug: "Moody_Centre_station" },
  { id: "vancouver:skytrain:millennium:inlet-centre",        name: "Inlet Centre",              lines: ["millennium"],         slug: "Inlet_Centre_station" },
  { id: "vancouver:skytrain:millennium:coquitlam-central",   name: "Coquitlam Central",         lines: ["millennium"],         slug: "Coquitlam_Central_station" },
  { id: "vancouver:skytrain:millennium:lincoln",             name: "Lincoln",                   lines: ["millennium"],         slug: "Lincoln_station_(SkyTrain)" },
  { id: "vancouver:skytrain:millennium:lafarge-lake-douglas", name: "Lafarge Lake–Douglas",     lines: ["millennium"],         slug: "Lafarge_Lake%E2%80%93Douglas_station" },
  { id: "vancouver:skytrain:canada:vancouver-city-centre",   name: "Vancouver City Centre",     lines: ["canada"],             slug: "Vancouver_City_Centre_station" },
  { id: "vancouver:skytrain:canada:yaletown-roundhouse",     name: "Yaletown–Roundhouse",       lines: ["canada"],             slug: "Yaletown%E2%80%93Roundhouse_station" },
  { id: "vancouver:skytrain:canada:olympic-village",         name: "Olympic Village",           lines: ["canada"],             slug: "Olympic_Village_station" },
  { id: "vancouver:skytrain:canada:broadway-city-hall",      name: "Broadway–City Hall",        lines: ["canada"],             slug: "Broadway%E2%80%93City_Hall_station" },
  { id: "vancouver:skytrain:canada:king-edward",             name: "King Edward",               lines: ["canada"],             slug: "King_Edward_station" },
  { id: "vancouver:skytrain:canada:oakridge-41st-avenue",    name: "Oakridge–41st Avenue",      lines: ["canada"],             slug: "Oakridge%E2%80%9341st_Avenue_station" },
  { id: "vancouver:skytrain:canada:langara-49th-avenue",     name: "Langara–49th Avenue",       lines: ["canada"],             slug: "Langara%E2%80%9349th_Avenue_station" },
  { id: "vancouver:skytrain:canada:marine-drive",            name: "Marine Drive",              lines: ["canada"],             slug: "Marine_Drive_station" },
  { id: "vancouver:skytrain:canada:bridgeport",              name: "Bridgeport",                lines: ["canada"],             slug: "Bridgeport_station_(SkyTrain)" },
  { id: "vancouver:skytrain:canada:aberdeen",                name: "Aberdeen",                  lines: ["canada"],             slug: "Aberdeen_station_(SkyTrain)" },
  { id: "vancouver:skytrain:canada:lansdowne",               name: "Lansdowne",                 lines: ["canada"],             slug: "Lansdowne_station_(SkyTrain)" },
  { id: "vancouver:skytrain:canada:capstan",                 name: "Capstan",                   lines: ["canada"],             slug: "Capstan_station" },
  { id: "vancouver:skytrain:canada:richmond-brighouse",      name: "Richmond–Brighouse",        lines: ["canada"],             slug: "Richmond%E2%80%93Brighouse_station" },
  { id: "vancouver:skytrain:canada:templeton",               name: "Templeton",                 lines: ["canada"],             slug: "Templeton_station" },
  { id: "vancouver:skytrain:canada:sea-island-centre",       name: "Sea Island Centre",         lines: ["canada"],             slug: "Sea_Island_Centre_station" },
  { id: "vancouver:skytrain:canada:yvr-airport",             name: "YVR–Airport",               lines: ["canada"],             slug: "YVR%E2%80%93Airport_station" },
];

const STATION_BY_NAME = Object.fromEntries(STATIONS.map((s) => [s.name, s]));

// ----- Constants -----
const LINE_INFO = {
  expo:       { name: "Expo",       color: "#1565C0", bg: "rgba(21, 101, 192, 0.12)" },
  millennium: { name: "Millennium", color: "#FFB300", bg: "rgba(255, 179, 0, 0.18)"  },
  canada:     { name: "Canada",     color: "#00A887", bg: "rgba(0, 168, 135, 0.14)"  },
};

const INITIAL_ELO = 1500;
const K_FACTOR = 32;

const STORAGE_KEY = "skytrain_ranker_state_v1";
const IMG_CACHE_KEY = "skytrain_ranker_images_v4";

// ----- ELO math -----
function expectedScore(rA, rB) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}

function updateElo(rA, rB, scoreA) {
  const eA = expectedScore(rA, rB);
  const eB = 1 - eA;
  const newA = rA + K_FACTOR * (scoreA - eA);
  const newB = rB + K_FACTOR * ((1 - scoreA) - eB);
  return [newA, newB];
}

// ----- Pick the next pair -----
// Below CALIBRATION_MATCHES, rating isn't meaningful yet, so partner is random.
// After, partner is drawn from nearest-rated stations (expected score near 0.5 = most info per vote).
const CALIBRATION_MATCHES = 1;
const NEIGHBOR_POOL = 6;

function pickPair(stats, lastPairKey) {
  const names = STATIONS.map((s) => s.name);
  const matchCount = (n) => stats[n]?.matches ?? 0;
  const rating = (n) => stats[n]?.elo ?? INITIAL_ELO;

  const sortedByCount = [...names].sort((a, b) => {
    const diff = matchCount(a) - matchCount(b);
    return diff !== 0 ? diff : Math.random() - 0.5;
  });

  for (let attempt = 0; attempt < 20; attempt++) {
    const a = sortedByCount[Math.floor(Math.random() * Math.min(8, sortedByCount.length))];

    let b;
    if (matchCount(a) < CALIBRATION_MATCHES) {
      do {
        b = names[Math.floor(Math.random() * names.length)];
      } while (b === a);
    } else {
      const rA = rating(a);
      const neighbors = names
        .filter((n) => n !== a)
        .sort((x, y) => Math.abs(rating(x) - rA) - Math.abs(rating(y) - rA))
        .slice(0, NEIGHBOR_POOL);
      b = neighbors[Math.floor(Math.random() * neighbors.length)];
    }

    const key = [a, b].sort().join("|");
    if (key !== lastPairKey) return [a, b];
  }

  const a = sortedByCount[0];
  let b = names[Math.floor(Math.random() * names.length)];
  if (b === a) b = names[(names.indexOf(a) + 1) % names.length];
  return [a, b];
}

// ----- Image fetching (Wikipedia REST API summary endpoint, with caching) -----
const imageCache = {}; // in-memory layer; we also persist to window.storage

function loadImageCacheFromStorage() {
  try {
    const value = localStorage.getItem(IMG_CACHE_KEY);
    if (value) Object.assign(imageCache, JSON.parse(value));
  } catch (e) {}
}

function persistImageCache() {
  try {
    localStorage.setItem(IMG_CACHE_KEY, JSON.stringify(imageCache));
  } catch (e) {}
}

async function fetchStationImages(slug) {
  if (imageCache[slug] !== undefined) return imageCache[slug];
  try {
    const [mediaRes, summaryRes] = await Promise.allSettled([
      fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${slug}`, { headers: { Accept: "application/json" } }),
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`,    { headers: { Accept: "application/json" } }),
    ]);

    let urls = [];

    if (mediaRes.status === "fulfilled" && mediaRes.value.ok) {
      const data = await mediaRes.value.json();
      urls = (data.items || [])
        .filter(item =>
          item.type === "image" &&
          item.showInGallery &&
          item.srcset?.length > 0 &&
          !/\.(svg|gif)$/i.test(item.title)
        )
        .slice(0, 3)
        .map(item => {
          const src = item.srcset[item.srcset.length - 1].src;
          return src.startsWith("//") ? "https:" + src : src;
        });
    }

    if (urls.length === 0 && summaryRes.status === "fulfilled" && summaryRes.value.ok) {
      const data = await summaryRes.value.json();
      const img = data?.thumbnail?.source || data?.originalimage?.source;
      if (img) urls = [img];
    }

    imageCache[slug] = urls;
    persistImageCache();
    return urls;
  } catch (e) {
    return [];
  }
}

// ----- Station card -----
function StationCard({ station, onPick, disabled, side }) {
  const [imgUrls, setImgUrls] = useState(undefined); // undefined=loading, []=none, [...]=ok
  const [loadedFlags, setLoadedFlags] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setImgUrls(undefined);
    setLoadedFlags([]);
    setCurrentIdx(0);
    fetchStationImages(station.slug).then(urls => {
      if (!cancelled) setImgUrls(urls);
    });
    return () => { cancelled = true; };
  }, [station.slug]);

  // Auto-advance carousel every 4s when there are multiple images
  useEffect(() => {
    if (!imgUrls || imgUrls.length < 2) return;
    const id = setInterval(() => setCurrentIdx(i => (i + 1) % imgUrls.length), 4000);
    return () => clearInterval(id);
  }, [imgUrls]);

  const primaryLine = station.lines[0];
  const accent = LINE_INFO[primaryLine].color;
  const hasImages = imgUrls && imgUrls.length > 0;
  const showSpinner = imgUrls === undefined || (hasImages && !loadedFlags[0]);

  return (
    <button
      onClick={onPick}
      disabled={disabled}
      className="group relative flex flex-col w-full overflow-hidden rounded-2xl bg-white shadow-[0_2px_0_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-200 hover:shadow-[0_2px_0_rgba(0,0,0,0.06),0_18px_36px_-10px_rgba(0,0,0,0.28)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-left"
      style={{ borderTop: `6px solid ${accent}` }}
      aria-label={`Pick ${station.name}`}
    >
      {/* Image area */}
      <div className="relative aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {showSpinner && (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        {hasImages && imgUrls.map((url, i) => (
          <img
            key={url}
            src={url}
            alt={station.name}
            onLoad={() => setLoadedFlags(prev => { const next = [...prev]; next[i] = true; return next; })}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              i === currentIdx && loadedFlags[i] ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {imgUrls !== undefined && !hasImages && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 gap-2 p-4 text-center">
            <Train className="w-12 h-12" style={{ color: accent }} />
            <span className="text-xs uppercase tracking-widest">No photo</span>
          </div>
        )}
        {/* Carousel dots */}
        {imgUrls && imgUrls.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {imgUrls.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 rounded-full bg-white transition-all duration-300 ${i === currentIdx ? "w-4 opacity-90" : "w-1.5 opacity-50"}`}
              />
            ))}
          </div>
        )}
        {/* Side label */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.18em]">
          {side}
        </div>
      </div>

      {/* Name + lines */}
      <div className="flex-1 flex flex-col justify-between p-3 sm:p-5 gap-2 sm:gap-4">
        <h3 className="font-serif text-lg sm:text-2xl leading-tight text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {station.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {station.lines.map((l) => (
            <span
              key={l}
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
              style={{ backgroundColor: LINE_INFO[l].bg, color: LINE_INFO[l].color }}
            >
              {LINE_INFO[l].name}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

// ----- Leaderboard -----
function Leaderboard({ stats, totalMatches, rows, showWinsLosses = true }) {
  const ranked = useMemo(() => {
    if (rows) return rows;
    return STATIONS.map((s) => ({
      ...s,
      elo: stats[s.name]?.elo ?? INITIAL_ELO,
      matches: stats[s.name]?.matches ?? 0,
      wins: stats[s.name]?.wins ?? 0,
    })).sort((a, b) => b.elo - a.elo);
  }, [stats, rows]);

  const maxElo = ranked[0]?.elo ?? INITIAL_ELO;
  const minElo = ranked[ranked.length - 1]?.elo ?? INITIAL_ELO;
  const eloRange = Math.max(1, maxElo - minElo);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="text-xs uppercase tracking-[0.2em] text-stone-500 font-semibold">
          Standings · {totalMatches} {totalMatches === 1 ? "matchup" : "matchups"}
        </div>
      </div>
      <div className="space-y-1.5">
        {ranked.map((s, idx) => {
          const primaryLine = s.lines[0];
          const accent = LINE_INFO[primaryLine].color;
          const barPct = ((s.elo - minElo) / eloRange) * 100;
          const isTop3 = idx < 3 && s.matches > 0;
          return (
            <div
              key={s.name}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-stone-200 hover:border-stone-300 transition-colors"
            >
              {/* Rank */}
              <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  isTop3 ? "text-white" : "text-stone-600 bg-stone-100"
                }`}
                style={isTop3 ? { backgroundColor: idx === 0 ? "#D4A017" : idx === 1 ? "#A8A8A8" : "#B5651D" } : {}}
              >
                {idx + 1}
              </div>
              {/* Name + lines */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-stone-900 truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {s.name}
                  </span>
                  <div className="flex gap-1">
                    {s.lines.map((l) => (
                      <span key={l} className="w-2 h-2 rounded-full" style={{ backgroundColor: LINE_INFO[l].color }} />
                    ))}
                  </div>
                </div>
                {/* ELO bar */}
                <div className="mt-1 h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barPct}%`, backgroundColor: accent }}
                  />
                </div>
              </div>
              {/* Stats */}
              <div className="shrink-0 text-right">
                <div className="font-mono text-sm font-bold text-stone-900 tabular-nums">{Math.round(s.elo)}</div>
                <div className="text-[10px] text-stone-500 font-mono tabular-nums">
                  {showWinsLosses ? `${s.wins}W · ${s.matches - s.wins}L` : `${s.matches} votes`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----- Main component -----
export default function App() {
  const [stats, setStats] = useState({}); // { name: { elo, matches, wins } }
  const [pair, setPair] = useState(null); // [nameA, nameB]
  const [lastPairKey, setLastPairKey] = useState("");
  const [view, setView] = useState("match"); // "match" | "leaderboard" | "global"
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState(false);
  const [recentChange, setRecentChange] = useState(null); // { winner, loser, deltaW, deltaL }
  const [showPicker, setShowPicker] = useState(false);
  const [pickerA, setPickerA] = useState(STATIONS[0].name);
  const [pickerB, setPickerB] = useState(STATIONS[1].name);
  const [globalStats, setGlobalStats] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  const sortedNames = useMemo(
    () => [...STATIONS].sort((a, b) => a.name.localeCompare(b.name)).map(s => s.name),
    []
  );

  const totalMatches = useMemo(
    () => Object.values(stats).reduce((acc, s) => acc + (s?.matches ?? 0), 0) / 2,
    [stats]
  );

  // Initial load
  useEffect(() => {
    loadImageCacheFromStorage();
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value) {
        const saved = JSON.parse(value);
        setStats(saved.stats || {});
        setPair(pickPair(saved.stats || {}, ""));
      } else {
        setPair(pickPair({}, ""));
      }
    } catch (e) {
      setPair(pickPair({}, ""));
    }
    setLoading(false);
  }, []);

  // Persist whenever stats change (but not on first paint)
  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stats }));
    } catch (e) {}
  }, [stats, loading]);

  const handlePick = useCallback((winnerName, loserName) => {
    if (picking) return;
    setPicking(true);

    // Fire global ELO update — no await, doesn't block UI
    const winnerId = STATION_BY_NAME[winnerName]?.id;
    const loserId  = STATION_BY_NAME[loserName]?.id;
    if (winnerId && loserId) {
      supabase.rpc("record_match", {
        p_device_id: getDeviceId(),
        p_winner_id: winnerId,
        p_loser_id:  loserId,
      }).then(() => {});
    }

    setStats((prev) => {
      const wPrev = prev[winnerName] ?? { elo: INITIAL_ELO, matches: 0, wins: 0 };
      const lPrev = prev[loserName] ?? { elo: INITIAL_ELO, matches: 0, wins: 0 };
      const [newW, newL] = updateElo(wPrev.elo, lPrev.elo, 1);
      setRecentChange({
        winner: winnerName,
        loser: loserName,
        deltaW: newW - wPrev.elo,
        deltaL: newL - lPrev.elo,
      });
      return {
        ...prev,
        [winnerName]: { elo: newW, matches: wPrev.matches + 1, wins: wPrev.wins + 1 },
        [loserName]:  { elo: newL, matches: lPrev.matches + 1, wins: lPrev.wins },
      };
    });

    // Brief delay so user sees feedback, then advance
    setTimeout(() => {
      setStats((curr) => {
        const key = [winnerName, loserName].sort().join("|");
        setLastPairKey(key);
        setPair(pickPair(curr, key));
        return curr;
      });
      setPicking(false);
      setTimeout(() => setRecentChange(null), 1800);
    }, 350);
  }, [picking]);

  const handleSkip = useCallback(() => {
    if (!pair) return;
    const key = [pair[0], pair[1]].sort().join("|");
    setLastPairKey(key);
    setPair(pickPair(stats, key));
  }, [pair, stats]);

  const handleSetCustomPair = useCallback(() => {
    if (pickerA === pickerB) return;
    setPair([pickerA, pickerB]);
    setShowPicker(false);
  }, [pickerA, pickerB]);

  const handleReset = useCallback(async () => {
    if (!confirm("Reset all rankings? This cannot be undone.")) return;
    setStats({});
    setRecentChange(null);
    setPair(pickPair({}, ""));
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }, []);

  const handleGlobalTab = useCallback(async () => {
    setView("global");
    if (globalStats !== null) return;
    setGlobalLoading(true);
    const { data, error } = await supabase
      .from("stations")
      .select("id, name, elo, matches, wins, line_ids")
      .order("elo", { ascending: false });
    setGlobalStats(error ? [] : data.map(row => ({ ...row, lines: row.line_ids })));
    setGlobalLoading(false);
  }, [globalStats]);

  const stationByName = useCallback(
    (name) => STATIONS.find((s) => s.name === name),
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-10 h-10 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center">
                <Train className="w-5 h-5 text-white" />
              </div>
              {/* Three line color dots */}
              <div className="absolute -bottom-1 -right-1 flex gap-[2px]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LINE_INFO.expo.color }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LINE_INFO.millennium.color }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LINE_INFO.canada.color }} />
              </div>
            </div>
            <div className="min-w-0">
              <h1
                className="text-xl sm:text-2xl font-bold text-stone-900 leading-none truncate"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                SkyTrain Showdown
              </h1>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-stone-500 mt-1">
                Vancouver · 54 stations · Elo ranked
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 rounded-full p-1 w-full sm:w-auto">
            <button
              onClick={() => setView("match")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                view === "match" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Versus
            </button>
            <button
              onClick={() => setView("leaderboard")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                view === "leaderboard" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              My Rankings
            </button>
            <button
              onClick={handleGlobalTab}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                view === "global" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Global
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {view === "match" && pair && (
          <div className="space-y-6">
            {/* Prompt */}
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-white text-[10px] uppercase tracking-[0.25em] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Matchup #{Math.floor(totalMatches) + 1}
              </div>
              <h2
                className="text-2xl sm:text-5xl text-stone-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
              >
                Which station do you prefer?
              </h2>
              <p className="text-sm text-stone-500">Tap one to vote · your choice updates the leaderboard</p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
              <StationCard
                station={stationByName(pair[0])}
                onPick={() => handlePick(pair[0], pair[1])}
                disabled={picking}
                side="A"
              />
              <div className="flex md:flex-col items-center justify-center gap-2 py-1 md:py-2">
                <div className="hidden md:block w-px h-12 bg-stone-300" />
                <span
                  className="font-bold text-stone-400 text-xl tracking-widest"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  VS
                </span>
                <div className="hidden md:block w-px h-12 bg-stone-300" />
              </div>
              <StationCard
                station={stationByName(pair[1])}
                onPick={() => handlePick(pair[1], pair[0])}
                disabled={picking}
                side="B"
              />
            </div>

            {/* Recent change feedback */}
            {recentChange && (
              <div className="text-center text-sm font-mono text-stone-600 tabular-nums animate-fadein">
                <span className="text-emerald-700 font-bold">{recentChange.winner}</span>
                <span className="text-emerald-600"> +{Math.round(recentChange.deltaW)}</span>
                <span className="mx-3 text-stone-400">·</span>
                <span className="text-stone-700">{recentChange.loser}</span>
                <span className="text-rose-600"> {Math.round(recentChange.deltaL)}</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center items-center gap-3 pt-2 flex-wrap">
              <button
                onClick={handleSkip}
                disabled={picking}
                className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-white rounded-full transition-colors disabled:opacity-50"
              >
                <Shuffle className="w-4 h-4" />
                Skip this pair
              </button>
              <button
                onClick={() => setShowPicker(v => !v)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-colors ${
                  showPicker
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:text-stone-900 hover:bg-white"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Choose matchup
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm text-stone-500 hover:text-rose-600 hover:bg-white rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Custom matchup picker */}
            {showPicker && (
              <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-semibold text-center">
                  Pick any two stations
                </p>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                  <select
                    value={pickerA}
                    onChange={e => setPickerA(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-stone-400"
                  >
                    {sortedNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <span className="text-stone-400 font-bold text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>VS</span>
                  <select
                    value={pickerB}
                    onChange={e => setPickerB(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-stone-400"
                  >
                    {sortedNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleSetCustomPair}
                    disabled={pickerA === pickerB}
                    className="px-6 py-2 bg-stone-900 text-white text-sm font-semibold rounded-full hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Start matchup
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === "leaderboard" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-white text-[10px] uppercase tracking-[0.25em] font-semibold">
                <Award className="w-3 h-3" />
                Live Standings
              </div>
              <h2
                className="text-3xl sm:text-5xl text-stone-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
              >
                My Rankings
              </h2>
              <p className="text-sm text-stone-500">
                {totalMatches === 0
                  ? "All stations start at 1500. Vote to break the tie."
                  : "Ratings shift after every matchup using Elo (K=32)."}
              </p>
            </div>

            <Leaderboard stats={stats} totalMatches={Math.floor(totalMatches)} />

            <div className="flex justify-center pt-2">
              <button
                onClick={() => setView("match")}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-full text-sm font-semibold hover:bg-stone-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Keep voting
              </button>
            </div>
          </div>
        )}

        {view === "global" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-white text-[10px] uppercase tracking-[0.25em] font-semibold">
                <Globe className="w-3 h-3" />
                Global Standings
              </div>
              <h2
                className="text-3xl sm:text-5xl text-stone-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
              >
                Everyone's ranking
              </h2>
              <p className="text-sm text-stone-500">Aggregated Elo across all players</p>
              <p className="text-xs text-stone-400">Hit Refresh to see the latest standings</p>
            </div>

            {globalLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
              </div>
            )}

            {!globalLoading && globalStats?.length === 0 && (
              <p className="text-center text-stone-500 py-8">Could not load global rankings. Try refreshing.</p>
            )}

            {!globalLoading && globalStats?.length > 0 && (
              <>
                <Leaderboard rows={globalStats} showWinsLosses={true} />
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => { setGlobalStats(null); handleGlobalTab(); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-full text-sm font-semibold hover:bg-stone-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-stone-400">
        Photos via Wikipedia · Progress saved automatically · Preview photo by <a href="https://commons.wikimedia.org/wiki/File:Vancouver_Skytrain_Rupert_station_train.jpg" target="_blank" rel="noopener" className="underline hover:text-stone-600">Wikimedia Commons</a> (CC BY-SA 2.0)
      </footer>

      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein { animation: fadein 0.3s ease-out; }
      `}</style>
    </div>
  );
}
