<script setup>
import { ref, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue';

const movies = ref([])
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = import.meta.env.VITE_TMDB_API_KEY


async function fetchNowPlaying() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`)
    const data = await res.json()
    movies.value = data.results
  } catch (err) {
    console.error('Failed to fetch movies:', err)
  }
}

onMounted(fetchNowPlaying)
</script>

<template>
  <!-- SHORT DESCRIPTION -->
  <section class="description">
    <p>Jot the films you've seen.<br />
      Note films to watch next.<br />
      Then tell your friends the great ones.</p>
  </section>


  <!-- TRENDING SECTION -->
  <section class="movieSection">
    <h2>TRENDING</h2>
    <div class="movieRow">
      <div v-for="n in 6" :key="n" class="movieBox"></div>
    </div>
  </section>

  <!-- IN THEATERS -->
  <section class="movieSection">
    <h2>IN THEATERS</h2>
    <div class="movieRow">
      <MovieCard 
      v-for="movie in movies.slice(0, 6)"
          :key="movie.id"
          :title="movie.title"
          :imgUrl="imgBaseUrl + movie.poster_path"
          :releaseDate="movie.release_date" />
    </div>
  </section>

  <div>
    <!-- Put Trending Movies Here -->
  </div>
</template>

<!-- STYLE -->
<!-- NOTE: Style Scoped applies styling to just this view, instead of all others -->
<style scoped>
.description {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 80px;
  font-size: 1.1em;
}

.movieSection {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
}

.movieRow {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.movieBox {
  width: 156px;
  height: 231px;
  background-color: black;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>