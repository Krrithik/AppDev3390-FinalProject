<script setup>
import { ref, watch } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import MovieModal from '@/components/MovieModal.vue'
import { supabase } from '@/supabase/supabase.init'
import { useLikes } from '@/composables/useLikes'
import { Search } from 'lucide-vue-next'

const { checkLikeStatus, toggleLike } = useLikes()

const query = ref('')
const searchResults = ref([])
const showModal = ref(false)
const selectedMovie = ref(null)

const reviews = ref([])
const reviewInput = ref('')
const submitting = ref(false)
const user = ref(null)

const isLiked = ref(false)
const liking = ref(false)

const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = import.meta.env.VITE_TMDB_API_KEY

// Fetch user info
async function fetchUser() {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  user.value = currentUser
}

// Search movies from TMDB
async function searchMovies() {
  if (!query.value.trim()) {
    searchResults.value = []
    return
  }
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query.value)}&page=1&include_adult=false`
    )
    const data = await res.json()
    searchResults.value = (data.results || []).slice(0, 15)
  } catch (err) {
    console.error('Search failed:', err)
    searchResults.value = []
  }
}

// Modal logic
function openModal(movie) {
  selectedMovie.value = movie
  showModal.value = true
}
function closeModal() {
  showModal.value = false
  selectedMovie.value = null
  reviewInput.value = ''
}

// Fetch reviews for a movie
async function fetchReviews(movieId) {
  const { data } = await supabase
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

// Like handler
async function handleLike() {
  if (!user.value) return
  liking.value = true
  isLiked.value = await toggleLike(selectedMovie.value)
  liking.value = false
}

// Watch for modal open to fetch reviews and like status
watch(selectedMovie, async (movie) => {
  if (movie && movie.id) {
    fetchReviews(movie.id)
    isLiked.value = await checkLikeStatus(movie.id)
  }
})

// Fetch user on mount
fetchUser()
</script>

<template>
  <main class="searchPage">
    <h1 class="searchTitle">Search Movies</h1>
    <div class="searchBarWrapper">
      <input
        v-model="query"
        @input="searchMovies"
        type="text"
        class="searchInput"
        placeholder="Search for a movie..."
      />
      <span class="searchIcon">
        <Search />
      </span>
    </div>
    <section class="resultsSection">
      <div v-if="searchResults.length === 0 && query" class="noResults">No results found.</div>
      <div v-else class="movieRow">
        <MovieCard
          v-for="movie in searchResults"
          :key="movie.id"
          :title="movie.title"
          :imgUrl="imgBaseUrl + movie.poster_path"
          :releaseDate="movie.release_date"
          @click="openModal(movie)"
        />
      </div>
    </section>

    <!-- Modal (same as homepage) -->
    <MovieModal v-if="showModal" @close="closeModal">
      <h2>{{ selectedMovie.title }}</h2>
      <img :src="imgBaseUrl + selectedMovie.poster_path" :alt="selectedMovie.title" class="modal-poster" />
      <p><strong>Release:</strong> {{ selectedMovie.release_date }}</p>
      <p><strong>Description:</strong> {{ selectedMovie.overview }}</p>

      <!-- like section -->
      <div class="review-input-bar">
        <button 
          @click="handleLike" 
          class="like-btn"
          :disabled="liking"
          :class="{ 'liked': isLiked }"
        >
          {{ isLiked ? '❤️ Liked' : '🤍 Like' }}
        </button>
      </div>

      <!-- Reviews Section -->
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

      <!-- Review Input -->
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
  </main>
</template>

<style scoped>
.searchPage {
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.searchTitle {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: #222;
  text-align: center;
}

.searchBarWrapper {
  position: relative;
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.searchInput {
  width: 100%;
  max-width: 400px;
  padding: 10px 38px 10px 14px;
  border: 2px solid #209CE6;
  border-radius: 18px;
  font-size: 1.1rem;
  outline: none;
  background: #f9f9f9;
  transition: border 0.2s;
}
.searchInput:focus {
  border: 2px solid #0a7ac7;
}

.searchIcon {
  position: absolute;
  right: 22px;
  color: #209CE6;
  pointer-events: none;
}

.resultsSection {
  margin-top: 24px;
}

.noResults {
  text-align: center;
  color: #aaa;
  font-size: 1.2rem;
  margin-top: 32px;
}

.movieRow {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.modal-poster {
  display: block;
  margin: 0 auto 16px auto;
  width: 220px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.review-input-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
}

.like-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #209CE6;
  transition: color 0.2s;
}
.like-btn.liked {
  color: #e63946;
}

.reviews-section {
  margin: 18px 0;
  max-height: 180px;
  overflow-y: auto;
  background: #f6f8fa;
  border-radius: 10px;
  padding: 10px 16px;
}

.reviews-empty {
  color: #aaa;
  font-style: italic;
  text-align: center;
  padding: 12px 0;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-item {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.review-user {
  font-weight: bold;
  color: #209CE6;
  font-size: 1rem;
}

.review-text {
  margin-left: 2px;
  color: #222;
  font-size: 1.04rem;
}

.review-input {
  flex: 1;
  padding: 8px 12px;
  border: 1.5px solid #209CE6;
  border-radius: 12px;
  font-size: 1rem;
}

.review-submit-btn {
  background: #209CE6;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 7px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.review-submit-btn:disabled {
  background: #b2d9f7;
  cursor: not-allowed;
}
</style>
