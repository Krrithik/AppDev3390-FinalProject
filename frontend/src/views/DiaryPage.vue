<script setup>
import { watch, ref, onMounted } from 'vue'
import { supabase } from '@/supabase/supabase.init'
import MovieModal from '@/components/MovieModal.vue'
import { useLikes } from '@/composables/useLikes'
import { Pencil } from 'lucide-vue-next'
import { Trash2 } from 'lucide-vue-next'

const { checkLikeStatus, toggleLike } = useLikes()

const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = import.meta.env.VITE_TMDB_API_KEY
const isLogged = ref(false)

const diaryEntries = ref([])
const user = ref(null)
const loading = ref(true)

const showModal = ref(false)
const selectedMovie = ref(null)

const reviews = ref([])
const reviewInput = ref('')
const submitting = ref(false)

const isLiked = ref(false)
const liking = ref(false)

// For logging to diary
const logDate = ref(new Date().toISOString().slice(0, 10))
const logging = ref(false)
const logSuccess = ref(false)
const logError = ref('')

async function fetchUser() {
  const response = await supabase.auth.getUser()
  user.value = response.data.user
}

async function fetchDiary() {
  loading.value = true
  if (!user.value) return
  const { data } = await supabase
    .from('diary')
    .select('*')
    .eq('user_id', user.value.id)
    .order('watched_on', { ascending: false })
  diaryEntries.value = data || []
  loading.value = false
}

function openModal(entry) {
  selectedMovie.value = entry
  showModal.value = true
  reviewInput.value = ''
  logDate.value = entry.watched_on || new Date().toISOString().slice(0, 10)
  logSuccess.value = false
  logError.value = ''

  fetchMovieDetails(entry.movie_id)
}

function closeModal() {
  showModal.value = false
  selectedMovie.value = null
  reviewInput.value = ''
}

function handleImgError(event) {
  event.target.src = '' // Use your own default image
  event.target.alt = 'N/A'
  event.target.classList.add('imgError')
}

// Fetch reviews for this movie
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
      movie_id: selectedMovie.value.movie_id,
      user_id: user.value.id,
      user_name: user.value.user_metadata?.fullName || user.value.email,
      review: reviewInput.value.trim(),
    },
  ])
  submitting.value = false
  if (!error) {
    reviewInput.value = ''
    fetchReviews(selectedMovie.value.movie_id)
  } else {
    window.alert('Something went wrong while submitting your review.')
  }
}

// Delete a review
async function handleDeleteReview(reviewId) {
  if (!user.value) return
  const confirmDelete = window.confirm('Delete this review?')
  if (!confirmDelete) return

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.value.id)

  if (error) {
    window.alert('Failed to delete review: ' + error.message)
  } else {
    fetchReviews(selectedMovie.value.movie_id)
  }
}

async function handleDeleteEntry(entryId) {
  const confirmDelete = window.confirm('Are you sure you want to delete this log entry?');
  if (!confirmDelete) return;

  const { error } = await supabase
    .from('diary')
    .delete()
    .eq('id', entryId);

  if (error) {
    window.alert('Failed to delete entry: ' + error.message);
  } else {
    // Remove the entry from the local array for instant UI update
    diaryEntries.value = diaryEntries.value.filter(entry => entry.id !== entryId);
  }
}

// Like handler
async function handleLike() {
  if (!user.value) return
  liking.value = true
  isLiked.value = await toggleLike({
    id: selectedMovie.value.movie_id,
    title: selectedMovie.value.movie_title,
    poster_path: selectedMovie.value.movie_poster,
  })
  liking.value = false

  // Sync diary liked field
  await supabase
    .from('diary')
    .update({ liked: isLiked.value })
    .eq('user_id', user.value.id)
    .eq('movie_id', selectedMovie.value.movie_id)
}

async function handleLogToggle() {
  if (!user.value || !selectedMovie.value) {
    return
  }

  const confirmDelete = window.confirm('Unlog this movie?')

  if (!confirmDelete) {
    return
  }

  logging.value = true
  logError.value = ''

  const { error } = await supabase
    .from('diary')
    .delete()
    .eq('user_id', user.value.id)
    .eq('id', selectedMovie.value.id) // 👈 Use the Supabase diary row ID, not movie_id

  if (error) {
    logError.value = 'Failed to log movie: ' + error.message;
    logging.value = false
    return
  }

  diaryEntries.value = diaryEntries.value.filter(entry => entry.id !== selectedMovie.value.id)

  showModal.value = false;
  logging.value = false
}

