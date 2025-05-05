<script setup>
//NO FUNCTIONALITY YET
import MovieCard from '@/components/MovieCard.vue';
</script>

<template>
    <!-- SHORT DESCRIPTION -->
    <section class="description">
      <p>Jot the films you've seen.<br />
        Note films to watch next.<br />
        Then tell your friends the great ones.</p>
    </section>


    <!-- TRENDING SECTION -->
    <section class="movieSection">
      <h2>TRENDING</h2>
      <div class="movieRow">
        <div v-for="n in 6" :key="n" class="movieBox"></div>
      </div>
    </section>

    <!-- IN THEATERS -->
    <section class="movieSection">
      <h2>IN THEATERS</h2>
      <div class="movieRow">
        <div v-for="n in 6" :key="n" class="movieBox"></div>
      </div>
    </section>

    <div>
      <MovieCard />
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

.movieSection {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
}

.movieRow {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.movieBox {
  width: 156px;
  height: 231px;
  background-color: black;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>