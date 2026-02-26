import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Storage wrapper — same interface the app already uses
export const db = {
  async get(email) {
    const { data, error } = await supabase
      .from('sessions')
      .select('data')
      .eq('email', email)
      .single()

    if (error || !data) return null
    return data.data
  },

  async set(email, state) {
    const { error } = await supabase
      .from('sessions')
      .upsert(
        { email, data: state, updated_at: new Date().toISOString() },
        { onConflict: 'email' }
      )

    if (error) {
      console.error('Save failed:', error)
      return false
    }
    return true
  },
}
