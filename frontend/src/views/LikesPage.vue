<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLikes } from '@/composables/useLikes'

const { likedMovies, loadingLikes, fetchUserLikes } = useLikes()
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'

//ADJUST AS WANTED
const currentPage = ref(1)
const itemsPerPage = 16

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

onMounted(async () => {
  await fetchUserLikes()
})
</script>

<template>
  <!-- LOADING TEXT -->
  <div v-if="loadingLikes" class="loading">Loading...</div>

  <!-- IF NO LIKED MOVIES -->
  <div v-else-if="!likedMovies.length" class="empty">No liked movies yet.</div>

  <!-- IF HAS LIKED MOVIES -->
  <div v-else>
    <div class="movie-grid">
      <div v-for="movie in paginatedMovies" :key="movie.id" class="liked-movie">
        <img :src="imgBaseUrl + movie.movie_poster" :alt="movie.movie_title" class="liked-poster" />
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ active: currentPage === page }">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.liked-movie {
  text-align: center;
}

.liked-poster {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

.liked-poster:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
  box-shadow: 0 0 15px #a696c8, 0 0 25px #a696c8;
  cursor: pointer;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: black;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
}

.pagination button {
  background-color: black;
  border: 1px solid #ccc;
  padding: 6px 12px;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:hover {
  background-color: #36683e;
  transform: scale(1.05);
  transition: transform 0.3s ease;
  cursor: pointer;

}

.pagination button.active {
  background-color: #27ae60;
  border-color: #27ae60;
  color: white;
}
</style>