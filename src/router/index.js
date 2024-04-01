import { createRouter, createWebHistory } from 'vue-router'
import RouterReplaceComp from '@/utils/routerReplaceSelf.js'

const routes = [
  {
    path: '/',
    redirect: '/HomePage'
  },
  {
    path: '/HomePage',
    name: 'HomePage',
    component: function () {
      return import('../views/HomePage.vue')
    },
    meta: { title: '首页' }
  },
  {
    path: '/MyContribute',
    name: 'MyContribute',
    component: RouterReplaceComp(()=>import('../views/MyContribute/MyContribute.vue')),
    meta: { title: '我的投稿' },  
    children: [{
      path: 'CreateContribute',
      name: 'CreateContribute',
      component: function () {
        return import('../views/MyContribute/views/CreateContribute.vue')
      },
      meta: { title: '创建稿件' },
    }],
  },
  {
    path: '/Notice',
    name: 'Notice',
    component: RouterReplaceComp(()=>import('../views/Notice/Notice.vue')),
    meta: { title: '通知公告' },
    children: [{
      path: 'NoticeDetail',
      name: 'NoticeDetail',
      component: function () {
        return import('../views/Notice/views/NoticeDetail.vue')
      },
      meta: { title: '通知公告详情' },
    }],
  },
  {
    path: '/Message',
    name: 'Message',
    component: function () {
      return import('../views/Message.vue')
    },
    meta: { title: '系统消息' }
  },
  {
    path: '/Drafts',
    name: 'Drafts',
    component: function () {
      return import('../views/Drafts.vue')
    },
    meta: { title: '草稿箱' }
  },
  {
    path: '/RecycleBin',
    name: 'RecycleBin',
    component: function () {
      return import('../views/RecycleBin.vue')
    },
    meta: { title: '回收站' }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
