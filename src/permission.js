import router, { resetRouter } from '@/router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar  NProgress是页面跳转是出现在浏览器顶部的进度条
import 'nprogress/nprogress.css' // progress bar style
import { getToken, removeToken } from '@/utils/auth' // get token from cookie
import { removeStorage } from '@/utils/storage'
import { getSystemNameAsync } from '@/utils/sysName'
import getPageTitle from '@/utils/get-page-title'

import { isNeedLogin, isFixedHTMLTitle, sysNameField } from '@/settings'

// NProgress是页面跳转是出现在浏览器顶部的进度条
NProgress.configure({ showSpinner: false }) // NProgress Configuration 进度环显示隐藏

const whiteList = ['/login', '/auth-redirect', '/dashboard/index', '/rendadaibiao/index', '/zhengxieweiyuan/index', '/gongzuorenyuan/index'] // no redirect whitelist 没有重定向的白名单

router.beforeEach(async(to, from, next) => {
  // set page title 设置页面标题（是否需要固定标题）
  if (isFixedHTMLTitle) {
    // 如果是固定标题
    // 首先判断缓存中是否有系统名称
    if (!localStorage.getItem(sysNameField)) {
      // 若没有则请求接口，存储到缓存中
      document.title = await getSystemNameAsync()
    } else {
      document.title = localStorage.getItem(sysNameField)
    }
  } else {
    // 动态设置标题：
    document.title = getPageTitle(to.meta.title) // 系统配置的title页面标题
  }

  // start progress bar 开始进度条
  NProgress.start()

  /* next()
      const {roles} = await store.dispatch('user/getInfo')
      const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
      // 动态添加可访问的路由
      router.addRoutes(accessRoutes)
      console.log(router,'router');*/
  // 判断是否有登录功能
  if (isNeedLogin) {
    const hasToken = getToken()
    if (hasToken) {
      // 如果有token
      if (to.path === '/login') {
        // 如果是登录页，请重定向到主页
        next({ path: '/' })
        NProgress.done()
      } else {
        // 确定用户是否已通过getInfo获得其权限角色 determine whether the user has obtained his permission roles through getInfo
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        if (hasRoles) {
          next()
        } else {
          try {
            // 获取用户信息
            // 注意：角色必须是对象数组！ such as: ['admin'] or ,['developer','editor']
            let { roles } = await store.dispatch('user/getInfo')
            // 如果没有路由，那么需要清空storage，这里要判断是否有权限是为了避免产生同一个浏览器登录两个页面的bug
            /* // 根据角色生成可访问的路由 generate accessible routes map based on roles
                                     const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                                     // 动态添加可访问的路由
                                     router.addRoutes(accessRoutes)
                                     // hack方法，以确保addRoutes是完整的
                                     // 设置replace：true，因此导航不会留下历史记录
                                     next({...to, replace: true})
                                     //返回该路由是否有访问权限，true 有权限，false 无权限
                                    const pathStatus = await store.dispatch('permission/refreshRoutes', {roles, toPath: to.path})
                                     */

            // TODO  正式部署時刪除
            roles.push('/dashboard/index')
            roles.push('/gd-map-monitor/index')
            roles.push('/ys-map-monitor/index')
            roles = [...new Set(roles)] // 去重

            if (roles.indexOf(to.path) !== -1) {
              // if (roles.indexOf(to.path) !== -1) {
              // 根据角色生成可访问的路由 generate accessible routes map based on roles
              const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
              // 动态添加可访问的路由
              router.addRoutes(accessRoutes)
              // hack方法，以确保addRoutes是完整的
              // 设置replace：true，因此导航不会留下历史记录
              next({ ...to, replace: true })
            } else {
              // removeToken()
              removeStorage('userInfo')
              // resetRouter()
              // 移除token
              store.dispatch('user/resetToken').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
              })
              // window.location.reload();
            }
          } catch (error) {
            // 删除token并进入登录页面以重新登录
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }

        // next()
      }
    } else {
      /* has no token*/
      // 没有token
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly,
        // 在免登录白名单中，直接进入
        next()
      } else {
        // 无权访问的页面将重定向到登录页面。
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    const hasToken = getToken()
    const hasRoles = store.getters.roles && store.getters.roles.length > 0
    if (hasRoles) {
      next()
    } else {
      try {
        // 获取用户信息
        // 注意：角色必须是对象数组！ such as: ['admin'] or ,['developer','editor']
        const { roles } = await store.dispatch('user/getInfo')
        // 如果没有路由，那么需要清空storage，这里要判断是否有权限是为了避免产生同一个浏览器登录两个页面的bug
        // 根据角色生成可访问的路由 generate accessible routes map based on roles
        const accessRoutes = await store.dispatch('permission/generateRoutes')
        // 动态添加可访问的路由
        router.addRoutes(accessRoutes)
        // hack方法，以确保addRoutes是完整的
        // 设置replace：true，因此导航不会留下历史记录
        next({ ...to, replace: true })
      } catch (error) {
        console.log(error, 'error')
      }
    }
    /* if (hasToken) {

            }else {
                /!* has no token*!/
                // 没有token
                if (whiteList.indexOf(to.path) !== -1) {
                    // in the free login whitelist, go directly,
                    // 在免登录白名单中，直接进入
                    next()
                } else {
                    // 无权访问的页面将重定向到登录页面。
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }*/
  }
  // isNeedLogin ? await needLogin(to, from, next) : await noNeedLogin(to, from, next)
})

