<script setup>
import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/supabase/supabase.init'
import { useLikes } from '@/composables/useLikes'
import MovieCard from '@/components/MovieCard.vue'
import MovieModal from '@/components/MovieModal.vue'
const { checkLikeStatus, toggleLike } = useLikes()

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
    searchResults.value = (responseData.results || []).slice(0, 15)
    console.log(searchResults)
  } catch (error) {
    window.alert('Search failed: ', error)
    console.error('Search failed:', error)
    searchResults.value = []
  }
}

async function fetchUser() {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  user.value = currentUser
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

// Add like handler
async function handleLike() {
  if (!user.value) return
  liking.value = true
  isLiked.value = await toggleLike(selectedMovie.value)
  liking.value = false
}


// Add this watch
watch(selectedMovie, async (movie) => {
  if (movie && movie.id) {
    fetchReviews(movie.id)
    isLiked.value = await checkLikeStatus(movie.id)
  }
})

onMounted(() => {
  fetchUser()
})
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

    <section class="search-results-section">
      <div class="movieRow">
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
  </div>
</template>

<style></style>
