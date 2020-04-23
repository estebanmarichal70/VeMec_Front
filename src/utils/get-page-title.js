import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vemec Manager'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
