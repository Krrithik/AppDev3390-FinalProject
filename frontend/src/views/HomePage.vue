<script setup>
import { ref, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue';
import MovieModal from '@/components/MovieModal.vue';

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
    <h2 id="headerText">TRENDING</h2>
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
    <h2 id="headerText">IN THEATERS</h2>
    <div class="movieRow">
      <MovieCard 
      v-for="movie in nowPlayingMovies.slice(0, 6)"
          :key="movie.id"
          :title="movie.title"
          :imgUrl="imgBaseUrl + movie.poster_path"
          :releaseDate="movie.release_date"
          @click="openModal(movie)"
          />
    </div>
  </section>


  <!-- Modal -->
<MovieModal v-if="showModal" @close="closeModal">

  <template #default>
      <h2>{{ selectedMovie.title }}</h2>
      <img :src="imgBaseUrl + selectedMovie.poster_path" :alt="selectedMovie.title" style="width:150px;"/>
      <p><strong>Release:</strong> {{ selectedMovie.release_date }}</p>
      <p><strong>Description:</strong> {{ selectedMovie.overview }}</p>
      <textarea v-model="reviewInput" placeholder="Write your review here..." style="width:100%;margin:10px 0;"></textarea>
      <button @click="handleLike" class="like-btn">❤️ Like & Save</button>
    </template>
</MovieModal>


  
</template>

<!-- STYLE -->
<!-- NOTE: Style Scoped applies styling to just this view, instead of all others -->
<style scoped>
.description {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 80px;
  font-size: 48px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

#headerText {
  font-size: 30px;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
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