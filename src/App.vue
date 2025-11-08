<script setup>
import Navbar from '@/components/Navbar.vue'
import ProfileModal from '@/components/ProfileModal.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <ProfileModal />
    <Navbar />
    <RouterView />
  </div>
</template>

<style scoped></style>
