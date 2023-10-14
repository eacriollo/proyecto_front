import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VistaLogin from '../views/loginView.vue'
import AppLayout from '@/layout/AppLayout.vue';
import Actividad from '@/views/admin/Actividad.vue';
import Ciudad from '@/views/admin/Ciudad.vue';
import Precio from '@/views/admin/Precio.vue';
import Persona from '@/views/admin/Persona.vue';
import Estado from '@/views/admin/Estado.vue';
import Producto from '@/views/admin/Producto.vue';
import Equipo from '@/views/admin/Equipos.vue';
import Abonado from '@/views/admin/Abonado.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    
    {
      path: '/login',
      name: 'login',
      component: VistaLogin,
      meta: { redirectIfAuth: true }
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView
        },

        {
          path: 'about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue'),
          meta: { requireAuth: true }
        },

       {
          path: 'actividad',
          name: 'Actividad',
          component: Actividad,
          meta: { requireAuth: true }
        },

        {
          path: 'ciudad',
          name: 'Ciudad',
          component: Ciudad,
          meta: { requireAuth: true }
        },

        {
          path: 'precio',
          name: 'Precio',
          component: Precio,
          meta: { requireAuth: true }
        },

        {
          path: 'persona',
          name: 'Persona',
          component: Persona,
          meta: { requireAuth: true }
        },

        {
          path: 'estado',
          name: 'Estado',
          component: Estado,
          meta: { requireAuth: true }
        },

        {
          path: 'producto',
          name: 'Producto',
          component: Producto,
          meta: { requireAuth: true }
        },

        {
          path: 'equipo',
          name: 'Equipo',
          component: Equipo,
          meta: { requireAuth: true }
        },

        {
          path: 'abonado',
          name: 'Abonado',
          component: Abonado,
          meta: { requireAuth: true }
        }

      ]

    }
  ]
})

//guard

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("access_token")

  console.log(to);
  if (to.meta.requireAuth) {
    if (!token)
      return next({ name: 'login' })
    return next()
  }
  if (to.meta.redirectIfAuth && token) {
    return next({ name: 'about' })
  }
  return next()
})


export default router
