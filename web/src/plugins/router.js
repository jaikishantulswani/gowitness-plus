import {createRouter , createWebHistory } from 'vue-router'

// const routes = [
//     {paht:'/', name: 'home', component: ()=>import('../views/Home.vue')},
//     {paht:'/gallery', name: 'gallery', component: ()=>import('../views/Gallery.vue')}
// ]

const router = createRouter({
    routes: [],
    history: createWebHistory(),
})

router.addRoute({ path: '/', component: ()=>import('../views/Home.vue') })
router.addRoute({ path: '/gallery', component: ()=>import('../views/Gallery.vue') })
router.addRoute({ path: '/table', component: ()=>import('../views/Table.vue') })
router.addRoute({ path: '/submit', component: ()=>import('../views/Submit.vue') })
router.addRoute({ path: '/log', component: ()=>import('../views/Log.vue') })

export default router