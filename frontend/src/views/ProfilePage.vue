<script setup>
import { supabase } from '@/supabase/supabase.init';
import { ref, onMounted } from 'vue';

const profileUser = ref('');
const sessionData = ref(null);

async function getUserForProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  const fullName = user?.user_metadata?.fullName || '';
  return fullName;
}

async function seeCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  sessionData.value = session;
  console.log(sessionData.value);
}

onMounted(async () => {
  profileUser.value = await getUserForProfile();
  await seeCurrentUser();
});


//NOT YET ADDED

async function handleLogout() {
  const {error } = await supabase.auth.signOut()
  if(error){
    console.log(error);
    
  }
  else{
    console.log('logout successfull');
    
  }
}
</script>

<template>
  <h1>User Profile Page!</h1>
  <div>Full Name: {{ profileUser }}</div>

  <div>

      <button @click="handleLogout">logout</button>
  </div>

</template>

<style>

</style>
