<script setup>
import { ref, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import MovieModal from '@/components/MovieModal.vue'
import { supabase } from '@/supabase/supabase.init'
import { watch } from "vue"

const showModal = ref(false)
const selectedMovie = ref(null)

const reviews = ref([])
const reviewInput = ref('')
const submitting = ref(false)
const user = ref(null)

const trendingMovies = ref([])
const nowPlayingMovies = ref([])
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = import.meta.env.VITE_TMDB_API_KEY

async function fetchMovies(endpoint, targetRef) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=en-US&page=1`,
    )
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

// Get current user info (with full name)
async function fetchUser() {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  user.value = currentUser
}

// Fetch reviews for a movie
async function fetchReviews(movieId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false })
  reviews.value = data || []
}

// Submit a new review
async function submitReview() {
  if (!reviewInput.value.trim() || !user.value) return
  submitting.value = true
  const { error } = await supabase.from('reviews').insert([
    {
      movie_id: selectedMovie.value.id,
      user_id: user.value.id,
      user_name: user.value.user_metadata?.fullName || user.value.email,
      review: reviewInput.value.trim(),
    },
  ])
  submitting.value = false
  if (!error) {
    reviewInput.value = ''
    fetchReviews(selectedMovie.value.id)
  }
}


watch(selectedMovie, (movie) => {
  if (movie && movie.id) {
    fetchReviews(movie.id)
  }
})

onMounted(() => {
  fetchMovies('trending/movie/week', trendingMovies)
  fetchMovies('movie/now_playing', nowPlayingMovies)
  fetchUser()
})
</script>

<template>
  <!-- SHORT DESCRIPTION -->
  <section class="description">
    <p>
      Jot the films you've seen.<br />
      Note films to watch next.<br />
      Then tell your friends the great ones.
    </p>
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
    <h2>{{ selectedMovie.title }}</h2>
    <img
      :src="imgBaseUrl + selectedMovie.poster_path"
      :alt="selectedMovie.title"
      class="modal-poster"
    />
    <p><strong>Release:</strong> {{ selectedMovie.release_date }}</p>
    <p><strong>Description:</strong> {{ selectedMovie.overview }}</p>

    <!-- Scrollable Reviews Section -->
    <div class="reviews-section">
      <h3>Reviews</h3>
      <div v-if="reviews.length === 0" class="reviews-empty">No reviews yet.</div>
      <div v-else class="reviews-list">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <span class="review-user">{{ review.user_name }}</span>
          <span class="review-text">{{ review.review }}</span>
        </div>
      </div>
    </div>

    <!-- Review Input Fixed at Bottom -->
    <div class="review-input-bar">
      <input
        v-model="reviewInput"
        :disabled="submitting"
        class="review-input"
        placeholder="Write your review..."
        @keyup.enter="submitReview"
      />
      <button
        @click="submitReview"
        :disabled="submitting || !reviewInput.trim()"
        class="review-submit-btn"
      >
        Send
      </button>
    </div>
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
  font-family:
    'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
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
  box-shadow:
    0 0 15px #a696c8,
    0 0 25px #a696c8;
  transition: all 0.3s ease;
}

.modal-poster {
  width: 150px;
  border-radius: 6px;
  margin-bottom: 12px;
}
.reviews-section {
  margin: 16px 0 0 0;
  max-height: 180px;
  overflow-y: auto;
  background: #181818;
  border-radius: 6px;
  padding: 12px;
}
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.review-item {
  background: #252525;
  border-radius: 4px;
  padding: 7px 10px;
  display: flex;
  flex-direction: column;
}
.review-user {
  font-size: 0.93em;
  font-weight: bold;
  color: #ffb700;
  margin-bottom: 2px;
}
.review-text {
  font-size: 1em;
  color: #eee;
}
.reviews-empty {
  color: #bbb;
  font-size: 0.98em;
  text-align: center;
}
.review-input-bar {
  position: sticky;
  bottom: 0;
  left: 0; right: 0;
  background: #181818;
  padding: 10px 0 0 0;
  display: flex;
  gap: 8px;
  align-items: center;
}
.review-input {
  flex: 1 1 auto;
  padding: 8px 10px;
  border-radius: 4px;
  border: none;
  font-size: 1em;
  outline: none;
}
.review-submit-btn {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}
.review-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
