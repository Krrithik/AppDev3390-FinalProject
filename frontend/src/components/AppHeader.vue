<script setup>
import { Search } from 'lucide-vue-next';
</script>

<template>
  <!-- NAVBAR ON TOP -->
  <header class="header">
    <nav class="branding">
      <img class="logo" src="/appIcon.png" alt="Placeholder Logo" />
      <span class="app-name">App Name</span>
    </nav>

    <nav class="nav">
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/signup">Signup</RouterLink>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/diary">Diary</RouterLink>
      <RouterLink to="/likes">Likes</RouterLink>
      <RouterLink to="/profile">Profile</RouterLink>
      <RouterLink to="/about">About</RouterLink>

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
  padding: 8px 36px 8px 12px; /* room for icon on right */
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
</style>
