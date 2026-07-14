<template>
    <div v-if="showPopup" class="popup">
      <p>You are not authorized to access this page.</p>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        showPopup: false,
      };
    },
    created() {
      // Check for 401 error here and set showPopup accordingly
    },
    methods:{
    }
  };
  </script>

  <style scoped>
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  </style>
