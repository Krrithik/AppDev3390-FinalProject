<script setup>
//NOT YET ADDED
</script>

<template>

  <div class="homepage">
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
        <div v-for="n in 6" :key="n" class="movie-box"></div>
      </div>
    </section>

    <!-- IN THEATERS -->
    <section class="movie-section">
      <h2>IN THEATERS</h2>
      <div class="movie-row">
        <div v-for="n in 6" :key="n" class="movie-box"></div>
      </div>
    </section>
  </div>
</template>

<!-- STYLE -->
<!-- NOTE: Style Scoped applies styling to just this view, instead of all others -->
<style scoped>
.description {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 80px;
  font-size: 1.1em;
}

.movie-section {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
}

.movie-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.movie-box {
  width: 156px;
  height: 231px;
  background-color: black;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>