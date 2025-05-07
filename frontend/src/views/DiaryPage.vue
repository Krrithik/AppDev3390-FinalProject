<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/supabase.init'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Rating from 'primevue/rating'

// Helper to format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const products = ref([])

async function fetchLikedMovies() {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) return

  // Fetch likes with movie details
  const { data, error } = await supabase
    .from('likes')
    .select(`
      liked_at,
      movies (
        id,
        title,
        image
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    return
  }

  // Map to table format
  products.value = data.map(like => ({
    title: like.movies.title,
    image: like.movies.image,
    liked_at: like.liked_at
  }))
}

onMounted(fetchLikedMovies)
</script>

<template>
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Liked Movies</span>
          <Button icon="pi pi-refresh" rounded raised @click="fetchLikedMovies" />
        </div>
      </template>
      <Column field="title" header="Movie Title"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img :src="slotProps.data.image" :alt="slotProps.data.title" class="w-24 rounded" />
        </template>
      </Column>
      <Column field="liked_at" header="Liked At">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.liked_at) }}
        </template>
      </Column>
      <template #footer>
        In total there are {{ products ? products.length : 0 }} liked movies.
      </template>
    </DataTable>
  </template>

<style scoped>

</style>