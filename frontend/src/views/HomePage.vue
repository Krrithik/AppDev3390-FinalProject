<script setup>
import { ref, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import MovieModal from '@/components/MovieModal.vue'
import { supabase } from '@/supabase/supabase.init'
import { watch } from "vue"
import { Trash2 } from 'lucide-vue-next'

import { useLikes } from '@/composables/useLikes'
const { checkLikeStatus, toggleLike, fetchUserLikes } = useLikes()

const showModal = ref(false)
const selectedMovie = ref(null)
const isLogged = ref(false)

const reviews = ref([])
const reviewInput = ref('')
const submitting = ref(false)
const user = ref(null)

const isLiked = ref(false)
const liking = ref(false)
const loading = ref(true)

/* For Adding to diary functions */
const logDate = ref(new Date().toISOString().slice(0, 10))
const logging = ref(false)
const logSuccess = ref(false)
const logError = ref('')

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

async function checkLogStatus(movieId) {
  const { data, error } = await supabase
    .from('diary')
    .select('id')
    .eq('user_id', user.value.id)
    .eq('movie_id', movieId)
    .maybeSingle()

  return !!data
}

// GET CURRENT USER INFO (WITH FULL NAME)
async function fetchUser() {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  user.value = currentUser
}

// FETCH REVIEWS FOR A MOVIE
async function fetchReviews(movieId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false })
  reviews.value = data || []
}

// SUBMIT A NEW REVIEW
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
  } else {
    console.error('Failed to submit review:', error.message)
    window.alert('Something went wrong while submitting your review.')
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


// ADD LIKE HANDLER
async function handleLike() {
  if (!user.value) return
  liking.value = true
  isLiked.value = await toggleLike(selectedMovie.value)
  liking.value = false


  await supabase
    .from('diary')
    .update({ liked: isLiked.value })
    .eq('user_id', user.value.id)
    .eq('movie_id', selectedMovie.value.id)
}

//HANDLING ADD DATA TO DIARY
async function handleLogToggle() {
  if (!user.value) {
    return
  }

  logging.value = true
  logError.value = ''

  if (isLogged.value) {
    // Unlog
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
      isLogged.value = true;
      setTimeout(() => logSuccess.value = false, 2000)
    }
    logging.value = false
  }
}

// ADD THIS WATCH, FOR WHEN YOU SELECTING A NEW MOVIE
watch(selectedMovie, async (movie) => {
  if (movie && movie.id) {
    fetchReviews(movie.id)
    isLiked.value = await checkLikeStatus(movie.id)
    isLogged.value = await checkLogStatus(movie.id)
  }
})

onMounted(async () => {
  await Promise.all([
    fetchMovies('trending/movie/week', trendingMovies),
    fetchMovies('movie/now_playing', nowPlayingMovies),
    fetchUser()
  ])
  loading.value = false
})
</script>

