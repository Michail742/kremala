import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error(
    'Λείπουν τα Supabase credentials. Δημιούργησε ένα .env με VITE_SUPABASE_URL και VITE_SUPABASE_ANON_KEY (δες .env.example).'
  )
}

export const supabase = createClient(url, anonKey, {
  realtime: { params: { eventsPerSecond: 20 } },
})
