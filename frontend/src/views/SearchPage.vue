<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/supabase/supabase.init'

const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = import.meta.env.VITE_TMDB_API_KEY

const searchQuery = ref('')
const searchResults = ref([])

async function searchMovies() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(searchQuery.value)}&page=1&include_adult=false`,
    )
    const responseData = await response.json()
    searchResults.value = responseData.results
    console.log(searchResults)
  } catch (error) {
    window.alert('Search failed: ', error)
    console.error('Search failed:', error)
    searchResults.value = []
  }
}
</script>

<template>
  <div class="search-page">
    <h1>Search Page</h1>

    <div class="searchBar-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        @input="searchMovies"
        class="search-input"
        placeholder="Search for a movie..."
      />
    </div>

    <p v-for="movie in searchResults" :key="movie.id">
      {{ movie.title }}
    </p>
  </div>
</template>

<style></style>