<template>
  <div v-if="loading" class="spinnerOverlay">
    <div class="spinner"></div>
  </div>

  <!-- SHORT DESCRIPTION -->
  <section v-else class="description">
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
      <MovieCard v-for="movie in trendingMovies.slice(0, 6)" :key="movie.id" :title="movie.title"
        :imgUrl="imgBaseUrl + movie.poster_path" :releaseDate="movie.release_date" @click="openModal(movie)" />
    </div>
  </section>

  <!-- IN THEATERS -->
  <section class="movieSection">
    <h2 id="headerText">IN THEATERS</h2>
    <div class="movieRow">
      <MovieCard v-for="movie in nowPlayingMovies.slice(0, 6)" :key="movie.id" :title="movie.title"
        :imgUrl="imgBaseUrl + movie.poster_path" :releaseDate="movie.release_date" @click="openModal(movie)" />
    </div>
  </section>

  <!-- MODAL SECTION -->
  <MovieModal v-if="showModal" @close="closeModal">
    <!-- HEART BUTTON -->
    <div class="modalHeader">
      <div class="modalImgWrapper">
        <img :src="imgBaseUrl + selectedMovie.poster_path" :alt="selectedMovie.title" class="modalImg" />
        <div class="iconRow">
          <img :src="isLiked ? '/heartFilled.png' : '/heartOutline.png'" alt="Like" class="likeIcon" title="Like Movie"
            @click="handleLike" />
          <img :src="isLogged ? '/filledLog.png' : '/outlineLog.png'" alt="Log" class="logIcon" title="Log Movie"
            @click="handleLogToggle" />
        </div>
      </div>

      <!-- MOVIE IMG WITH TEXT TO ITS RIGHT -->
      <div class="modalText">
        <div class="modalTitleRow">
          <h2 class="modalTitle">{{ selectedMovie.title }}</h2>
          <span class="modalYear">({{ selectedMovie.release_date }})</span>
        </div>

        <!-- MOVIE DESCRIPTION -->
        <p class="modalDescription">{{ selectedMovie.overview }}</p>
      </div>
    </div>

    <div class="dateLoggedRow">
      <label for="logDate">Watched on:</label>
      <input id="logDate" type="date" v-model="logDate" class="dateInput" title="Date Watched" />
    </div>

    <!-- REVIEWS SECTION -->
    <div class="reviewsWrapper">
      <h3 class="reviewsLabel">Reviews</h3>

      <!-- WRITE REVIEW AND INPUT -->
      <div class="reviewInputBar">
        <input v-model="reviewInput" :disabled="submitting" class="reviewInput" placeholder="Write your review..."
          @keyup.enter="submitReview" />
        <button @click="submitReview" :disabled="submitting || !reviewInput.trim()" class="reviewSubmitBtn">
          Send
        </button>
      </div>

      <!-- SCROLL REVIEW LIST -->
      <div class="reviewsSection">
        <div v-if="reviews.length === 0" class="reviewsEmpty">No reviews yet.</div>
        <div v-else class="reviewsList">
          <div v-for="review in reviews" :key="review.id" class="reviewItem">
            <span class="reviewUser">{{ review.user_name }}</span>
            <span class="reviewText">{{ review.review }}</span>

            <!-- SHOW DELETE ONLY FOR CURRENT USER -->
            <Trash2 v-if="user && review.user_id === user.id" class="delete-review-btn"
              @click="handleDeleteReview(review.id)" title="Delete your review"></trash2>
          </div>
        </div>
      </div>
    </div>
  </MovieModal>
</template>

<style scoped>
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

.description {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 80px;
  font-size: 48px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

#headerText {
  font-size: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  box-shadow: 0 0 15px #a696c8, 0 0 25px #a696c8;
  transition: all 0.3s ease;
  cursor: pointer;
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
  align-items: left;
  gap: 10px;
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
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.dateInput {
  background: #2a2a2a;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.dateInput:focus {
  outline: 2px solid #27ae60;
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
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.modalYear {
  font-size: 1rem;
  color: #aaa;
  margin-top: 4px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.modalDescription {
  font-size: 1rem;
  line-height: 1.5;
  color: #ddd;
  margin-bottom: 20px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.reviewsWrapper {
  margin-top: 20px;
}

.reviewsLabel {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.reviewInputBar {
  position: static;
  margin-bottom: 16px;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 0 0 0;
  display: flex;
  gap: 8px;
  align-items: center;
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
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.reviewText {
  font-size: 1em;
  color: #eee;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.reviewsEmpty {
  color: #bbb;
  font-size: 0.98em;
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.reviewInput {
  flex: 1 1 auto;
  padding: 8px 10px;
  border-radius: 4px;
  border: none;
  font-size: 1em;
  outline: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.reviewSubmitBtn {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.reviewSubmitBtn:hover {
  background: #2e6730;
  transition: transform 0.3s ease;

}

.reviewSubmitBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* DELETE INSIDE REVIEW */
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