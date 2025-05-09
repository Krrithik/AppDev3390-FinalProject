<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/supabase.init'
import { useRouter } from 'vue-router'
import { Eye } from 'lucide-vue-next'
import { EyeOff } from 'lucide-vue-next'
import { onMounted } from 'vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const fullName = ref('')
const errorMsg = ref('')
const loading = ref(true)

/* const handleSignup = async () => {
  loading.value = true
  errorMsg.value = ''
  // 1. Create user
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })
  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }
  // 2. Create profile
  const user = data.user
  if (user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: user.id, full_name: fullName.value }])
    if (profileError) {
      errorMsg.value = profileError.message
    }
  }
  loading.value = false 
}*/

async function handleSignup() {
  loading.value = true;
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        fullName: fullName.value
      }
    }
  })
  loading.value = false;
  if (error) {
    console.log(error);
    window.alert(error)

  }
  else {
    console.log(data);
    router.push('/')
  }
}

onMounted(() => {
  loading.value = false
})

</script>

<template>
  <div class="signupWrapper">

    <div v-if="loading" class="spinnerOverlay">
      <div class="spinner"></div>
    </div>

    <form v-else class="signupForm" @submit.prevent="handleSignup">
      <h1 class="formTitle">Join Scene-It</h1>

      <div class="inputGroup">
        <label for="text" class="inputLabel">Full Name</label>
        <input v-model="fullName" type="text" placeholder="Full Name" required />
      </div>

      <div class="inputGroup">
        <label for="email" class="inputLabel">Email</label>
        <input v-model="email" type="email" placeholder="Email Address" required />
      </div>

      <div class="inputGroup">
        <label for="password" class="inputLabel">Password</label>
        <div class="passwordInputWrapper">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Create Password" required
            class="loginInput" />
          <button type="button" class="toggleEye" @click="showPassword = !showPassword">
            <EyeOff v-if="!showPassword" />
            <Eye v-else />
          </button>
        </div>
      </div>

      <button :disabled="loading" class="signUpButton">
        {{ loading ? 'Signing up...' : 'Sign Up' }}
      </button>
      <p v-if="errorMsg" class="errorMsg">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<style scoped>
.signupWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
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

.signupForm {
  background-color: #012535;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 0 20px rgba(33, 158, 188, 0.4);
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
}

.inputLabel {
  color: #ffffff;
  margin-bottom: 5px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.loginInput {
  padding: 12px;
  border-radius: 4px;
  border: none;
  font-size: 1rem;
  background-color: #8ECAE6;
  color: #000;
  width: 100%;
  box-sizing: border-box;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.passwordInputWrapper {
  position: relative;
  width: 100%;
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

.signupForm input {
  padding: 12px;
  border-radius: 4px;
  border: none;
  font-size: 1rem;
  color: #000;
  background-color: #8ECAE6;
}

.loginIInput:focus,
.signupForm input:focus {
  outline: 2px solid #219EBC;
}

.signUpButton {
  background-color: #219EBC;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.signUpButton:hover {
  background-color: #FB8500;
}

.errorMsg {
  color: #ff6b6b;
  text-align: center;
  font-size: 0.95rem;
}
</style>