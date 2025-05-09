<script setup>
import { watch, ref, onMounted, computed } from 'vue'
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

//FOR SPINNER
const loading = ref(true)

//ADJUST AS WANTED
const currentPage = ref(1)
const itemsPerPage = 10

const showModal = ref(false)
const selectedMovie = ref(null)

const reviews = ref([])
const reviewInput = ref('')
const submitting = ref(false)

const isLiked = ref(false)
const liking = ref(false)

// FOR LOGGING TO DIARY
const logDate = ref(new Date().toISOString().slice(0, 10))
const logging = ref(false)
const logSuccess = ref(false)
const logError = ref('')

//CREATES TABS OFF PAGES
const totalPages = computed(() =>
  Math.ceil(diaryEntries.value.length / itemsPerPage)
)

//SHOWS WHAT PAGES ARE SHOWN ON WHICH TAB
const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return diaryEntries.value.slice(start, start + itemsPerPage)
})

//REDIRECTION
function goToPage(page) {
  currentPage.value = page
}

function openModal(entry) {
  console.log("Opened Modal:", entry)

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

//HANDLES MOVIE IMG WHEN ERROR
function handleImgError(event) {
  event.target.src = '' // Use your own default image
  event.target.alt = 'N/A'
  event.target.classList.add('imgError')
}

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

//FETCH REVIEWS FOR THIS MOVIE
async function fetchReviews(movieId) {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false })
  reviews.value = data || []
}

//SUBMIT A NEW REVIEW
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

//DELETE A REVIEW
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

//DELETE AN ENTRY VIA UNLOG 
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
    //REMOVE THE ENTRY FROM THE LOCAL ARRAY FOR INSTANT UI UPDATE
    diaryEntries.value = diaryEntries.value.filter(entry => entry.id !== entryId);
  }
}

async function toggleEntryLike(entry) {
  if (!user.value) return

  const newLikeState = await toggleLike({
    id: entry.movie_id,
    title: entry.movie_title,
    poster_path: entry.movie_poster,
  })

  //UPDATE DIARY.LIKED IN SUPABASE DIRECTLY 
  const { error } = await supabase
    .from('diary')
    .update({ liked: newLikeState })
    .eq('user_id', user.value.id)
    .eq('id', entry.id)

  if (error) {
    console.error('Failed to sync diary like field:', error.message)
    return
  }

  //UPDATE LOCALLY 
  const index = diaryEntries.value.findIndex(e => e.id === entry.id)
  if (index !== -1) {
    diaryEntries.value[index] = {
      ...diaryEntries.value[index],
      liked: newLikeState
    }
  }
}

