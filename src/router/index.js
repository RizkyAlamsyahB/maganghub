import { createRouter, createWebHistory } from 'vue-router'
import VacancyList from '@/components/VacancyList.vue'
import SavedVacancies from '@/components/SavedVacancies.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: VacancyList,
    },
    {
      path: '/saved',
      name: 'saved',
      component: SavedVacancies,
    },
  ],
})

export default router
