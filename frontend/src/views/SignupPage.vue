<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/supabase.init'

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

async function handleSignup(){
    const { data, error } = await supabase.auth.signUp({
        email : email.value,
        password : password.value
     })
     if(error){
        console.log(error);
        
     }
     else {
        console.log(data);
        
     }
}

</script>

<template>
  <form @submit.prevent="handleSignup">
    <h1>Signup Page!</h1>
    <input v-model="fullName" type="text" placeholder="Full Name" required />
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Create Password" required />
    <button :disabled="loading">{{ loading ? 'Signing up...' : 'Sign Up' }}</button>
    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
  </form>
</template>
