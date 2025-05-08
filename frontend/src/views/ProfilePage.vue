<script setup>
import { supabase } from '@/supabase/supabase.init';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const profileUser = ref(null);
const sessionData = ref(null);
const loading = ref(true);

async function getUserForProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  return user || null;
}

async function seeCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  sessionData.value = session;
  console.log(sessionData.value);
}

onMounted(async () => {
  profileUser.value = await getUserForProfile();
  await seeCurrentUser();
  loading.value = false;
});

async function handleLogout() {
  loading.value = true;
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
    loading.value = false
  }
  else {
    console.log('logout successfull');
    router.push('/login')
    window.alert('logout success')

  }
}
</script>

<template>
  <div class="profileWrapper">

    <div v-if="loading" class="spinnerOverlay">
      <div class="spinner"></div>
    </div>

    <div v-else class="profileCard">
      <h1 class="profileTitle">Your Profile</h1>
      <p class="profileSubtitle">Your Profile Information</p>

      <!-- USER INFO -->
      <div class="formGroup">
        <label class="formLabel">Full Name</label>
        <div class="formValue">{{ profileUser?.user_metadata?.fullName }}</div>
      </div>

      <div class="formGroup">
        <label class="formLabel">Email Address</label>
        <div class="formValue">{{ sessionData?.session?.user?.email }}</div> <!-- IS THERE A BETTER WAY? -->
      </div>

      <!-- ACCOUNT INFO -->
      <div class="sectionDivider">Account Information</div>

      <div class="accountInfoRow">
        <span class="infoLabel">Member Since</span>
        <span class="infoValue">{{ profileUser?.created_at ? new Date(profileUser.created_at).toLocaleDateString() : ''
        }}</span> <!-- ASK KRRITHIK -->
      </div>

      <div class="accountInfoRow">
        <span class="infoLabel">Account Status</span>
        <span class="infoValueActive">Active</span>
      </div>

      <button @click="handleLogout" class="logoutButton">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.profileWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background-color: white;
  min-height: 100vh;
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

.profileCard {
  background-color: #1e1e1e;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  color: white;
}

.profileTitle {
  font-size: 2rem;
  margin-bottom: 5px;
  text-align: center;
}

.profileSubtitle {
  color: #aaa;
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: 30px;
}

.formGroup {
  margin-bottom: 20px;
}

.formLabel {
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 5px;
  display: block;
}

.formValue {
  border: 1px solid white;
  background-color: #2a2a2a;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 1rem;
  color: white;
}

.sectionDivider {
  margin-top: 30px;
  margin-bottom: 10px;
  font-weight: bold;
  color: white;
  font-size: 1rem;
}

.accountInfoRow {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}

.infoLabel {
  color: #ccc;
  font-size: 0.95rem;
}

.infoValue {
  color: #eee;
  font-size: 0.95rem;
}

.infoValueActive {
  color: #0bff71;
  font-weight: bold;
}

.logoutButton {
  margin-top: 30px;
  width: 100%;
  padding: 10px;
  background-color: #e74c3c;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logoutButton:hover {
  background-color: #682119;
}
</style>
