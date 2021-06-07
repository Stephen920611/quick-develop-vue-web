/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const systemManageRouter = {
  path: '/system-manage',
  component: Layout,
  redirect: '/system-manage/user-management',
  name: 'SystemManageModule',
  meta: {
    title: 'systemManageModule',
    icon: 'configuration',
    isNeedReWriteRedirect: true,
    isShowSlideBar: true,
    fullPath: '/system-manage'
  },
  children: [

    /* -------------------------------------- 用户管理 ----------------------------------*/
    {
      path: 'user-management',
      redirect: '/system-manage/user-management/platform-user-manage',
      component: () => import('@/views/system-manage/user-management/index'),
      name: 'UserManagementIndex',
      meta: {
        title: 'userManagementIndex',
        isShowSlideBar: true,
        icon: 'configuration',
        fullPath: '/system-manage/user-management/platform-user-manage/index'
      },
      children: [
        /* -------------------------------------- 平台用户管理 ----------------------------------*/
        {
          path: 'platform-user-manage',
          redirect: '/system-manage/user-management/platform-user-manage/index',
          component: () => import('@/views/system-manage/user-management/index'),
          name: 'PlatformUserManageIndex',
          meta: {
            title: 'platformUserManageIndex',
            isShowSlideBar: true,
            fullPath: '/system-manage/user-management/platform-user-manage/index'
          },
          children: [
            {
              path: 'index',
              // component: () => import('@/views/system-manage/user-management/platform-user-manage/oldList'),
              component: () => import('@/views/system-manage/user-management/platform-user-manage/list'),
              name: 'PlatformUserManageList',
              hidden: true,
              meta: {
                title: 'platformUserManageList',
                breadcrumb: false, // 在面包屑中隐藏
                activeMenu: '/system-manage/user-management/platform-user-manage',
                noCache: true,
                isShowSlideBar: true,
                fullPath: '/system-manage/user-management/platform-user-manage/index'
              }
            }
          ]
        },

        /* -------------------------------------- 角色管理 ----------------------------------*/
        {
          path: 'role-manage',
          redirect: '/system-manage/user-management/role-manage/index',
          component: () => import('@/views/system-manage/user-management/index'),
          name: 'RoleManageIndex',
          meta: {
            title: 'roleManageIndex',
            isShowSlideBar: true,
            fullPath: '/system-manage/user-management/role-manage/index'
          },
          children: [
            {
              path: 'index',
              // component: () => import('@/views/system-manage/user-management/role-manage/oldList'),
              component: () => import('@/views/system-manage/user-management/role-manage/list'),
              name: 'RoleManageList',
              hidden: true,
              meta: {
                title: 'roleManageList',
                breadcrumb: false, // 在面包屑中隐藏
                activeMenu: '/system-manage/user-management/role-manage',
                noCache: true,
                isShowSlideBar: true,
                fullPath: '/system-manage/user-management/role-manage/index'
              }
            }
          ]
        }
      ]
    },

    /* -------------------------------------- 权限管理 ----------------------------------*/
    {
      path: 'authority-management',
      redirect: '/system-manage/authority-management/menu-management',
      component: () => import('@/views/system-manage/authority-management/index'),
      name: 'AuthorityManagementIndex',
      meta: {
        title: 'authorityManagementIndex',
        isShowSlideBar: true,
        icon: 'configuration',
        fullPath: '/system-manage/authority-management/index'
      },
      children: [
        /* -------------------------------------- 菜单管理 ----------------------------------*/
        {
          path: 'menu-management',
          redirect: '/system-manage/authority-management/menu-management/index',
          component: () => import('@/views/system-manage/authority-management/index'),
          name: 'MenuManageIndex',
          meta: {
            title: 'menuManageIndex',
            isShowSlideBar: true,
            fullPath: '/system-manage/authority-management/menu-management/index'
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/system-manage/authority-management/menu-manage/list'),
              name: 'MenuManageList',
              hidden: true,
              meta: {
                title: 'menuManageList',
                breadcrumb: false, // 在面包屑中隐藏
                activeMenu: '/system-manage/authority-management/menu-management',
                noCache: true,
                isShowSlideBar: true,
                fullPath: '/system-manage/authority-management/menu-management/index'
              }
            }
          ]
        },
        /* -------------------------------------- 菜单权限分派 ----------------------------------*/
        {
          path: 'power-assign',
          redirect: '/system-manage/authority-management/power-assign/index',
          component: () => import('@/views/system-manage/authority-management/index'),
          name: 'PowerAssignIndex',
          meta: {
            title: 'powerAssignIndex',
            isShowSlideBar: true,
            fullPath: '/system-manage/authority-management/power-assign/index'
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/system-manage/authority-management/power-assign/list'),
              name: 'PowerAssignList',
              hidden: true,
              meta: {
                title: 'powerAssignList',
                breadcrumb: false, // 在面包屑中隐藏
                activeMenu: '/system-manage/authority-management/power-assign',
                noCache: true,
                isShowSlideBar: true,
                fullPath: '/system-manage/authority-management/power-assign/index'
              }
            }
          ]
        }

      ]
    }

  ]
}

export default systemManageRouter
