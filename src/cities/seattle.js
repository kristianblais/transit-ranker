// Seattle Sound Transit Link Light Rail — 1 Line and 2 Line.
// Stations from Chinatown–International District north to Lynnwood are shared
// by both lines; southern stations are 1 Line only; Eastside stations are 2 Line only.
const stations = [
  // 1 Line only (south of downtown core), north to south
  { name: "Angle Lake",                       lines: ["one"],        slug: "Angle_Lake_station" },
  { name: "SeaTac/Airport",                   lines: ["one"],        slug: "SeaTac/Airport_station" },
  { name: "Tukwila International Boulevard",  lines: ["one"],        slug: "Tukwila_International_Boulevard_station" },
  { name: "Rainier Beach",                    lines: ["one"],        slug: "Rainier_Beach_station" },
  { name: "Othello",                          lines: ["one"],        slug: "Othello_station_(Sound_Transit)" },
  { name: "Columbia City",                    lines: ["one"],        slug: "Columbia_City_station" },
  { name: "Mount Baker",                      lines: ["one"],        slug: "Mount_Baker_station" },
  { name: "Beacon Hill",                      lines: ["one"],        slug: "Beacon_Hill_station_(Sound_Transit)" },
  { name: "SODO",                             lines: ["one"],        slug: "SODO_station" },
  { name: "Stadium",                          lines: ["one"],        slug: "Stadium_station_(Sound_Transit)" },

  // Shared downtown tunnel + north corridor, south to north
  { name: "Chinatown–International District", lines: ["one", "two"], slug: "International_District/Chinatown_station" },
  { name: "Pioneer Square",                   lines: ["one", "two"], slug: "Pioneer_Square_station_(Sound_Transit)" },
  { name: "Symphony",                         lines: ["one", "two"], slug: "Symphony_station" },
  { name: "Westlake",                         lines: ["one", "two"], slug: "Westlake_station_(Sound_Transit)" },
  { name: "Capitol Hill",                     lines: ["one", "two"], slug: "Capitol_Hill_station_(Sound_Transit)" },
  { name: "University of Washington",         lines: ["one", "two"], slug: "University_of_Washington_station" },
  { name: "U District",                       lines: ["one", "two"], slug: "U_District_station" },
  { name: "Roosevelt",                        lines: ["one", "two"], slug: "Roosevelt_station_(Sound_Transit)" },
  { name: "Northgate",                        lines: ["one", "two"], slug: "Northgate_station_(Sound_Transit)" },
  { name: "Shoreline South/148th",            lines: ["one", "two"], slug: "Shoreline_South/148th_station" },
  { name: "Shoreline North/185th",            lines: ["one", "two"], slug: "Shoreline_North/185th_station" },
  { name: "Mountlake Terrace",                lines: ["one", "two"], slug: "Mountlake_Terrace_station" },
  { name: "Lynnwood City Center",             lines: ["one", "two"], slug: "Lynnwood_City_Center_station" },

  // 2 Line only (Eastside branch), west to east
  { name: "Judkins Park",                     lines: ["two"],        slug: "Judkins_Park_station" },
  { name: "Mercer Island",                    lines: ["two"],        slug: "Mercer_Island_station" },
  { name: "South Bellevue",                   lines: ["two"],        slug: "South_Bellevue_station" },
  { name: "East Main",                        lines: ["two"],        slug: "East_Main_station" },
  { name: "Downtown Bellevue",                lines: ["two"],        slug: "Downtown_Bellevue_station" },
  { name: "Wilburton",                        lines: ["two"],        slug: "Wilburton_station" },
  { name: "Spring District",                  lines: ["two"],        slug: "Spring_District_station" },
  { name: "BelRed",                           lines: ["two"],        slug: "BelRed_station" },
  { name: "Overlake Village",                 lines: ["two"],        slug: "Overlake_Village_station" },
  { name: "Redmond Technology",               lines: ["two"],        slug: "Redmond_Technology_station" },
];

const lineInfo = {
  one: { name: "1 Line", color: "#0085AD", bg: "rgba(0, 133, 173, 0.12)" },
  two: { name: "2 Line", color: "#80BC00", bg: "rgba(128, 188, 0, 0.18)" },
};

export default {
  id: "seattle",
  name: "Seattle",
  systemName: "Link Light Rail",
  brandTitle: "Link Showdown",
  selectorLabel: "Seattle · Link",
  stations,
  lineInfo,
};
