<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/supabase.init'
import { useRouter } from 'vue-router'
import { Eye } from 'lucide-vue-next'
import { EyeOff } from 'lucide-vue-next'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
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
         <h1 class="formTitle">Login to Scene-It</h1>

         <div class="inputGroup">
            <label for="email" class="inputLabel">Email</label>
            <input v-model="email" type="email" placeholder="Email" required class="loginInput" />
         </div>

         <div class="inputGroup">
            <label for="password" class="inputLabel">Password</label>
            <div class="passwordInputWrapper">
               <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password" required
                  autocomplete="current-password" class="loginInput" />
               <button type="button" class="toggleEye" @click="showPassword = !showPassword">
                  <EyeOff v-if="!showPassword" />
                  <Eye v-else />
               </button>
            </div>
         </div>

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

.inputGroup {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   width: 100%;
   max-width: 400px;
}

.inputLabel {
   color: white;
   margin-bottom: 5px;
   font-size: 0.95rem;
   font-weight: 500;
}

.passwordInputWrapper {
   position: relative;
   width: 100%;
}

.loginInput {
   padding: 12px;
   border-radius: 4px;
   border: none;
   font-size: 1rem;
   background-color: #dce6f0;
   width: 100%;
   box-sizing: border-box;
}

.passwordInputWrapper .loginInput {
   padding-right: 40px;
}

.toggleEye svg {
   width: 20px;
   height: 20px;
}

.toggleEye {
   position: absolute;
   right: 10px;
   top: 50%;
   transform: translateY(-50%);
   background: none;
   border: none;
   padding: 0;
   cursor: pointer;
   color: #444;
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

.redirectHeader {
   color: gray;
   height: 1px;
}

.dontAccount {
   color: #209CE6;
   text-decoration: none;
   cursor: pointer;
}

.dontAccount:hover {
   transform: scale(1.05);
   text-shadow: 0 0 15px white, 0 0 25px #209CE6;
   transition: all 0.3s ease;
}

.errorMsg {
   color: #ff6b6b;
   text-align: center;
   margin-top: 10px;
   font-size: 0.95rem;
}
</style>