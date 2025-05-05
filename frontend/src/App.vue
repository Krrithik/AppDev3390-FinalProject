<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Search } from 'lucide-vue-next';
import AppHeader from './components/AppHeader.vue';
</script>

<template>
  <div class="homepage">
    <AppHeader />


  </div>

  <RouterView />
</template>

<style>
.homepage {
  padding: 20px;
  font-family: sans-serif;
  background-color: #ddd;
}
</style>