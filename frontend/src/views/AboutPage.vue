<script setup>
//NO FUNCTIONALITY YET
</script>

<template>
    <div class="aboutLayout">

        <!-- SIDEBAR -->
        <aside class="sideBar">
            <div class="sideBarContent">
                <ul>
                    <li><a href="#1">What is Appname?</a></li>
                    <li><a href="#2">Why the name Appname?</a></li>
                    <li><a href="#3">Do I need an account to use this site?</a></li>
                    <li><a href="#4">Is there a paywall for this site?</a></li>
                    <li><a href="#5">Is there an incentive for leaving reviews?</a></li>
                    <li><a href="#6">Can I watch films on Appname?</a></li>
                    <li><a href="#7">How do I validate my email?</a></li>
                    <!-- ADD/REMOVE STUFF -->
                </ul>
            </div>
        </aside>

        <!-- ABOUT INFO STUFF -->
        <main class="aboutMain">
            <div class="block">
                <h2 id="1">What is Appname?</h2>
                <p>
                    Appname is your personal movie journal — a platform to track the films you've watched, curate a
                    watchlist of upcoming titles, and share your thoughts and favorites. Log your movie-watching
                    journey, explore reviews, and discover new recommendations tailored to your tastes.
                </p>
            </div>

            <div class="block">
                <h2 id="2">Why the name Appname?</h2>
                <p>
                    To be determined.
                </p>
            </div>

            <div class="block">
                <h2 id="3">Do I need an account to use this site?</h2>
                <p>
                    Yes! While an account is required to use Appname, signing up is completely free. Without an account,
                    access is limited to the Sign In, Create Account, and About pages.
                </p>
            </div>

            <div class="block">
                <h2 id="4">Is there a paywall for this site?</h2>
                <p>
                    Appname has no paywalls — all features are completely free to use with a registered account.
                </p>
            </div>

            <div class="block">
                <h2 id="5">Is there an incentive for leaving reviews? </h2>
                <p>
                    While reviews—written or star-rated—aren’t incentivized with rewards, they play a vital role in
                    building the Appname community. Sharing your thoughts helps others discover new films, assess
                    whether a movie aligns with their tastes, and determine if it’s worth watching. We strongly
                    encourage all users to contribute reviews and ratings.
                </p>
            </div>

            <div class="block">
                <h2 id="6">Can I watch films on Appname?</h2>
                <p>
                    Appname is a platform for logging and sharing your movie experiences — it does not offer streaming
                    or viewing of films. That said, it’s a great way to discover new titles, explore recommendations,
                    and connect with fellow movie enthusiasts.
                </p>
            </div>

            <div class="block">
                <h2 id="7">How do I validate my email?</h2>
                <p>
                    krrithik do this!
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
}

.sideBar {
    padding-right: 20px;
}

.sideBarContent {
    border-right: 1px solid #ccc;
    padding-right: 20px;
    display: inline-block;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sideBar ul {
    list-style: none;
    padding: 0;
    font-size: 0.95rem;
}

.sideBar li {
    margin-bottom: 12px;
    color: #444;
    cursor: pointer;
}

.sideBar li:hover {
    color: #209CE6;
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
    color: #209CE6;
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
    font-size: 1.6rem;
    margin-bottom: 12px;
    color: #111;
    border-bottom: 1px solid #ccc;
    padding-bottom: 8px;
}

.block p {
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
    margin-bottom: 12px;
}
</style>