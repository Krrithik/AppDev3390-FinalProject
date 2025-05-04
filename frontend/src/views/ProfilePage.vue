<script setup>
import { supabase } from '@/supabase/supabase.init';
import { ref, onMounted } from 'vue'

const localUser = ref(null)
const data = ref(null)

async function seeCurrentUser() {
    const localUser = await supabase.auth.getSession();
    console.log(localUser);
    

    const data = 8;

}

seeCurrentUser();
</script>

<template>
 <h1>User Profile Page!</h1>
 <p>{{ localUser }}</p>
 <p>{{ data }}</p>
 <p>hi</p>
</template>

<style>

</style>