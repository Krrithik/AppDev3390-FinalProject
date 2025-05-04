<script setup>
//NOT YET ADDED
import { Search } from 'lucide-vue-next';
</script>

<template>
  <div class="homepage">

    <!-- NAVBAR ON TOP -->
    <header class="header">
      <nav class="branding">
        <img class="logo" src="/appIcon.png" alt="Placeholder Logo" />
        <span class="app-name">App Name</span>
      </nav>

      <nav class="nav">
        <a href="#">Sign In</a>
        <a href="#">Create Account</a>
        <a href="#">Diary</a>
        <a href="#">Liked</a>
        <a href="#">Profile</a>
        <a href="#">About</a>

        <div class="searchWrapper">
          <input type="text" placeholder="Search... " class="search" />
          <Search class="searchIcon" />
        </div>
      </nav>
    </header>

    <!-- SHORT DESCRIPTION -->
    <section class="description">
      <p>Jot the films you've seen.<br />
        Note films to watch next.<br />
        Then tell your friends the great ones.</p>
    </section>

    <!-- TRENDING SECTION -->
    <section class="movie-section">
      <h2>TRENDING</h2>
      <div class="movie-row">
        <div v-for="n in 5" :key="n" class="movie-box"></div>
      </div>
      <div class="more-link">more...</div>
    </section>

    <!-- IN THEATERS -->
    <section class="movie-section">
      <h2>IN THEATERS</h2>
      <div class="movie-row">
        <div v-for="n in 5" :key="n" class="movie-box"></div>
      </div>
      <div class="more-link">more...</div>
    </section>

  </div>
</template>

<!-- STYLE -->
<!-- NOTE: Style Scoped applies styling to just this view, instead of all others -->
<style scoped> 
.homepage {
  padding: 20px;
  font-family: sans-serif;
  background-color: #ddd;
  min-height: 100vh;
}

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
  padding: 16px, 32px;
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
  flex-wrap: wrap;
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

.description {
  text-align: center;
  margin-top: 200px;
  margin-bottom: 80px;
  font-size: 1.1em;
}

.movie-section {
  margin-top: 40px;
}

.movie-row {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.movie-box {
  width: 120px;
  height: 180px;
  background-color: black;
}

.more-link {
  text-align: right;
  font-size: 0.9em;
  color: #333;
  margin-top: 8px;
}
</style>