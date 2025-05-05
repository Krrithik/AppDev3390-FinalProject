<!-- <script setup>
import { ref, onMounted } from 'vue'

const imgURL = 'https://image.tmdb.org/t/p/w500'
const nowPlaying = ref([]) // Reactive array to hold movies

async function getMovies(url) {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const response = await fetch(`${url}?api_key=${apiKey}`)
    const data = await response.json()
    nowPlaying.value = data.results // Update reactive variable
    console.log(data.results)
  } catch (err) {
    console.error(err)
  }
}

// Fetch when component mounts
onMounted(() => {
  getMovies('https://api.themoviedb.org/3/movie/now_playing')
})
</script>

<template>
  <div>
    <div v-for="movie in nowPlaying" :key="movie.id">
      <h2>{{ movie.title }}</h2>
      <img :src="imgURL + movie.poster_path" alt="Movie poster" />
    </div>
  </div>
</template>


 -->

<script setup>
defineProps({
  title: String,
  imgUrl: String,
  releaseDate: String,
})
</script>

<template>
  <section class="movieSection">
      <img v-if="imgUrl" :src="imgUrl" :alt="title" class="movieBox" />
    <div class="movieInfo">
      <h3 class="movieTitle">{{ title }}</h3>
      <p class="movieDate">{{ releaseDate }}</p>
    </div>
  </section>
</template>

<style scoped>
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

/* Maybe Keep This 
.movieInfo { 
  padding: 8px;
  color: white;
}
*/

/* For Title Text 
.movieTitle {
  font-size: 1em;
  color: white;
  margin: 0 0 4px;
}
*/

/* For Year Text
.movieDate {
  font-size: 0.9em;
  color: #bbb;
  margin: 0;
} */
</style>
