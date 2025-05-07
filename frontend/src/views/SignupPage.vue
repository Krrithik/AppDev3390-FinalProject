<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/supabase.init'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const fullName = ref('')
const errorMsg = ref('')
const loading = ref(false)

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

</script>

<template>
  <div class="signupWrapper">
    <form class="signupForm" @submit.prevent="handleSignup">
      <h1 class="formTitle">Join Appname</h1>

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
        <input v-model="password" type="password" placeholder="Create Password" required />
      </div>

      <button :disabled="loading">
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
  background-color: white;
}

.signupForm {
  background-color: black;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
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
}

.inputLabel {
  color: white;
  margin-bottom: 5px;
  font-size: 0.95rem;
  font-weight: 500;
}

.signupForm input {
  padding: 12px;
  border-radius: 4px;
  border: none;
  font-size: 1rem;
  background-color: #dce6f0;
}

.signupForm input:focus {
  outline: 2px solid #a696c8;
}

.signupForm button {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signupForm button:hover {
  background-color: #1b7641;
}

.errorMsg {
  color: #ff6b6b;
  text-align: center;
  font-size: 0.95rem;
}
</style>