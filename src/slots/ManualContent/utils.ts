export function getOpenKeys() {
  const pathname = window.location.pathname
  const pathArr = pathname.split('/')
  const openKeys = []
  for (let i = pathArr.length; i > 0; i--) {
    const tem = pathArr.slice(0, i)
    openKeys.push(tem.join('/'))
  }
  return openKeys
}

export function getBaseRoute() {
  let matchRoute = window.location.pathname
  // 兼容 zh
  matchRoute = matchRoute.replace('/zh/', '/')
  // 兼容带有docs的route
  matchRoute = matchRoute.replace('/docs', '')
  // 查找 baseRoute
  const reg = window.location.pathname.startsWith('/en') ? /(\/[A-z]*\/?\/[A-z]*)\/?/ : /(\/[A-z]*)\/?/
  const mainRoute = matchRoute.match(reg)
  return mainRoute![1]
}

export function getIndexRoute(MenuData) {
  const defaultOpenKeys = []
  let topRoute = MenuData![0]
  defaultOpenKeys.push(topRoute.key)
  while (topRoute.children) {
    topRoute = topRoute.children[0]
    defaultOpenKeys.push(topRoute.key)
  }
  return defaultOpenKeys[defaultOpenKeys.length - 1]
}