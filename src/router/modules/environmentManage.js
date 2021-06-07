/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

//环境管理
const environmentManageRouter = {
    path: '/environment-manage',
    component: Layout,
    redirect: '/environment-manage/machine-management',
    name: 'EnvironmentManageModule',
    meta: {
        title: 'environmentManageModule',
        icon: 'configuration',
        isNeedReWriteRedirect: true,
        isShowSlideBar: true,
        fullPath: '/environment-manage'
    },
    children: [
        
        /* -------------------------------------- 机器管理 ----------------------------------*/
        {
            path: 'machine-management',
            redirect: '/environment-manage/machine-management/index',
            component: () => import('@/views/environment-manage/machine-management/index'),
            name: 'MachineManagementIndex',
            meta: {
                title: 'machineManagementIndex',
                isShowSlideBar: true,
                icon: 'configuration',
                fullPath: '/environment-manage/machine-management/index'
            },
            children: [
                {
                    path: 'index',
                    // component: () => import('@/views/environment-manage/machine-management/platform-user-manage/oldList'),
                    component: () => import('@/views/environment-manage/machine-management/list'),
                    name: 'MachineManagementList',
                    hidden: true,
                    meta: {
                        title: 'machineManagementList',
                        breadcrumb: false, // 在面包屑中隐藏
                        activeMenu: '/environment-manage/machine-management',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath: '/environment-manage/machine-management/index'
                    }
                },
                
            ]
        },
        
    
    ]
}

export default environmentManageRouter
