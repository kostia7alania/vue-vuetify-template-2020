const setPageTitle = async title => {
  const { pageTitlePostfix } = (await import('@/config/constants')).default
  window.document.title = title ? `${title} | ${pageTitlePostfix}` : pageTitlePostfix
}
export default setPageTitle
