import { createClient } from '@supabase/supabase-js'

const supabaseURL = import.meta.env.VUEAPP_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VUEAPP_SUPABASE_ANONKEY

export const supabase = createClient(supabaseURL, supabaseAnonKey)

