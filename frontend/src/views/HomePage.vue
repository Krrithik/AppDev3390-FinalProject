<script setup>
import { ref, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue';

const trendingMovies = ref([])
const nowPlayingMovies = ref([])
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = import.meta.env.VITE_TMDB_API_KEY


async function fetchMovies(endpoint, targetRef) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=en-US&page=1`)
    const data = await res.json()
    targetRef.value = data.results
  } catch (err) {
    console.error(`Failed to fetch ${endpoint}:`, err)
  }
}

onMounted(() => {
  fetchMovies('trending/movie/week', trendingMovies)
  fetchMovies('movie/now_playing', nowPlayingMovies)
})
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
      <MovieCard 
      v-for="movie in trendingMovies.slice(0, 6)"
          :key="movie.id"
          :title="movie.title"
          :imgUrl="imgBaseUrl + movie.poster_path"
          :releaseDate="movie.release_date" />
    </div>
  </section>

  <!-- IN THEATERS -->
  <section class="movieSection">
    <h2>IN THEATERS</h2>
    <div class="movieRow">
      <MovieCard 
      v-for="movie in nowPlayingMovies.slice(0, 6)"
          :key="movie.id"
          :title="movie.title"
          :imgUrl="imgBaseUrl + movie.poster_path"
          :releaseDate="movie.release_date" />
    </div>
  </section>

  
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.movieBox:hover {
  /* THIS IS COMPIED FROM MY 2650 PROJ, CHANGE COLORS LATER */
  transform: scale(1.05);
  box-shadow: 0 0 15px #A696C8, 0 0 25px #A696C8; 
  transition: all 0.3s ease; 
} 
</style>