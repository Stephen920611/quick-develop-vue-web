import Layout from '@/layout'

const commandDispatchRouter = {
    path: '/command-dispatch',
    component: Layout,
    redirect: '/command-dispatch/situational-overview',
    name: 'CommandDispatchModule',
    meta: {
        title: 'commandDispatchModule',
        icon: 'configuration',
        isNeedReWriteRedirect: true,
        isShowSlideBar: true,
        fullPath: '/command-dispatch'
    },
    children: [
        {
            path: 'situational-overview',
            redirect: '/command-dispatch/situational-overview/index',
            component: () => import('@/views/command-dispatch/index'),
            name: 'SOverViewIndex',
            meta: {
                title: 'sOverViewIndex',
                icon: 'configuration',
                activeMenu: '/command-dispatch/situational-overview',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath: '/command-dispatch/situational-overview'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/command-dispatch/situational-overview/index'),
                    name: 'OverViewIndex',
                    meta: {
                        title: 'overViewIndex',
                        isShowSlideBar: true,
                        fullPath: '/command-dispatch/situational-overview/index'
                    }
                }
            ]
        },
        {
            path: 'map-command',
            redirect: '/command-dispatch/map-command/index',
            component: () => import('@/views/command-dispatch/index'),
            name: 'CommandDispatchIndex',
            meta: {
                title: 'commandDispatchIndex',
                icon: 'configuration',
                activeMenu: '/command-dispatch/map-command',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath: '/command-dispatch/map-command'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/command-dispatch/map-command/index'),
                    name: 'MapCommandIndex',
                    meta: {
                        title: 'mapCommandIndex',
                        isShowSlideBar: true,
                        fullPath: '/command-dispatch/map-command/index'
                    }
                }
            ]
        }
    ]
}

export default commandDispatchRouter
