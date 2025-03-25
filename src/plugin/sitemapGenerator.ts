import chalk from 'chalk';
import type { IApi } from 'dumi';
import fs from 'fs';
import { merge } from 'lodash';
import moment from 'moment';
import path from 'path';
import xmlbuilder from 'xmlbuilder';

interface SitemapConfig {
  /** 是否启用 */
  enable?: boolean;
  /** 输出目录 */
  outputDir?: string;
  /** 网站根URL */
  siteUrl?: string;
  /** 文件名 */
  filename?: string;
}

const defaultConfig: SitemapConfig = {
  enable: true,
  outputDir: 'dist',
  filename: 'sitemap.xml',
};

// 生成日期时间
const currentDateTime = moment().format('YYYY-MM-DDTHH:mm:ss+00:00');

/**
 * 生成静态HTML文件的URL列表
 */
function generateUrls(config: SitemapConfig) {
  const urls = [];

  function walkDir(currentPath: string) {
    const files = fs.readdirSync(currentPath);
    files.forEach((file) => {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (stat.isFile() && path.extname(file) === '.html') {
        const relativePath = path.relative(config.outputDir, fullPath);
        let url = `${config.siteUrl}/${relativePath.replace(/\\/g, '/')}`;
        if (url.endsWith('/index.html') && !url.match(/\/:(\w+)/) && !url.includes('/zh/')) {
          url = url.replace(/\/index\.html$/, '');
          urls.push(url);
        }
      }
    });
  }

  walkDir(config.outputDir);

  return urls;
}

/**
 * 生成sitemap.xml文件
 */
function writeSitemap(config: SitemapConfig, urls: string[]) {
  const root = xmlbuilder
    .create('urlset', {
      version: '1.0',
      encoding: 'utf-8',
    })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    .att(
      'xsi:schemaLocation',
      'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
    );

  // 添加注释
  root.comment(` Created By G6 Sitemap Generator,  Generated at: ${currentDateTime} `);

  urls.forEach((url) => {
    const loc = url.replace(/\/index\.html$/, '');
    const depth = url.split('/').length - 3; // 扣除 http:// 和域名部分
    const priority = Math.max(0.5, 1 - depth * 0.1).toFixed(2);

    root.ele('url').ele('loc', loc).up().ele('lastmod', currentDateTime).up().ele('priority', priority);
  });

  const sitemapContent = root.end({ pretty: true });

  fs.writeFileSync(path.join(config.outputDir, config.filename), sitemapContent);

  console.log(chalk.green(`✅ Sitemap generated including ${urls.length} urls. `));
}

function generateRobotsTxt(config: SitemapConfig) {
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${config.siteUrl}/sitemap.xml`;

  fs.writeFileSync(path.join(config.outputDir, 'robots.txt'), robotsContent);
}

export default function generateSitemap(api: IApi) {
  // 从 themeConfig 中获取配置
  const getConfig = (): SitemapConfig => {
    const themeConfig = (api.config.themeConfig || {}) as any;
    let userConfig = themeConfig?.sitemap;

    if (!userConfig) {
      userConfig = { enable: false };
    }

    return merge({ siteUrl: themeConfig.siteUrl }, defaultConfig, userConfig);
  };

  const config = getConfig();

  if (!config.enable) {
    return;
  }

  const urls = generateUrls(config);
  writeSitemap(config, urls);

  generateRobotsTxt(config);
}
