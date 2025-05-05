<script setup>
import { ref, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue';

const showModal = ref(false)
const selectedMovie = ref(null)

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


function openModal(movie) {
  selectedMovie.value = movie
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedMovie.value = null
  reviewInput.value = ''
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
          :releaseDate="movie.release_date" 
           @click="openModal(movie)"
          />
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


  <!-- Modal -->
  <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">×</button>
      <h2>{{ selectedMovie.title }}</h2>
      <img :src="imgBaseUrl + selectedMovie.poster_path" :alt="selectedMovie.title" style="width:150px;"/>
      <p><strong>Release:</strong> {{ selectedMovie.release_date }}</p>
      <p><strong>Description:</strong> {{ selectedMovie.overview }}</p>
      <textarea v-model="reviewInput" placeholder="Write your review here..." style="width:100%;margin:10px 0;"></textarea>
      <button @click="handleLike" class="like-btn">❤️ Like & Save</button>
    </div>
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


.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #222;
  color: #fff;
  border-radius: 8px;
  padding: 24px;
  min-width: 300px;
  max-width: 90vw;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 8px; right: 12px;
  background: none;
  border: none;
  color: #fff;
  font-size: 2em;
  cursor: pointer;
}
.like-btn {
  background: #e50914;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
}
</style>