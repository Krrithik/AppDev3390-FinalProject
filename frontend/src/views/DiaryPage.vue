<script setup>
// NOT DONE YET
</script>

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

        <!-- ENTRY 1 -->
        <div class="diaryEntry">
            <span class="month">MAY 2025</span>
            <span class="day">04</span>
            <div class="film">
                <img src="/toyStoryForMockup.jpg" alt="Poster" />
                <span class="title">Toy Story 3</span>
            </div>
            <span class="released">2010</span>
            <span class="rating">★★★★½</span>
            <span class="like">❤️</span>
            <span class="review">📝</span>
            <span class="edit">✏️</span>
        </div>

        <!-- ENTRY 2 -->
        <div class="diaryEntry">
            <span class="month">APR 2025</span>
            <span class="day">11</span>
            <div class="film">
                <img src="/toyStoryForMockup.jpg" alt="Poster" />
                <span class="title">Toy Story 3</span>
            </div>
            <span class="released">2010</span>
            <span class="rating">★★★★½</span>
            <span class="like">❤️</span>
            <span class="review">📝</span>
            <span class="edit">✏️</span>
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