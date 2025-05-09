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

    <!-- SPINNER -->
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

      <!-- EMAIL INFO-->
      <div class="formGroup">
        <label class="formLabel">Email Address</label>
        <div class="formValue">{{ sessionData?.session?.user?.email }}</div> <!-- IS THERE A BETTER WAY? -->
      </div>

      <!-- ACCOUNT INFO LABEL-->
      <div class="sectionDivider">Account Information</div>

      <div class="accountInfoRow">
        <span class="infoLabel">Member Since</span>
        <span class="infoValue">{{ profileUser?.created_at ? new Date(profileUser.created_at).toLocaleDateString() : ''
          }}</span>
      </div>

      <!-- STATUS TEXTS -->
      <div class="accountInfoRow">
        <span class="infoLabel">Account Status</span>
        <span class="infoValueActive">Active</span>
      </div>

      <!-- LOGOUT BUTTON -->
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
  background-color: #023047;
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
  background-color: #012535;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 0 20px rgba(33, 158, 188, 0.4);
  color: #EAFBFC;
}

.profileTitle {
  font-size: 45px;
  margin-bottom: 5px;
  text-align: center;
  color: #ffffff;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.profileSubtitle {
  color: #8ECAE6;
  font-size: 20px;
  text-align: center;
  margin-bottom: 30px;
  font-family: 'Courier New', Courier, monospace;
}

.formGroup {
  margin-bottom: 20px;
}

.formLabel {
  color: #EAFBFC;
  font-size: 0.9rem;
  margin-bottom: 5px;
  display: block;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.formValue {
  border: 1px solid #8ECAE6;
  background-color: #1b2a3a;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 12px;
  color: #ffffff;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.sectionDivider {
  margin-top: 30px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #FB8500;
  font-size: 18px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.accountInfoRow {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}

.infoLabel {
  color: #EAFBFC;
  font-size: 15px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.infoValue {
  color: #EAFBFC;
  font-size: 15px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.infoValueActive {
  color: #0bff71;
  font-weight: bold;
  font-size: 15px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.logoutButton {
  margin-top: 30px;
  width: 100%;
  padding: 10px;
  background-color: #219EBC;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.logoutButton:hover {
  background-color: #FB8500;
}
</style>
