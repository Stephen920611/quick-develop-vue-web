import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/assets/css/reset.css'  //重置css
import '@/styles/index.scss' // 全局 css
/*引入字体样式*/
import '@/assets/font-awesome/css/font-awesome.min.css'

import App from './App'
import store from './store'
import router from './router'
// axios封装
import $axios from './utils/request'
import _ from 'lodash';
Vue.prototype.$lodash = _;
Vue.prototype.$axios = $axios;
//引用jquery文件
import $ from 'jquery'
Vue.prototype.$ = $;
//引入打印文件
import htmlToPdf from '@/utils/htmlToPdf'

import i18n from './lang' // 国际化
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // 全局过滤器
import './utils/scrollbar' // 滚动条插件

import echarts from 'echarts'
Vue.prototype.$echarts = echarts // 引入echarts，将其绑定到vue原型上 使用时this.$echarts


import qs from 'qs';
Vue.prototype.$qs = qs;

import './assets/font/iconfont.css';
import './assets/font/iconfont.js'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 * 如果您不想使用模拟服务器，您想将MockJs用于模拟API，您可以执行：mockXHR（）
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 * 目前MockJs将用于生产环境，请在上线前将其删除！ ！ ！
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
//
// }
/*const { mockXHR } = require('../mock')
mockXHR()*/



Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // 设置element-ui默认大小
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(htmlToPdf)


// 注册全局过滤器register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