//LIKE HANDLER
async function handleLike() {
  if (!user.value) return
  liking.value = true
  isLiked.value = await toggleLike({
    id: selectedMovie.value.movie_id,
    title: selectedMovie.value.movie_title,
    poster_path: selectedMovie.value.movie_poster,
  })
  liking.value = false

  //SYNC DIARY LIKED FIELD
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
    .eq('id', selectedMovie.value.id)

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
        release_date: data.release_date || null
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

async function checkLogStatus(movieId) {
  const { data } = await supabase
    .from('diary')
    .select('id')
    .eq('user_id', user.value.id)
    .eq('movie_id', movieId)
    .maybeSingle()

  return !!data
}

//WATCH FOR MODAL OPEN TO FETCH REVIEWS AND LIKE STATUS
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

    <!-- SPINNER -->
    <div v-if="loading" class="spinnerOverlay">
      <div class="spinner"></div>
    </div>

    <!-- DIARY ENTRIES -->
    <div v-else>
      <div v-for="entry in paginatedEntries" :key="entry.id" class="diaryEntry">
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
        <img :src="entry.liked ? '/heartFilled.png' : '/heartOutline.png'" alt="Like" class="likeIcon"
          @click=toggleEntryLike(entry) title="Toggle Like">
        <Pencil class="edit" @click="openModal(entry)" title="Edit Details"></pencil>
        <Trash2 class="delete-btn" @click="handleDeleteEntry(entry.id)" title="Delete Entry"></trash2>
      </div>

      <!-- TABS -->
      <div v-if="totalPages > 1" class="pagination">
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
          :class="{ active: currentPage === page }">
          {{ page }}
        </button>
      </div>

    </div>
  </div>

  <!-- MODAL -->
  <MovieModal v-if="showModal" @close="closeModal">
    <div class="modalContainer">
      <div class="modalHeader">

        <!-- MOVIE IMAGE -->
        <div class="modalImgWrapper">
          <img :src="imgBaseUrl + selectedMovie.movie_poster" :alt="selectedMovie.movie_title" class="modalImg" />

          <!-- ICONS BELOW MOVIE -->
          <div class="iconRow">
            <img :src="isLiked ? '/heartFilled.png' : '/heartOutline.png'" alt="Like" class="likeIcon"
              title="Like Movie" @click="handleLike" />
            <img :src="isLogged ? '/filledLog.png' : '/outlineLog.png'" alt="Log" class="logIcon"
              :class="{ inverted: !isLogged }" title="Log Movie" @click="handleLogToggle" />
          </div>
        </div>

        <!-- MOVIE TITLE AND YEAR -->
        <div class="modalText">
          <div class="modalTitleRow">
            <h2 class="modalTitle">{{ selectedMovie.movie_title }}</h2>
            <span class="modalYear">({{ selectedMovie.release_date ?
              new Date(selectedMovie.release_date).toISOString().slice(0, 10) : "Unknown" }})</span>
          </div>

          <!-- MOVIE DESCRIPTION -->
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

        <!-- WRITE REVIEW INPUT AND BUTTON -->
        <div class="reviewInputBar">
          <input v-model="reviewInput" :disabled="submitting" class="reviewInput" placeholder="Write your review..."
            @keyup.enter="submitReview" />
          <button @click="submitReview" :disabled="submitting || !reviewInput.trim()" class="reviewSubmitBtn">
            Send
          </button>
        </div>

        <!-- REVIEWS FOR MOVIE -->
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
    </div>
  </MovieModal>
</template>

<style scoped>
.inverted {
  filter: invert(1);
  transition: filter 0.2s ease;
}

.diaryPage {
  padding: 40px;
  font-family: sans-serif;
  background-color: #023047;
  color: #EAFBFC;
  min-height: 100vh;
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

/* Grid structure */
.diaryHeaders {
  display: grid;
  grid-template-columns: 80px 60px 1fr 95px 70px 70px 45px 70px;
  align-items: center;
  padding: 5px 0px 5px 18px;
  color: #EAFBFC;
  border-bottom: 1px solid #8ECAE6;
  gap: 10px;
  font-size: 17px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.diaryEntry {
  display: grid;
  grid-template-columns: 80px 60px 1fr 80px 100px 60px 60px 60px;
  align-items: center;
  padding: 12px 0;
  gap: 10px;
  border-bottom: 1px solid #8ECAE6;
  /* Add transition for smooth animation */
  transition:
    background-color 0.25s,
    transform 0.18s,
    box-shadow 0.18s;
  /* Optional: for a little depth even when not hovered */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.edit {
  color: #FFB703;
  cursor: pointer;
  padding-left: 8px;
}

.delete-btn {
  color: #EAFBFC;
  cursor: pointer;
  padding-left: 4px;
}

.diaryEntry:hover {
  background-color: #012535;
  /* Pop up a bit and add a shadow */
  transform: translateX(-10px) scale(1.025);
  box-shadow: 0 4px 16px #FB8500;
  z-index: 1;
}

.diaryEntry span {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.pagination button {
  background-color: #012535;
  color: white;
  border: 1px solid #8ECAE6;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination button:hover {
  background-color: #FB8500;
  transform: scale(1.05);
}

.pagination button.active {
  background-color: #219EBC;
  border-color: #023047;
  color: white;
}

/* ALL THE STYLES COPIED FROM HOME */

.iconRow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.likeIcon {
  filter: drop-shadow(0 0 2px #219EBC);
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
  color: #EAFBFC;
  font-size: 20px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.dateInput {
  background: #1b2a3a;
  color: #EAFBFC;
  border: 1px solid #8ECAE6;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 15px;
  cursor: pointer;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.dateInput:focus {
  outline: 2px solid #219EBC;
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
  font-family: Verdana, Geneva, Tahoma, sans-serif;
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
  font-size: 40px;
  font-weight: bold;
  margin: 0;
  color: #EAFBFC;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.modalYear {
  font-size: 20px;
  color: #8ECAE6;
  margin-top: 4px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.modalDescription {
  font-size: 18px;
  line-height: 1.5;
  color: #ccc;
  margin-bottom: 20px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif
}

.reviewsWrapper {
  margin-top: 20px;
}

.reviewsLabel {
  font-size: 22px;
  font-weight: bold;
  color: #FB8500;
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
  background: #012535;
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
  background: #1b2a3a;
  color: #EAFBFC;
  border-radius: 4px;
  padding: 7px 10px;
  display: flex;
  flex-direction: column;
}

.reviewUser {
  font-size: 15px;
  font-weight: bold;
  color: #ffb700;
  margin-bottom: 2px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.reviewText {
  font-size: 13px;
  color: #eee;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.reviewsEmpty {
  color: #bbb;
  font-size: 15px;
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.reviewInput {
  flex: 1 1 auto;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  background-color: #8ECAE6;
  color: #000;
  outline: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.reviewInput:focus {
  outline: 2px solid #219EBC;
}

.reviewSubmitBtn {
  background: #219EBC;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.reviewSubmitBtn:hover {
  background: #FB8500;
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
  color: #8ECAE6;
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
  margin: 0;
}

.delete-review-btn:hover {
  color: #e50914;
}
</style>
