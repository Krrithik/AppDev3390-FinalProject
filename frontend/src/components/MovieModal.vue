<script setup>
  // No script needed for basic modal
</script>
  
<template>
  <div class="modalBackdrop" @click.self="$emit('close')">
    <div class="modalContent">
      <button class="closeBtn" @click="$emit('close')">×</button>
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>
.modalBackdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modalContent {
  background: #012535;
  color: #EAFBFC;
  border-radius: 20px;
  padding: 24px;
  width: 90vw;
  min-width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  box-shadow: 0 0 20px rgba(33, 158, 188, 0.4);
  overflow-y: auto;
  position: relative;
  box-sizing: border-box;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modalContent::-webkit-scrollbar {
  display: none;
}

.closeBtn {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: #8ECAE6;
  font-size: 2em;
  cursor: pointer;
}

.closeBtn:hover {
  color: #FB8500;
}
</style>