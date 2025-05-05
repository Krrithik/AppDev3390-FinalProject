import { ref } from 'vue'
import { supabase } from '@/supabase/supabase.init'

const user = ref(null)

// Listen for auth changes
supabase.auth.getUser().then(({ data }) => {
  user.value = data.user
})

supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user || null
})

export function useAuth() {
  return { user }
}
