import { ref } from 'vue'
import { supabase } from '@/supabase/supabase.init'

export function useLikes() {
  const likedMovies = ref([])
  const loadingLikes = ref(false)

  // Check if current user has liked a movie
  async function checkLikeStatus(movieId){
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return false
    
    const { data } = await supabase
      .from('likes')
      .select()
      .eq('movie_id', movieId)
      .eq('user_id', user.id)
      .single()

    return !!data
  }

  // Toggle like status for a movie
  async function toggleLike(movie){
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { data: existingLike } = await supabase
      .from('likes')
      .select()
      .eq('movie_id', movie.id)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)
      return false
    } else {
      await supabase.from('likes').insert([{
        movie_id: movie.id,
        user_id: user.id,
        movie_title: movie.title,
        movie_poster: movie.poster_path
      }])
      return true
    }
  }

  // Fetch all liked movies for current user
  async function fetchUserLikes() {
    loadingLikes.value = true
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { data } = await supabase
      .from('likes')
      .select()
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    likedMovies.value = data || []
    loadingLikes.value = false
  }

  return {
    likedMovies,
    loadingLikes,
    checkLikeStatus,
    toggleLike,
    fetchUserLikes
  }
}
