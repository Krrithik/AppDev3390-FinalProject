  <script setup>
  // No script needed for basic modal
</script>
  
<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">×</button>
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>
.modal-backdrop {
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

.modal-content {
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

.modal-content::-webkit-scrollbar {
  display: none;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: #8ECAE6;
  font-size: 2em;
  cursor: pointer;
}

.close-btn:hover {
  color: #FB8500;
}
</style>