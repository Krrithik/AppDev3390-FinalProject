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
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    background: #222;
    color: #fff;
    border-radius: 8px;
    padding: 24px;
    min-width: 320px;
    max-width: 90vw;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 8px; right: 12px;
    background: none;
    border: none;
    color: #fff;
    font-size: 2em;
    cursor: pointer;
  }
  </style>