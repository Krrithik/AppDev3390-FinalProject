<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'

// FOR SPINNER
const loading = ref(true)

onMounted(() => {
    loading.value = false
})
</script>

<template>
    <div class="aboutLayout">

        <!-- SPINNER -->
        <div v-if="loading" class="spinnerOverlay">
            <div class="spinner"></div>
        </div>

        <!-- SIDEBAR -->
        <aside v-else class="sideBar">
            <div class="sideBarContent">
                <ul>
                    <li><a href="#1">What is Scene-It?</a></li>
                    <li><a href="#2">Why the name Scene-It?</a></li>
                    <li><a href="#3">Do I need an account to use this site?</a></li>
                    <li><a href="#4">Is there a paywall for this site?</a></li>
                    <li><a href="#5">Is there an incentive for leaving reviews?</a></li>
                    <li><a href="#6">Can I watch films on Scene-It?</a></li>
                    <li><a href="#7">How do I validate my email?</a></li>
                    <!-- ADD/REMOVE STUFF -->
                </ul>
            </div>
        </aside>

        <!-- ABOUT INFO STUFF -->
        <main class="aboutMain">
            <div class="block">
                <h2 id="1">What is Scene-It?</h2>
                <p>
                    Scene-It is your personal movie journal — a platform to track the films you've watched, curate a
                    watchlist of upcoming titles, and share your thoughts and favorites. Log your movie-watching
                    journey, explore reviews, and discover new recommendations tailored to your tastes.
                </p>
            </div>

            <div class="block">
                <h2 id="2">Why the name Scene-It?</h2>
                <p>
                    As a movie logging app, we wanted a name that reflected both cinema and tracking what you've
                    watched (like a Homophone). Scene-It plays on the word scene—a clear reference to film and storytelling—while also
                    sounding like “seen it,” which ties directly into the logging and tracking experience. The name
                    immediately signals to users that the app is about watching, remembering, and sharing films.
                </p>
            </div>

            <div class="block">
                <h2 id="3">Do I need an account to use this site?</h2>
                <p>
                    Yes! While an account is required to use Scene-It, signing up is completely free. Without an
                    account,
                    access is limited to the Sign In, Create Account, and About pages.
                </p>
            </div>

            <div class="block">
                <h2 id="4">Is there a paywall for this site?</h2>
                <p>
                    Scene-It has no paywalls — all features are completely free to use with a registered account.
                </p>
            </div>

            <div class="block">
                <h2 id="5">Is there an incentive for leaving reviews? </h2>
                <p>
                    While reviews—written or star-rated—aren’t incentivized with rewards, they play a vital role in
                    building the Scene-It community. Sharing your thoughts helps others discover new films, assess
                    whether a movie aligns with their tastes, and determine if it’s worth watching. We strongly
                    encourage all users to contribute reviews and ratings.
                </p>
            </div>

            <div class="block">
                <h2 id="6">Can I watch films on Scene-It?</h2>
                <p>
                    Scene-It is a platform for logging and sharing your movie experiences — it does not offer streaming
                    or viewing of films. That said, it’s a great way to discover new titles, explore recommendations,
                    and connect with fellow movie enthusiasts.
                </p>
            </div>

            <div class="block">
                <h2 id="7">How do I validate my email?</h2>
                <p>
                    Scene-It automatically handles email verification as part of its secure authentication system. When
                    a user creates an account, a verification email is sent to the address they provide. This email
                    includes a secure, one-time link that the user must click to confirm their email. Until this step is
                    completed, the account remains unverified. If email confirmation is enabled in your Supabase Auth
                    settings, unverified users will not have full access to the app. This process helps ensure that only
                    valid users can activate their accounts, enhancing security and preventing spam or fake signups.
                </p>
            </div>
            <!-- MORE BLOCKS ADD HERE -->

        </main>
    </div>
</template>

<style scoped>
.aboutLayout {
    display: flex;
    justify-content: center;
    gap: 50px;
    padding: 80px 20px;
    font-family: sans-serif;
    background-color: #023047;
    color: #ffffff;
}

.spinnerOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #ccc;
    border-top-color: #27ae60;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.sideBar {
    padding-right: 20px;
}

.sideBarContent {
    border-right: 1px solid #8ECAE6;
    padding-right: 20px;
    display: inline-block;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sideBar ul {
    list-style: none;
    padding: 0;
    font-size: 15px;
}

.sideBar li {
    margin-bottom: 12px;
    color: #EAFBFC;
    cursor: pointer;
}

.sideBar li:hover {
    color: #FB8500;
}

.sideBar a {
    color: inherit;
    text-decoration: none;
}

.sideBar a:visited {
    color: inherit;
}

.sideBar a:hover {
    text-decoration: none;
    color: #FB8500;
}

.aboutMain {
    flex: 1;
    max-width: 700px;
    margin-left: 40px;
}

.block {
    margin-bottom: 40px;
}

.block h2 {
    font-size: 25px;
    margin-bottom: 12px;
    color: #FB8500;
    border-bottom: 1px solid #8ECAE6;
    padding-bottom: 8px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.block p {
    font-size: 15px;
    line-height: 1.6;
    color: #EAFBFC;
    margin-bottom: 12px;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
</style>