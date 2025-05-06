<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/supabase.init'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleLogin() {
   const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
   })
   loading.value = false;
   if (error) {
      console.log(error);
      window.alert(error)
   }
   else {
      console.log(data);
      console.log('login success')
      router.push('/')
   }
}
</script>

<template>
   <div class="loginWrapper">
      <form class="loginBar" @submit.prevent="handleLogin">
         <input v-model="email" type="email" placeholder="Email" required class="loginInput" />
         <input v-model="password" type="password" placeholder="Password" required class="loginInput" />
         <button :disabled="loading" class="loginButton">
            {{ loading ? 'Logging in...' : 'LOGIN' }}
         </button>
      </form>
      <p v-if="errorMsg" class="errorMsg">{{ errorMsg }}</p>
   </div>
</template>

<style scoped>
.loginWrapper {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin-top: 20px;
   justify-content: top;
   height: 100vh;
   background-color: white;
}

.loginBar {
   display: flex;
   background-color: black;
   padding: 20px;
   border-radius: 6px;
   gap: 10px;
   box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
}

.loginInput {
   background-color: #dce6f0;
   border: none;
   padding: 10px 12px;
   border-radius: 4px;
   font-size: 1rem;
   width: 200px;
}

.loginInput:focus {
   outline: 2px solid #a696c8;
}

.loginButton {
   background-color: #27ae60;
   color: white;
   border: none;
   padding: 10px 20px;
   border-radius: 4px;
   font-weight: bold;
   font-size: 1rem;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.loginButton:hover {
   background-color: #1b7641;
}

.errorMsg {
   color: #ff6b6b;
   text-align: center;
   margin-top: 10px;
   font-size: 0.95rem;
}
</style>