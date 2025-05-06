<script setup>
import { useAuth } from '@/composables/useAuth';
import { Search } from 'lucide-vue-next';
const { user } = useAuth();
</script>

<template>
  <!-- NAVBAR ON TOP -->
  <header class="header">
    <nav class="branding">
      <img class="logo" src="/appIcon.png" alt="Placeholder Logo" />
      <span class="app-name">App Name</span>
    </nav>

    <nav class="nav">
      <RouterLink v-if="!user" to="/login" class="links">Login</RouterLink>
      <RouterLink v-if="!user" to="/signup" class="links">Signup</RouterLink>
      <RouterLink v-if="user" to="/" class="links">Home</RouterLink>
      <RouterLink v-if="user" to="/diary" class="links">Diary</RouterLink>
      <RouterLink v-if="user" to="/likes" class="links">Likes</RouterLink>
      <RouterLink v-if="user" to="/profile" class="links">Profile</RouterLink>
      <RouterLink v-if="!user" to="/about" class="links">About</RouterLink>
      <RouterLink v-if="user" to="/about" class="links">About</RouterLink>

      <div class="searchWrapper">
        <input type="text" placeholder="Search... " class="search" />
        <Search class="searchIcon" />
      </div>
    </nav>
  </header>
</template>

<style>
.branding {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.app-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
}

.searchWrapper {
  position: relative;
  width: 200px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  gap: 60px;
}

.logo {
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 80px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: nowrap;
}

.search {
  width: 100%;
  padding: 8px 36px 8px 12px;
  /* room for icon on right */
  border: 2px solid black;
  font-size: 1rem;
  border-radius: 18px;
}

.searchIcon {
  position: absolute;
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
  pointer-events: none;
  width: 18px;
  height: 18px;
  color: #bbb;
}

.links {
  text-decoration: none;
  color: #444;
  cursor: pointer;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 18px;
}

.links:hover {
  color: #209CE6;
}
</style>
