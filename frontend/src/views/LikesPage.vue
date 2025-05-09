<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLikes } from '@/composables/useLikes'
import { supabase } from '@/supabase/supabase.init'

const { likedMovies, loadingLikes, fetchUserLikes, toggleLike } = useLikes()
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'

const user = ref(null)
const liking = ref(false)

//FOR SPINNEr
const loading = ref(true)

//FOR IMG ERRORS
const imgErrors = ref(new Set())

//ADJUST AS WANTED
const currentPage = ref(1)
const itemsPerPage = 18

//CREATES TABS OFF PAGES
const totalPages = computed(() =>
  Math.ceil(likedMovies.value.length / itemsPerPage)
)

//SHOWS WHAT PAGES ARE SHOWN ON WHICH TAB
const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return likedMovies.value.slice(start, start + itemsPerPage)
})

//REDIRECTION
function goToPage(page) {
  currentPage.value = page
}

//HANDLES ERROR IN MOVIE IMGS
function handleImgError(event) {
  event.target.src = '' // Use your own default image
  event.target.alt = movie.title
  event.target.classList.add('imgError')
}

async function handleLike(movie) {
  console.log('Clicked heart for:', movie)

  if (!user.value) return
  liking.value = true

  const isNowLiked = await toggleLike({
    id: movie.movie_id,
    title: movie.movie_title,
    poster_path: movie.movie_poster,
  })

  liking.value = false


  // SYNC DIARY ENTRY'S LIKED FIELD
  await supabase
    .from('diary')
    .update({ liked: isNowLiked })
    .eq('user_id', user.value.id)
    .eq('movie_id', movie.movie_id)

  if (!isNowLiked) {
    await fetchUserLikes();
  }
}

onMounted(async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  user.value = currentUser
  await fetchUserLikes()
  loading.value = false
})
</script>

<template>
  <div class="likedPage">

    <!-- LOADING SPINNER -->
    <div v-if="loading" class="spinnerOverlay">
      <div class="spinner"></div>
    </div>

    <!-- IF NO LIKED MOVIES -->
    <div v-else-if="!likedMovies.length" class="empty">No liked movies yet.</div>

    <!-- IF HAS LIKED MOVIES -->
    <div v-else>
      <div class="movie-grid">

        <!-- DISPLAY MOVIES -->
        <div v-for="movie in paginatedMovies" :key="movie.id" class="liked-movie">
          <img :src="imgBaseUrl + movie.movie_poster" :alt="movie.movie_title" class="liked-poster"
            @error="handleImgError" />

          <!-- HEART ICON UPON HOVER -->
          <div class="card-footer" @click.stop="handleLike(movie)">
            <img :src="likedMovies.some(m => m.id === movie.id) ? '/heartFilled.png' : '/heartOutline.png'" alt="Like"
              class="likeIcon" />
          </div>
        </div>
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
</template>

<style scoped>
body {
  background-color: #023047;
}

.likedPage {
  background-color: #023047;
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

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background-color: #023047;
}

.liked-movie {
  text-align: center;
  position: relative;
  background-color: #012535;
  box-shadow: 0 0 12px rgba(33, 158, 188, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.liked-movie:hover {
  transform: scale(1.03);
  box-shadow: 0 0 15px #FB8500;
}

.card-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: rgba(33, 158, 188, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px;
  pointer-events: none;
}

.liked-movie:hover .card-footer {
  opacity: 1;
}

.likeIcon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  pointer-events: auto;
}

.imgError {
  background-color: #fff;
  color: #000;
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

.liked-movie:hover .liked-poster,
.card-footer:hover+.liked-poster {
  transform: scale(1.05);
  box-shadow: 0 0 15px #FB8500, 0 0 25px #FB8500;
}

.liked-poster {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
  color: white;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 15px;
}

.liked-poster:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
  box-shadow: 0 0 15px #FB8500, 0 0 25px #FB8500;
  cursor: pointer;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: #EAFBFC;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
}

.pagination button {
  background-color: #012535;
  border: 1px solid #8ECAE6;
  padding: 6px 12px;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 150px;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 15px;
}

.pagination button:hover {
  background-color: #FB8500;
  color: white;
  transform: scale(1.05);
  transition: transform 0.3s ease;
  cursor: pointer;

}

.pagination button.active {
  background-color: #219EBC;
  border-color: #219EBC;
  color: white;
}
</style>