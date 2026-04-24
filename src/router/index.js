import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/login.vue')
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/view/index.vue'),
    children: [
      {
        path: '', // 默认子路由
        name: 'Home',
        component: () => import('@/view/home.vue')
      },
      {
        path: 'files',
        name: 'Files',
        component: () => import('@/view/files.vue')
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/view/upload.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 如果你需要导出多个路由实例
export default router
export const other_routes = router // 改为 const 导出