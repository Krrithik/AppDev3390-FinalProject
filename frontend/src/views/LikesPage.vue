<script setup>
import { ref, onMounted } from 'vue'
import { useLikes } from '@/composables/useLikes'
import { supabase } from '@/supabase/supabase.init'

const { likedMovies, loadingLikes, fetchUserLikes } = useLikes()
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'

onMounted(async () => {
  await fetchUserLikes()
})
</script>

<template>
  <h1>Liked Movies</h1>
  <div v-if="loadingLikes" class="loading">Loading...</div>
  <div v-else-if="!likedMovies.length" class="empty">No liked movies yet.</div>
  <div v-else class="movie-grid">
    <div v-for="movie in likedMovies" :key="movie.id" class="liked-movie">
      <img 
        :src="imgBaseUrl + movie.movie_poster" 
        :alt="movie.movie_title"
        class="liked-poster"
      />
      <h3>{{ movie.movie_title }}</h3>
    </div>
  </div>
</template>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.liked-movie {
  text-align: center;
}

.liked-poster {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