async function fetchMovieDetails(movieId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`)
    const data = await res.json()
    if (selectedMovie.value) {
      selectedMovie.value = {
        ...selectedMovie.value,
        overview: data.overview || 'No overview available.',
        release_date: data.release_date
      }
    }
  } catch (err) {
    console.error('Failed to fetch overview:', err)
    selectedMovie.value = {
      ...selectedMovie.value,
      overview: 'Failed to load overview.'
    }
  }
}


// Watch for modal open to fetch reviews and like status
watch(selectedMovie, async (movie) => {
  if (movie && movie.movie_id) {
    fetchReviews(movie.movie_id)
    isLiked.value = await checkLikeStatus(movie.movie_id)
    isLogged.value = await checkLogStatus(movie.movie_id)
  }
})

onMounted(async () => {
  await fetchUser()
  await fetchDiary()
})
</script>

<template>
  <div class="diaryPage">

    <!-- COLUMN HEADERS -->
    <div class="diaryHeaders">
      <span>Month</span>
      <span>Day</span>
      <span>Film</span>
      <span>Released</span>
      <span>Rating</span>
      <span>Like</span>
      <span>Edit</span>
      <span>Delete</span>
    </div>

    <div v-if="loading" class="diary-loading">Loading...</div>
    <div v-else>
      <div v-for="entry in diaryEntries" :key="entry.id" class="diaryEntry">
        <span class="month">{{ entry.watched_on ? new Date(entry.watched_on).toLocaleString('default', {
          month: 'short',
          year: 'numeric'
        }).toUpperCase() : '' || "N/A" }} </span>
        <span class="day">
          {{ entry.watched_on ? entry.watched_on.slice(8, 10) : '' || "N/A" }}
        </span>
        <div class="film">
          <img :src="imgBaseUrl + entry.movie_poster" alt="Poster" @error="handleImgError" />
          <span class="title">{{ entry.movie_title || "N/A" }}</span>
        </div>
        <span class="released">{{ entry.release_year || "N/A" }}</span>
        <span class="rating">{{ entry.rating ? entry.rating.toFixed(1) : '' || "N/A" }}</span>
        <img :src="isLiked ? '/heartFilled.png' : 'heartOutline.png'" alt="Like" @error=handleImgError class="likeIcon">
        <pencil class="edit" @click="openModal(entry)" title="Edit Details"></pencil>
        <trash2 class="delete-btn" @click="handleDeleteEntry(entry.id)" title="Delete Entry"></trash2>
      </div>
    </div>
  </div>

  <!-- FULL MODAL -->
  <MovieModal v-if="showModal" @close="closeModal">
    <div class="modalContainer">
      <div class="modalHeader">
        <div class="modalImgWrapper">
          <img :src="imgBaseUrl + selectedMovie.movie_poster" :alt="selectedMovie.movie_title" class="modalImg" />
          <div class="iconRow">
            <img :src="isLiked ? '/heartFilled.png' : '/heartOutline.png'" alt="Like" class="likeIcon"
              title="Like Movie" @click="handleLike" />
            <img :src="isLogged ? '/outlineLog.png' : '/filledLog.png'" alt="Log" class="logIcon" title="Log Movie"
              @click="handleLogToggle" />
          </div>
        </div>


        <div class="modalText">
          <div class="modalTitleRow">
            <h2 class="modalTitle">{{ selectedMovie.movie_title }}</h2>
            <span class="modalYear">({{ new Date(selectedMovie.release_date).toISOString().slice(0, 10) }})</span>
          </div>
          <p class="modalDescription">{{ selectedMovie.overview }}</p>
        </div>
      </div>

      <!-- DATE LOGGED -->
      <div class="dateLoggedRow">
        <label for="logDate">Watched on:</label>
        <input id="logDate" type="date" v-model="logDate" class="dateInput" title="Date Watched" />
      </div>

      <!-- REVIEW SECTION -->
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
              <button v-if="user && review.user_id === user.id" class="delete-review-btn"
                @click="handleDeleteReview(review.id)" title="Delete your review">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MovieModal>
</template>

<style scoped>
.diaryPage {
  padding: 40px;
  font-family: sans-serif;
  background-color: white;
  color: #111;
}

/* Grid structure */
.diaryHeaders {
  display: grid;
  grid-template-columns: 80px 60px 1fr 95px 70px 70px 45px 70px;
  align-items: center;
  padding: 5px 0px 5px 18px;
  gap: 10px;
  border-bottom: 1px solid #aaa;
}

.diaryEntry {
  display: grid;
  grid-template-columns: 80px 60px 1fr 80px 100px 60px 60px 60px;
  align-items: center;
  padding: 12px 0;
  gap: 10px;
  border-bottom: 1px solid #aaa;
  /* Add transition for smooth animation */
  transition:
    background-color 0.25s,
    transform 0.18s,
    box-shadow 0.18s;
  /* Optional: for a little depth even when not hovered */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.edit {
  color: orange;
  cursor: pointer;
  padding-left: 8px;
}

.delete-btn {
  color: black;
  cursor: pointer;
}

.diaryEntry:hover {
  background-color: papayawhip;
  /* Pop up a bit and add a shadow */
  transform: translateX(-10px) scale(1.025);
  box-shadow:
    0 4px 24px 0 rgba(160, 100, 60, 0.18),
    0 1.5px 8px 0 rgba(0, 0, 0, 0.08);
  z-index: 1;
}

.diaryEntry span {
  display: flex;
  align-items: center;
  justify-content: center;
}

.film {
  display: flex;
  align-items: center;
  gap: 10px;
}

.film img {
  width: 40px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  display: block;
}

.film img.imgError {
  width: 40px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  display: block;
  align-items: center;
  justify-content: center;
}

.title {
  font-weight: bold;
  font-size: 1rem;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


/* ALL THE STYLES COPIED FROM HOME */

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
  cursor: pointer;
}

.dateInput:focus {
  outline: 2px solid #27ae60;
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
  box-shadow: 0 0 15px #a696c8, 0 0 25px #a696c8;
  transition: all 0.3s ease;
  cursor: pointer;
}

.modalHeader {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.modalImgWrapper {
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 10px;
}

.modalImg {
  width: 190px;
  height: 270px;
  border-radius: 6px;
  object-fit: cover;
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
</style>
