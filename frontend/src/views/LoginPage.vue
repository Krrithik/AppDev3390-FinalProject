<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/supabase.init'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleLogin(){
    const { data, error } = await supabase.auth.signInWithPassword({
        email : email.value,
        password : password.value
     })
     if(error){
        console.log(error);
        
     }
     else {
        console.log(data);
        console.log('login success')
     }
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <h1>Login Page!</h1>
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
  </form>
</template>