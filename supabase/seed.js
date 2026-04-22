import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import vancouver from "../src/cities/vancouver.js";
import seattle from "../src/cities/seattle.js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Add city files here as new cities are added
const CITIES = [vancouver, seattle];

async function seed() {
  for (const city of CITIES) {
    const rows = city.stations.map((s) => ({
      id:        s.id,
      city_id:   city.city_id,
      system_id: city.system_id,
      line_ids:  s.lines,
      slug:      s.slug,
      name:      s.name,
      elo:       1500,
      matches:   0,
    }));

    const { error } = await supabase
      .from("stations")
      .upsert(rows, { onConflict: "id", ignoreDuplicates: false });

    if (error) {
      console.error(`Error seeding ${city.city_id}:`, error.message);
      process.exit(1);
    }

    console.log(`Seeded ${rows.length} stations for ${city.city_id}:${city.system_id}`);
  }
}

seed();
