import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

// TODO：这个文件什么时候会被执行？

console.log('Permission.js, Router MiddleWare!')

const whiteList = ['/login', '/404']

// TODO:为什么这个与router相关的文件不放在router目录下？
router.beforeEach(async(to, from, next) => {
  console.log('beforeEach')
  nprogress.start()

  if (store.getters.token) {
    console.log('With Token')
    if (to.path === '/login') {
      next('/')
      nprogress.done()
    } else {
      // if (!store.getters.userInfo) {
      //   // TODO:dispatch中可以不写路径吗？直接引入函数后调用函数可以吗？dispatch(getUserInfo())
      //   await store.dispatch('user/getUserInfo')
      // }
      // TODO:what is the next() mean?
      next()
    }
  } else {
    console.log('Without Token')
    if (whiteList.includes(to.path)) {
      console.log('In WhiteList')
      next()
    } else {
      next('/login')
      nprogress.done()
    }
  }
})

router.afterEach((to, from) => {
  console.log('afterEach')
  nprogress.done()
})
