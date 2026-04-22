// Seattle Sound Transit Link Light Rail — 1 Line and 2 Line.
// Stations from Chinatown–International District north to Lynnwood are shared
// by both lines; southern stations are 1 Line only; Eastside stations are 2 Line only.
const stations = [
  // 1 Line only (south of downtown core), north to south
  { id: "seattle:link:one:federal-way-downtown",           name: "Federal Way Downtown",             lines: ["one"],        slug: "Federal_Way_Downtown_station" },
  { id: "seattle:link:one:star-lake",                      name: "Star Lake",                        lines: ["one"],        slug: "Star_Lake_station" },
  { id: "seattle:link:one:kent-des-moines",                name: "Kent/Des Moines",                  lines: ["one"],        slug: "Kent/Des_Moines_station" },
  { id: "seattle:link:one:angle-lake",                     name: "Angle Lake",                       lines: ["one"],        slug: "Angle_Lake_station" },
  { id: "seattle:link:one:seatac-airport",                 name: "SeaTac/Airport",                   lines: ["one"],        slug: "SeaTac/Airport_station" },
  { id: "seattle:link:one:tukwila-international-boulevard", name: "Tukwila International Boulevard",  lines: ["one"],        slug: "Tukwila_International_Boulevard_station" },
  { id: "seattle:link:one:rainier-beach",                  name: "Rainier Beach",                    lines: ["one"],        slug: "Rainier_Beach_station" },
  { id: "seattle:link:one:othello",                        name: "Othello",                          lines: ["one"],        slug: "Othello_station" },
  { id: "seattle:link:one:columbia-city",                  name: "Columbia City",                    lines: ["one"],        slug: "Columbia_City_station" },
  { id: "seattle:link:one:mount-baker",                    name: "Mount Baker",                      lines: ["one"],        slug: "Mount_Baker_station" },
  { id: "seattle:link:one:beacon-hill",                    name: "Beacon Hill",                      lines: ["one"],        slug: "Beacon_Hill_station_(Sound_Transit)" },
  { id: "seattle:link:one:sodo",                           name: "SODO",                             lines: ["one"],        slug: "SODO_station_(Sound_Transit)" },
  { id: "seattle:link:one:stadium",                        name: "Stadium",                          lines: ["one"],        slug: "Stadium_station_(Sound_Transit)" },

  // Shared downtown tunnel + north corridor, south to north
  { id: "seattle:link:one:chinatown-international-district", name: "Chinatown–International District", lines: ["one", "two"], slug: "International_District/Chinatown_station" },
  { id: "seattle:link:one:pioneer-square",                 name: "Pioneer Square",                   lines: ["one", "two"], slug: "Pioneer_Square_station_(Sound_Transit)" },
  { id: "seattle:link:one:symphony",                       name: "Symphony",                         lines: ["one", "two"], slug: "Symphony_station_(Sound_Transit)" },
  { id: "seattle:link:one:westlake",                       name: "Westlake",                         lines: ["one", "two"], slug: "Westlake_station_(Sound_Transit)" },
  { id: "seattle:link:one:capitol-hill",                   name: "Capitol Hill",                     lines: ["one", "two"], slug: "Capitol_Hill_station" },
  { id: "seattle:link:one:university-of-washington",       name: "University of Washington",         lines: ["one", "two"], slug: "University_of_Washington_station" },
  { id: "seattle:link:one:u-district",                     name: "U District",                       lines: ["one", "two"], slug: "U_District_station" },
  { id: "seattle:link:one:roosevelt",                      name: "Roosevelt",                        lines: ["one", "two"], slug: "Roosevelt_station_(Sound_Transit)" },
  { id: "seattle:link:one:northgate",                      name: "Northgate",                        lines: ["one", "two"], slug: "Northgate_station_(Sound_Transit)" },
  { id: "seattle:link:one:shoreline-south-148th",          name: "Shoreline South/148th",            lines: ["one", "two"], slug: "Shoreline_South/148th_station" },
  { id: "seattle:link:one:shoreline-north-185th",          name: "Shoreline North/185th",            lines: ["one", "two"], slug: "Shoreline_North/185th_station" },
  { id: "seattle:link:one:mountlake-terrace",              name: "Mountlake Terrace",                lines: ["one", "two"], slug: "Mountlake_Terrace_station" },
  { id: "seattle:link:one:lynnwood-city-center",           name: "Lynnwood City Center",             lines: ["one", "two"], slug: "Lynnwood_City_Center_station" },

  // 2 Line only (Eastside branch), west to east
  { id: "seattle:link:two:judkins-park",                   name: "Judkins Park",                     lines: ["two"],        slug: "Judkins_Park_station" },
  { id: "seattle:link:two:mercer-island",                  name: "Mercer Island",                    lines: ["two"],        slug: "Mercer_Island_station" },
  { id: "seattle:link:two:south-bellevue",                 name: "South Bellevue",                   lines: ["two"],        slug: "South_Bellevue_station" },
  { id: "seattle:link:two:east-main",                      name: "East Main",                        lines: ["two"],        slug: "East_Main_station" },
  { id: "seattle:link:two:downtown-bellevue",              name: "Downtown Bellevue",                lines: ["two"],        slug: "Downtown_Bellevue_station", images: [
    "https://upload.wikimedia.org/wikipedia/commons/7/78/First_2_Line_trains_at_Bellevue_Downtown_station_-_April_27%2C_2024.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dc/Aerial_view_of_Bellevue_Transit_Center.jpg",
  ]},
  { id: "seattle:link:two:wilburton",                      name: "Wilburton",                        lines: ["two"],        slug: "Wilburton_station_(Sound_Transit)" },
  { id: "seattle:link:two:spring-district",                name: "Spring District",                  lines: ["two"],        slug: "Spring_District_station" },
  { id: "seattle:link:two:belred",                         name: "BelRed",                           lines: ["two"],        slug: "BelRed_station" },
  { id: "seattle:link:two:overlake-village",               name: "Overlake Village",                 lines: ["two"],        slug: "Overlake_Village_station" },
  { id: "seattle:link:two:redmond-technology",             name: "Redmond Technology",               lines: ["two"],        slug: "Redmond_Technology_station" },
  { id: "seattle:link:two:marymoor-village",               name: "Marymoor Village",                 lines: ["two"],        slug: "Marymoor_Village_station" },
  { id: "seattle:link:two:downtown-redmond",               name: "Downtown Redmond",                 lines: ["two"],        slug: "Downtown_Redmond_station" },
];

const lineInfo = {
  one: { name: "1 Line", color: "#0085AD", bg: "rgba(0, 133, 173, 0.12)" },
  two: { name: "2 Line", color: "#80BC00", bg: "rgba(128, 188, 0, 0.18)" },
};

export default {
  city_id:       "seattle",
  system_id:     "link",
  name:          "Seattle",
  systemName:    "Link Light Rail",
  brandTitle:    "Link Showdown",
  selectorLabel: "Seattle · Link",
  stations,
  lineInfo,
};
