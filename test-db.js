import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zipuuqnejwnazhxtbavv.supabase.co/rest/v1/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcHV1cW5landuYXpoeHRiYXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMzQ0NDgsImV4cCI6MjA5MzYxMDQ0OH0.cFTIhIIxhCufGEPaH8OYiedvr8aVKRbpZzpOWK_Tmw8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('formats')
    .select('*')

  if (error) {
    console.error('❌ Error:', error)
  } else {
    console.log('✅ Connected!')
    console.log('Formats:', data)
  }
}

test()