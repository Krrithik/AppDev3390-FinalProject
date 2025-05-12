<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/supabase.init'
import { useRouter } from 'vue-router'
import { Eye } from 'lucide-vue-next'
import { EyeOff } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMsg = ref('')

// FOR SPINNER
const loading = ref(true)

async function handleLogin() {
   loading.value = true;
   const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
   })
   loading.value = false;
   if (error) {
      console.log(error);
      toast.error(error.message || 'Login failed!')
   }
   else {
      console.log(data);
      toast.success('Login successful!')
      router.push('/')
   }
}

onMounted(() => {
   loading.value = false
})

</script>

<template>
   <div class="loginWrapper">

      <!-- LOADING SPINNER -->
      <div v-if="loading" class="spinnerOverlay">
         <div class="spinner"></div>
      </div>

      <!-- EMAIL INPUT -->
      <form v-else class="loginBar" @submit.prevent="handleLogin">
         <h1 class="formTitle">Login to Scene-It</h1>

         <div class="inputGroup">
            <label for="email" class="inputLabel">Email</label>
            <input v-model="email" type="email" placeholder="Email" required class="loginInput" />
         </div>

         <!-- PASSWORD INPUT-->
         <div class="inputGroup">
            <label for="password" class="inputLabel">Password</label>
            <div class="passwordInputWrapper">
               <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password" required
                  autocomplete="current-password" class="loginInput" />

               <!-- TOGGLE EYE VISIBILITY-->
               <button type="button" class="toggleEye" @click="showPassword = !showPassword">
                  <EyeOff v-if="!showPassword" />
                  <Eye v-else />
               </button>
            </div>
         </div>

         <button :disabled="loading" class="loginButton">
            {{ loading ? 'Logging in...' : 'LOGIN' }}
         </button>

         <!-- LOWER TEXT-->
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
   padding: 40px;
   gap: 20px;
   background-color: #023047;
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

.loginBar {
   background-color: #012535;
   padding: 40px;
   border-radius: 8px;
   width: 100%;
   max-width: 400px;
   display: flex;
   flex-direction: column;
   gap: 20px;
   box-shadow: 0 0 20px rgba(33, 158, 188, 0.4);
   justify-content: center;
   align-items: center;
   text-align: center;
}

.formTitle {
   color: #ffffff;
   font-size: 30px;
   text-align: center;
   margin-bottom: 10px;
   font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.inputGroup {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   width: 100%;
   max-width: 400px;
}

.inputLabel {
   color: #ffffff;
   margin-bottom: 5px;
   font-size: 0.95rem;
   font-weight: 500;
   font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
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
   background-color: #8ECAE6;
   width: 100%;
   box-sizing: border-box;
   font-family: Verdana, Geneva, Tahoma, sans-serif;
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
   color: #023047;
}

.loginInput:focus {
   outline: 2px solid #219EBC;
}

.loginButton {
   background-color: #219EBC;
   color: white;
   border: none;
   padding: 10px 20px;
   border-radius: 4px;
   font-weight: bold;
   font-size: 1rem;
   cursor: pointer;
   width: 400px;
   transition: background-color 0.3s ease;
   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.loginButton:hover {
   background-color: #FB8500;
}

.redirectHeader {
   color: #BFD8EA;
   height: 1px;
   font-size: 15px;
   font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.dontAccount {
   color: #8ECAE6;
   text-decoration: none;
   cursor: pointer;
   font-size: 15px;
   font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.dontAccount:hover {
   transform: scale(1.05);
   text-shadow: 0 0 15px white, 0 0 25px #FFB703;
   transition: all 0.3s ease;
}

.errorMsg {
   color: #ff6b6b;
   text-align: center;
   margin-top: 10px;
   font-size: 0.95rem;
}
</style>