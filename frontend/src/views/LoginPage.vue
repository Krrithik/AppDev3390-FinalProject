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
         <h1 class="formTitle">Login Appname</h1>
         <input v-model="email" type="email" placeholder="Email" required class="loginInput" />
         <input v-model="password" type="password" placeholder="Password" required class="loginInput" />
         <button :disabled="loading" class="loginButton">
            {{ loading ? 'Logging in...' : 'LOGIN' }}
         </button>
         <h2 class="redirectHeader">Don't have an account?</h2>
         <RouterLink v-if="!user" to="/signup" class="links">
         <h3 class="dontAccount">Create an account</h3>
         </RouterLink>
      </form>
      <p v-if="errorMsg" class="errorMsg">{{ errorMsg }}</p>
   </div>
</template>

<style scoped>
.loginWrapper {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   height: 100vh;
   background-color: white;
   padding: 40px;
   gap: 20px;
}

.loginBar {
   background-color: black;
   padding: 40px;
   border-radius: 8px;
   width: 100%;
   max-width: 400px;
   display: flex;
   flex-direction: column;
   gap: 20px;
   box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
   justify-content: center;
   align-items: center;
   text-align: center;
}

.formTitle {
   color: #ccc;
   font-size: 1.5rem;
   text-align: center;
   margin-bottom: 10px;
}

.loginInput {
   padding: 12px;
   border-radius: 4px;
   border: none;
   font-size: 1rem;
   background-color: #dce6f0;
   width: 376px;

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
   width: 400px;
   transition: background-color 0.3s ease;
}

.loginButton:hover {
   background-color: #1b7641;
}

.redirectHeader{
   color: gray;
   height: 1px;
}

.dontAccount {
   color: #209CE6;
   text-decoration: none;
   cursor: pointer;
}

.errorMsg {
   color: #ff6b6b;
   text-align: center;
   margin-top: 10px;
   font-size: 0.95rem;
}
</style>