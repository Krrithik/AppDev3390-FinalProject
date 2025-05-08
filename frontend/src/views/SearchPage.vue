<script setup>
import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/supabase/supabase.init'
import { useLikes } from '@/composables/useLikes'
import { Search } from 'lucide-vue-next'
import MovieModal from '@/components/MovieModal.vue'

const { checkLikeStatus, toggleLike } = useLikes()

const showModal = ref(false)
const selectedMovie = ref(null)
const reviews = ref([])
const isLogged = ref(false)
const reviewInput = ref('')
const submitting = ref(false)
const user = ref(null)
const isLiked = ref(false)
const liking = ref(false)
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = import.meta.env.VITE_TMDB_API_KEY
const searchQuery = ref('')
const searchResults = ref([])
const loading = ref(true)

/* For Adding to diary functions */
const logDate = ref(new Date().toISOString().slice(0, 10))
const logging = ref(false)
const logSuccess = ref(false)
const logError = ref('')

//LIVE SEARCHES
async function searchMovies() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(searchQuery.value)}&page=1&include_adult=false`
    )
    const responseData = await response.json()
    searchResults.value = (responseData.results || []).slice(0, 15)
  } catch (error) {
    console.error('Search failed:', error)
    window.alert('Search failed.')
    searchResults.value = []
  }
}

//ATTAIN CURRENT USER
async function fetchUser() {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  user.value = currentUser
}

async function checkLogStatus(movieId) {
  const { data, error } = await supabase
    .from('diary')
    .select('id')
    .eq('user_id', user.value.id)
    .eq('movie_id', movieId)
    .maybeSingle()

  return !!data
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

//IN CASE IMAGE CANNOT BE LOADED
function handleImgError(event) {
  event.target.src = ''
  event.target.alt =
    'Image could not be loaded; this may be due to unavailability or an error on our part.'
  event.target.classList.add('imgError') //SEE CSS ENTRY FOR MORE
}

//GET CURRENT REVIEWS FOR MOVIE
async function fetchReviews(movieId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false })
  reviews.value = data || []
}

//ALLOWS REVIEW SUBMISSION
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

//DELETING CURRENT USERS REVIEWS
async function handleDeleteReview(reviewId) {
  if (!user.value) return
  const confirmDelete = window.confirm('Delete this review?')
  if (!confirmDelete) return

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.value.id) // extra check in database for current user

  if (error) {
    window.alert('Failed to delete review: ' + error.message)
  } else {
    // Refresh reviews after delete
    fetchReviews(selectedMovie.value.id)
  }
}

//LIKE BUTTON FUNCTION
async function handleLike() {
  if (!user.value) return
  liking.value = true
  isLiked.value = await toggleLike(selectedMovie.value)
  liking.value = false
}

//HANDLING ADD DATA TO DIARY
async function handleLogToggle() {
  if (!user.value) {
    return
  }

  logging.value = true
  logError.value = ''

  if (isLogged.value) {
    const { error } = await supabase
      .from('diary')
      .delete()
      .eq('user_id', user.value.id)
      .eq('movie_id', selectedMovie.value.id)

    if (error) {
      logError.value = 'Failed to unlog movie: ' + error.message
    } else {
      isLogged.value = false
    }
  } else {
    const { error } = await supabase.from('diary').insert([{
      user_id: user.value.id,
      movie_id: selectedMovie.value.id,
      movie_title: selectedMovie.value.title,
      movie_poster: selectedMovie.value.poster_path,
      release_year: selectedMovie.value.release_date ? Number(selectedMovie.value.release_date.slice(0, 4)) : null,
      rating: selectedMovie.value.vote_average,
      liked: isLiked.value,
      watched_on: logDate.value
    }])

    if (error) {
      logError.value = 'Failed to log movie: ' + error.message;
      window.alert(logError.value)
    } else {
      isLogged.value = true
      logSuccess.value = true;
      setTimeout(() => logSuccess.value = false, 2000)
    }
  }
  logging.value = false
}

//CHECK IF USER HAS IT LIKED AND CALLS REVIEWS
watch(selectedMovie, async (movie) => {
  if (movie && movie.id) {
    fetchReviews(movie.id)
    isLiked.value = await checkLikeStatus(movie.id)
    isLogged.value = await checkLogStatus(movie.id)
  }
})

onMounted(async () => {
  await fetchUser()
  loading.value = false
})
</script>

<!-- TEMPLATE -->
<template>
  <div class="searchPage">

    <div v-if="loading" class="spinnerOverlay">
      <div class="spinner"></div>
    </div>

    <!-- SEARCH BAR -->
    <div v-else class="searchBarWrapper">
      <div class="searchInputContainer">
        <input type="text" v-model="searchQuery" @input="searchMovies" class="searchInput"
          placeholder="Search for a movie..." />
        <Search class="searchIcon" />
      </div>
    </div>

    <!-- MOVIE ON LEFT -->
    <section class="searchResultsSection">
      <div class="searchResultCard" v-for="movie in searchResults" :key="movie.id" @click="openModal(movie)">
        <img :src="imgBaseUrl + movie.poster_path" :alt="movie.title" class="resultImg"
          @error="handleImgError($event)" />

        <!-- DETAILS RIGHT OF MOVIE -->
        <div class="resultDetails">
          <h2 class="resultTitle">{{ movie.title }}</h2>
          <p class="resultYear">{{ movie.release_date }}</p>
          <p class="resultOverview">
            {{
              movie.overview ||
              'No description given, this may be due to unavailability or an error on our part..' }}
          </p>
        </div>
      </div>
    </section>

    <!-- MODAL WIP -->
    <MovieModal v-if="showModal" @close="closeModal">
      <div class="modalHeader">
        <div class="modalImgWrapper">
          <img :src="imgBaseUrl + selectedMovie.poster_path" :alt="selectedMovie.title" class="modalImg" />
          <div class="iconRow">
            <img :src="isLiked ? '/heartFilled.png' : '/heartOutline.png'" alt="Like" class="likeIcon"
              @click="handleLike" />
            <img :src="isLogged ? '/filledLog.png' : '/outlineLog.png'" class="logIcon" @click="handleLogToggle" />
          </div>
        </div>

        <div class="modalText">
          <div class="modalTitleRow">
            <h2 class="modalTitle">{{ selectedMovie.title }}</h2>
            <span class="modalYear">({{ selectedMovie.release_date }})</span>
          </div>
          <p class="modalDescription">{{ selectedMovie.overview }}</p>
        </div>
      </div>

      <!-- LOG SECTION  -->
      <div class="dateLoggedRow">
        <label for="logDate">Watched on:</label>
        <input id="logDate" type="date" v-model="logDate" class="dateInput" />
      </div>

      <div class="reviewsWrapper">
        <h3 class="reviewsLabel">Reviews</h3>

        <div class="reviewInputBar">
          <input v-model="reviewInput" :disabled="submitting" class="reviewInput" placeholder="Write your review..."
            @keyup.enter="submitReview" />
          <button @click="submitReview" :disabled="submitting || !reviewInput.trim()" class="reviewSubmitBtn">
            Send
          </button>
        </div>
        <div class="reviewsSection">
          <div v-if="reviews.length === 0" class="reviewsEmpty">No reviews yet.</div>
          <div v-else class="reviewsList">
            <div v-for="review in reviews" :key="review.id" class="reviewItem">
              <span class="reviewUser">{{ review.user_name }}</span>
              <span class="reviewText">{{ review.review }}</span>

              <!-- SHOW DELETE ONLY FOR CURRENT USER -->
              <button v-if="user && review.user_id === user.id" class="delete-review-btn"
                @click="handleDeleteReview(review.id)" title="Delete your review">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </MovieModal>
  </div>
</template>

<!-- STYLE -->
<style scoped>
.searchPage {
  padding: 2rem;
  color: white;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.spinnerOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #27ae60;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.searchBarWrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.searchInputContainer {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.searchInput {
  width: 100%;
  max-width: 500px;
  padding: 12px 40px 12px 16px;
  font-size: 1rem;
  border-radius: 20px;
  border: 2px solid black;
  outline: none;
  background: white;
  color: black;
}

.searchInput::placeholder {
  color: rgba(0, 0, 0, 0.199);
}

.searchResultsSection {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.searchResultCard {
  display: flex;
  gap: 20px;
  border: 2px solid black;
  background: white;
  border-radius: 8px;
  padding: 16px;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  cursor: pointer;
}

.searchResultCard:hover {
  background: black;
  transform: scale(1.01);
}

.searchResultCard:hover .resultTitle,
.searchResultCard:hover .resultYear,
.searchResultCard:hover .resultOverview {
  color: white;
}

.searchResultCard:hover .resultImg.imgError {
  color: white;
  background-color: black;
}

.resultImg {
  width: 120px;
  height: 180px;
  border-radius: 6px;
  object-fit: cover;
}

/* THIS IS CLASS FOR IMAGES NOT LOADED */
.resultImg.imgError {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: black;
  font-size: 0.9rem;
  width: 120px;
  height: 180px;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
}

.resultDetails {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.resultTitle {
  font-size: 1.4rem;
  margin: 0;
  color: black;
}

.resultYear {
  font-size: 1rem;
  color: black;
  margin: 4px 0 10px;
}

.resultOverview {
  font-size: 0.95rem;
  color: black;
  line-height: 1.5;
}

.modalHeader {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.modalImgWrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modalImg {
  width: 190px;
  height: 270px;
  border-radius: 6px;
  object-fit: cover;
}

.iconRow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.likeIcon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.likeIcon:hover {
  transform: scale(1.1);
}

.logIcon {
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logIcon:hover {
  transform: scale(1.1);
}

.dateLoggedRow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  color: #ccc;
  font-size: 0.95rem;
}

.dateInput {
  background: #2a2a2a;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.95rem;
}

.dateInput:focus {
  outline: 2px solid #27ae60;
}

.modalText {
  flex: 1;
}

.modalTitleRow {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.modalTitle {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  color: #fff;
}

.modalYear {
  font-size: 1rem;
  color: #aaa;
  margin-top: 4px;
}

.modalDescription {
  font-size: 1rem;
  line-height: 1.5;
  color: #ddd;
  margin-bottom: 20px;
}

.reviewsWrapper {
  margin-top: 20px;
}

.reviewsLabel {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}

.reviewInputBar {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.reviewInput {
  flex: 1 1 auto;
  padding: 8px 10px;
  border-radius: 4px;
  border: none;
  font-size: 1em;
  outline: none;
}

.reviewSubmitBtn {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

.reviewSubmitBtn:hover {
  background: #2e6730;
  transition: transform 0.3s ease;
}

.reviewSubmitBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reviewsSection {
  max-height: 200px;
  overflow-y: auto;
  background: #181818;
  border-radius: 6px;
  padding: 12px;
}

.reviewsList {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reviewItem {
  position: relative;
  background: #252525;
  border-radius: 4px;
  padding: 7px 10px;
  display: flex;
  flex-direction: column;
}

.reviewUser {
  font-size: 0.93em;
  font-weight: bold;
  color: #ffb700;
  margin-bottom: 2px;
}

.reviewText {
  font-size: 1em;
  color: #eee;
}

.reviewsEmpty {
  color: #bbb;
  font-size: 0.98em;
  text-align: center;


}

/* delete review button styles */
.delete-review-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 1.2em;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
  margin: 0;
}

.delete-review-btn:hover {
  color: #e50914;
}

/* LOG SECTION STYLES */
.log-section {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.log-btn {
  background: #209CE6;
  color: #fff;
  border: none;
  padding: 7px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

.log-success {
  color: #0bff71;
  margin-left: 10px;
}

.log-error {
  color: #ff4d4f;
  margin-left: 10px;
}
</style>
