import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { compressImage } from '@/lib/notion/mapImage'

export async function generateSitemapXml({ allPages }) {
  const urls = [{
    loc: `${BLOG.LINK}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily'
  }, {
    loc: `${BLOG.LINK}/archive`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily'
  }, {
    loc: `${BLOG.LINK}/category`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily'
  }, {
    loc: `${BLOG.LINK}/tag`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily'
  }]

  const manifestData = {
    name: siteConfig('TITLE') ?? 'Clivia Blog',
    short_name: siteConfig('TITLE') ?? 'Clivia Blog',
    description: siteConfig('TITLE') ?? 'Clivia Blog',
    icons: [
      {
        src: compressImage(siteConfig('BLOG_FAVICON'), 192),
        type: 'image/png',
        sizes: '192x192'
      }
    ],
    display: 'standalone',
    background_color: '#181818',
    theme_color: '#181818'
  }

  // 循环页面生成
  allPages?.forEach(post => {
    const slugWithoutLeadingSlash = post?.slug?.startsWith('/')
      ? post?.slug?.slice(1)
      : post.slug
    urls.push({
      loc: `${link}/${slugWithoutLeadingSlash}`,
      lastmod: new Date(post?.publishDay).toISOString().split('T')[0],
      changefreq: 'daily'
    })
  })

  const xml = createSitemapXml(urls)

  try {
    fs.writeFileSync('sitemap.xml', xml)
    fs.writeFileSync('./public/sitemap.xml', xml)
    fs.writeFileSync('./public/manifest.json', JSON.stringify(manifestData, null, 2));
  } catch (error) {
    console.warn('无法写入文件', error)
  }
}

/**
 * 生成站点地图
 * @param {*} urls
 * @returns
 */
function createSitemapXml(urls) {
  let urlsXml = ''
  urls.forEach(u => {
    urlsXml += `<url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    </url>
    `
  })

  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${urlsXml}
    </urlset>
    `
}
