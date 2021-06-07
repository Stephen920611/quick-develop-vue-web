module.exports = {
  title: 'XX管理系统',

  /**
     * @type {boolean} true | false
     * @description 是否含有登录功能
     */
  isNeedLogin: true,
  // isNeedLogin: false,

  /**
     * @type {boolean} true | false
     * @description 是否固定的网页标题，如果不固定，则样式为：模块名称-系统名称
     */
  isFixedHTMLTitle: false,

  /**
     * @type {boolean} true | false
     * @description 系统名称的字段
     */
  sysNameField: 'xx_system_name',

  /**
     * @type {boolean} true | false
     * @description Whether show the settings right-panel
     */
  showSettings: true,

  /**
     * @type {boolean} true | false
     * @description Whether need tagsView
     */
  tagsView: true,

  /**
     * @type {boolean} true | false
     * @description Whether fix the header
     */
  fixedHeader: false,

  /**
     * @type {boolean} true | false
     * @description Whether show the logo in sidebar
     */
  sidebarLogo: true,

  /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
  errorLog: 'production'
}
