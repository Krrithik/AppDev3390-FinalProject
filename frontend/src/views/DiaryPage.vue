<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/supabase.init'

const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'

const diaryEntries = ref([])
const user = ref(null)
const loading = ref(true)

async function fetchUser() {
  const response = await supabase.auth.getUser()
  const data = response.data
  const currentUser = data.user
  user.value = currentUser
}

async function fetchDiary() {
  loading.value = true

  if (!user.value) {
    return
  }

  const { data, error } = await supabase
    .from('diary')
    .select('*')
    .eq('user_id', user.value.id)
    .order('watched_on', { ascending: false })
    
    diaryEntries.value = data || [];
    loading.value = false
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

onMounted(async () => {
  await fetchUser()
  await fetchDiary()
})
</script>

<!-- USE ROW UNDER EDIT, AND MAYBE SCROLL IN THE SPACE OR JUST SCROLL THE PAGE, ASK KRITTHIK -->
<template>
  <div class="diaryPage">
    <!-- TOP TABS -->
    <div class="topTabs">
      <span class="tab activeTab">Diary</span>
      <span class="tab">Next Watch</span>
    </div>

    <!-- COLUMN HEADERS -->
    <div class="diaryHeaders">
      <span>Month</span>
      <span>Day</span>
      <span>Film</span>
      <span>Released</span>
      <span>Rating</span>
      <span>Like</span>
      <span>Review</span>
      <span>Edit</span>
    </div>

  
    <div v-if="loading" class="diary-loading">Loading...</div>
    <div v-else>
      <div v-for="entry in diaryEntries" :key="entry.id" class="diaryEntry">
        <span class="month">{{ entry.watched_on ? new Date(entry.watched_on).toLocaleString('default', {month : 'short', year : 'numeric'}).toUpperCase() : '' }} </span>
        <span class="day">{{ entry.watched_on ? new Date(entry.watched_on).getDate().toString().padStart(2, '0') : '' }}</span>
        <div class="film">
          <img :src="imgBaseUrl + entry.movie_poster" alt="Poster" />
          <span class="title">{{  entry.movie_title }} </span>
        </div>
        <span class="released">{{ entry.release_year }}</span>
        <span class="rating">{{ entry.rating ? entry.rating.toFixed(1) : '' }}</span>
        <span class="like">{{ entry.liked ? '❤️' : ""  }}</span>
        <span class="review">📝</span>
        <button class="delete-btn" @click="handleDeleteEntry(entry.id)" title="Delete Entry">🗑️</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diaryPage {
  padding: 40px;
  font-family: sans-serif;
  background-color: white;
  color: #111;
}

.topTabs {
  display: flex;
  gap: 20px;
  padding-bottom: 10px;
  margin-bottom: 40px;
  border-bottom: 1px solid #bbb;
}

.tab {
  padding: 8px 16px;
  background-color: #333;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.activeTab {
  background-color: #555;
  font-weight: bold;
}

/* Grid structure */
.diaryHeaders {
  display: grid;
  grid-template-columns: 80px 60px 1fr 80px 100px 60px 60px 60px;
  align-items: center;
  padding: 12px 0;
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

.title {
  font-weight: bold;
  font-size: 1rem;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
