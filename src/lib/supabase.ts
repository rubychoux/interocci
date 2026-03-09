import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://atwodmqvcgkcafwfjhbl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0d29kbXF2Y2drY2Fmd2ZqaGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTE1MTIsImV4cCI6MjA4ODYyNzUxMn0.WPOj7fDDJxTU3Fg91t_YXTdgRPURTNauXm91tyDH2nQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
