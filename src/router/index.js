import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/inicio',
    hidden: true,
    children: [
      {
        path: 'inicio',
        component: () => import('@/views/dashboard/index'),
        name: 'Inicio',
        meta: { requiresAuth: true},
      }
    ]
  },
  {
    path: '/centro',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: '/centro',
        component: () => import('@/views/centro/centro'),
        name: 'Centro',
        meta: { title: 'Centros', icon: 'hospital', affix: true, requiresAuth: true},
      }
    ]
  },
  {
    path: '/sala',
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/sala/:id',
        component: () => import('@/views/sala/sala'),
        name: 'Sala',
        meta: { title: 'Sala', icon: 'international', affix: true,requiresAuth: true },
      }
    ]
  },
  {
    path: '/paciente',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: '/paciente',
        component: () => import('@/views/paciente/paciente'),
        name: 'Paciente',
        meta: { title: 'Pacientes', icon: 'i-registration', affix: true, requiresAuth: true },
      }
    ]
  },
  {
    path: '/perfil',
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/perfil/:id',
        component: () => import('@/views/perfilPaciente/index'),
        name: 'Perfil',
        meta: { title: 'Perfil', icon: 'person', affix: true, requiresAuth: true },
      }
    ]
  },
  {
    path: '/emergencia',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: '/emergencia',
        component: () => import('@/views/sala/sala'),
        name: 'Sala',
        meta: { title: 'Emergencia', icon: 'international', affix: true,requiresAuth: true },
      }
    ]
  },
  {
    path: '/reporte',
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/reporte/:id',
        component: () => import('@/views/reporte/reporte'),
        name: 'Reporte',
        meta: { title: 'Reportes', icon: 'dashboard', affix: true, requiresAuth: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => {
    return record.meta.requiresAuth
  })) {
    if (localStorage.getItem('access_token') == null || localStorage.getItem('access_token') == "null") {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      if(to.matched.some(record => record.meta.is_admin)) {
        if(user.is_admin == 1){
          next()
        }
        else{
          next({ name: 'userboard'})
        }
      }else {
        next()
      }
    }
  } else if(to.matched.some(record => record.meta.guest)) {
    if(localStorage.getItem('jwt') == null){
      next()
    }
    else{
      next({ name: 'userboard'})
    }
  }else {
    next()
  }
})


// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