// 不需要登录功能判断的权限
function noNeedLogin(to, from, next) {

}

// 需要登录功能判断的权限
/* function needLogin(to, from, next) {
    const hasToken = getToken()
    console.log(hasToken, 'hasToken');
    if (hasToken) {
        if (to.path === '/login') {
            // 如果是登录页，请重定向到主页
            next({path: '/'})
            NProgress.done()
        } else {
            // 确定用户是否已通过getInfo获得其权限角色 determine whether the user has obtained his permission roles through getInfo
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    // 获取用户信息
                    // 注意：角色必须是对象数组！ such as: ['admin'] or ,['developer','editor']
                    const {roles} = await store.dispatch('user/getInfo')
                    //如果没有路由，那么需要清空storage，这里要判断是否有权限是为了避免产生同一个浏览器登录两个页面的bug
                    /!* // 根据角色生成可访问的路由 generate accessible routes map based on roles
                     const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                     // 动态添加可访问的路由
                     router.addRoutes(accessRoutes)
                     // hack方法，以确保addRoutes是完整的
                     // 设置replace：true，因此导航不会留下历史记录
                     next({...to, replace: true})*!/

                    //返回该路由是否有访问权限，true 有权限，false 无权限
                    const pathStatus = await
                    store.dispatch('permission/refreshRoutes', {roles, toPath: to.path})

                    if (pathStatus) {
                        // if (roles.indexOf(to.path) !== -1) {
                        // 根据角色生成可访问的路由 generate accessible routes map based on roles
                        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                        // 动态添加可访问的路由
                        router.addRoutes(accessRoutes)
                        // hack方法，以确保addRoutes是完整的
                        // 设置replace：true，因此导航不会留下历史记录
                        next({...to, replace: true})
                    } else {
                        // removeToken()
                        removeStorage('userInfo');
                        // resetRouter()
                        // 移除token
                        store.dispatch('user/resetToken').then(() => {
                            location.reload()// 为了重新实例化vue-router对象 避免bug
                        })
                        // window.location.reload();
                    }

                } catch (error) {
                    // 删除token并进入登录页面以重新登录
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }

            // next()
        }
    } else {
        /!* has no token*!/
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly,
            // 在免登录白名单中，直接进入
            next()
        } else {
            // 无权访问的页面将重定向到登录页面。
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
}*/

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
