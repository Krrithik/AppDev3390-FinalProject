<script setup>
import { useAuth } from '@/composables/useAuth';
import { Search } from 'lucide-vue-next';
const { user } = useAuth();
</script>

<template>
  <!-- NAVBAR ON TOP -->
  <header class="header">
    <nav class="branding">
      <img class="logo" src="/sceneItLogo.png" alt="Logo of camera with text Scene-It" />
    </nav>

    <nav class="nav">
      <RouterLink v-if="!user" to="/login" class="links">Login</RouterLink>
      <RouterLink v-if="!user" to="/signup" class="links">Signup</RouterLink>
      <RouterLink v-if="user" to="/" class="links">Home</RouterLink>
      <RouterLink v-if="user" to="/diary" class="links">Diary</RouterLink>
      <RouterLink v-if="user" to="/search" class="links">Search</RouterLink>
      <RouterLink v-if="user" to="/likes" class="links">Likes</RouterLink>
      <RouterLink v-if="user" to="/profile" class="links">Profile</RouterLink>
      <RouterLink to="/about" class="links">About</RouterLink>


    </nav>
  </header>
</template>

<style>
.branding {
  display: flex;
  background-color: #012535;
  align-items: center;
  justify-content: center;
}

.header {
  display: flex;
  align-items: center;
  background-color: #012535;
  box-shadow: #FB8500;
  justify-content: center;
  padding: 16px 32px;
  gap: 60px;
}

.logo {
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 80px;
  border-radius: 20px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: nowrap;
}

.searchWrapper {
  position: relative;
  width: 200px;
}

.searchIcon {
  position: absolute;
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
  pointer-events: none;
  width: 18px;
  height: 18px;
  color: black;
}

.links {
  text-decoration: none;
  color: #EAFBFC;
  cursor: pointer;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 18px;
}

.links:hover {
  color: #FB8500;
}
</style>
