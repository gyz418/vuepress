module.exports = {
  title: 'gyz418',
  description: 'Just playing around',
  dest:'public',
  theme: '@vuepress/theme-default',
  themeConfig: {
    docsDir: 'docs',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'webpack', link: '/webpack' },
      { text: 'git', link: '/git' },
      { text: 'css', link: '/css' },
    ],
    sidebar: 'auto',
    sidebarDepth: 2,
    displayAllHeaders: true,
  },
}