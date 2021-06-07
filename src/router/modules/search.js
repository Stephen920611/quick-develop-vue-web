/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const searchRouter = {
    path: '/search-monitor',
    // component: Layout,
    // component: () => import('@/views/router-link/index'),
    component: Layout,
    redirect: '/search-monitor/search-view/index',
    name: 'searchModule',
    meta: {
        title: 'dangerModule',
        icon: 'industry',
        // breadcrumb: false,  //在面包屑中隐藏
        isShowSlideBar: true,
        isNeedReWriteRedirect: true,
        fullPath:'/search-monitor'
    },
    children: [
        {
            path: 'search-view',
            redirect: '/search-monitor/search-view/index',
            component: () => import('@/views/router-link/index'),
            name: 'SearchView',
            meta: {
                title: 'searchView',
                icon: 'waybill',
                isShowSlideBar: true,
                // isNeedReWriteRedirect: true,
                fullPath:'/search-monitor/search-view/index'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/search-monitor/search'),
                    name: 'SearchViewIndex',
                    hidden: true,
                    meta: {
                        title: 'searchViewIndex',
                        breadcrumb: false,  //在面包屑中隐藏
                        activeMenu: '/search-monitor/search-view',
                        noCache: false,
                        isShowSlideBar: true,
                        fullPath:'/search-monitor/search-view/index'
                    }
                }
            ]
        },
    
    ]
};

export default searchRouter
