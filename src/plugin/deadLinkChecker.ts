import chalk from 'chalk';
import * as cheerio from 'cheerio';
import { IApi } from 'dumi';
import * as fs from 'fs';
import * as glob from 'glob';
import merge from 'lodash.merge';
import pLimit from 'p-limit';
import * as path from 'path';

interface DeadLinkOptions {
  // 是否开启死链检查，默认是 true
  enable?: boolean;
  // 构建输出目录，默认是 dist
  distDir?: string;
  // 检查外部链接，默认是 true
  checkExternalLinks?: boolean;
  // 忽略的链接，默认是 ['^#', '^mailto:', '^tel:', '^javascript:', '^data:', '.*stackblitz\\.com.*']
  ignorePatterns?: (string | RegExp)[];
  // 检查的文件扩展名，默认是 ['.html']
  fileExtensions?: string[];
  // 失败时是否退出，默认是 false
  failOnError?: boolean;
  // 外部链接超时时间，默认是 10000
  externalLinkTimeout?: number;
  // 最大并发请求数，默认是 5
  maxConcurrentRequests?: number;
}

interface DeadLinkConfig extends Omit<DeadLinkOptions, 'ignorePatterns'> {
  ignorePatterns: RegExp[];
}

interface LinkInfo {
  url: string;
  text: string;
  sourceFile: string;
  isExternal: boolean;
}

interface DeadLink extends LinkInfo {
  reason: string;
}

interface CheckResult {
  totalLinks: number;
  deadLinks: DeadLink[];
  success: boolean;
}

const defaultConfig: DeadLinkOptions = {
  enable: true,
  distDir: 'dist',
  checkExternalLinks: false,
  ignorePatterns: ['^#', '^mailto:', '^tel:', '^javascript:', '^data:', '.*stackoverflow\\.com.*'],
  fileExtensions: ['.html'],
  failOnError: false,
  externalLinkTimeout: 10000,
  maxConcurrentRequests: 5,
};

// 在文件顶部添加缓存对象声明
const tempCache: Record<string, { success: boolean; reason?: string }> = {};

/**
 * 处理配置，转换正则表达式
 */
function processConfig(options: DeadLinkOptions): DeadLinkConfig {
  return {
    ...options,
    ignorePatterns: options.ignorePatterns.map((pattern) =>
      typeof pattern === 'string' ? new RegExp(pattern) : pattern,
    ),
  };
}

/**
 * 收集HTML文件中的所有链接
 */
function collectLinks(htmlFiles: string[], distDir: string): LinkInfo[] {
  const links: LinkInfo[] = [];

  htmlFiles.forEach((htmlFile) => {
    const filePath = path.join(distDir, htmlFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(content);

    $('a').each((_, element) => {
      const url = $(element).attr('href');
      if (!url) return;

      links.push({
        url,
        text: $(element).text().trim() || '[No text]',
        sourceFile: htmlFile,
        isExternal: url.startsWith('http://') || url.startsWith('https://'),
      });
    });
  });

  return links;
}

/**
 * 过滤掉被忽略的链接
 */
function filterIgnoredLinks(links: LinkInfo[], ignorePatterns: RegExp[]): LinkInfo[] {
  return links.filter((link) => {
    return !ignorePatterns.some((pattern) => pattern.test(link.url));
  });
}

/**
 * 检查内部链接
 */
function checkInternalLinks(links: LinkInfo[], existingFiles: Set<string>): DeadLink[] {
  const deadLinks: DeadLink[] = [];

  links.forEach((link) => {
    if (!link.url.startsWith('/') || link.url.startsWith('//')) return;

    // 移除URL中的锚点部分
    let normalizedLink = link.url.split('#')[0];

    // 移除URL中的查询参数部分
    normalizedLink = normalizedLink.split('?')[0];

    if (normalizedLink.endsWith('/')) {
      normalizedLink += 'index.html';
    }

    const exists =
      existingFiles.has(normalizedLink) ||
      (path.extname(normalizedLink) === '' &&
        (existingFiles.has(normalizedLink + '/') ||
          existingFiles.has(normalizedLink + '/index.html') ||
          existingFiles.has(normalizedLink + '.html')));

    if (!exists) {
      deadLinks.push({
        ...link,
        reason: 'File not found',
      });
    }
  });

  return deadLinks;
}

/**
 * 检查外部链接
 */
async function checkExternalLinks(links: LinkInfo[], config: DeadLinkConfig): Promise<DeadLink[]> {
  const deadLinks: DeadLink[] = [];
  const limit = pLimit(config.maxConcurrentRequests);

  // 分离需要检查的链接和已缓存的链接
  const uncachedLinks: LinkInfo[] = [];
  links.forEach((link) => {
    // 检查缓存中是否已有结果
    if (tempCache[link.url]) {
      // 使用缓存结果
      if (!tempCache[link.url].success) {
        deadLinks.push({
          ...link,
          reason: tempCache[link.url].reason || '未知错误',
        });
      }
      console.log(chalk.gray(`  [cached] ${link.url}`));
    } else {
      uncachedLinks.push(link);
    }
  });

  // 只检查未缓存的链接
  const promises = uncachedLinks.map((link) => {
    return limit(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.externalLinkTimeout);

        const response = await fetch(link.url);
        clearTimeout(timeoutId);

        // 存入缓存
        if (response.status >= 400) {
          tempCache[link.url] = {
            success: false,
            reason: `Status code ${response.status}`,
          };
          deadLinks.push({
            ...link,
            reason: `Status code ${response.status}`,
          });
        } else {
          tempCache[link.url] = { success: true };
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        // 存入缓存
        tempCache[link.url] = { success: false, reason };
        deadLinks.push({
          ...link,
          reason,
        });
      }
    });
  });

  await Promise.all(promises);
  return deadLinks;
}

/**
 * 执行死链检查
 */
async function runCheck(config: DeadLinkConfig): Promise<CheckResult> {
  const distDir = path.resolve(process.cwd(), config.distDir);

  if (!fs.existsSync(distDir)) {
    return {
      totalLinks: 0,
      deadLinks: [],
      success: false,
    };
  }

  const htmlFiles = glob.sync(`**/*+(${config.fileExtensions.join('|')})`, { cwd: distDir });

  const existingFiles = new Set<string>();
  glob.sync('**/*', { cwd: distDir, nodir: true }).forEach((file) => {
    existingFiles.add('/' + file);
  });

  const allLinks = collectLinks(htmlFiles, distDir);
  const linksToCheck = filterIgnoredLinks(allLinks, config.ignorePatterns);

  const internalDeadLinks = checkInternalLinks(
    linksToCheck.filter((link) => !link.isExternal),
    existingFiles,
  );

  const externalDeadLinks = config.checkExternalLinks
    ? await checkExternalLinks(
        linksToCheck.filter((link) => link.isExternal),
        config,
      )
    : [];

  const deadLinks = [...internalDeadLinks, ...externalDeadLinks];

  return {
    totalLinks: allLinks.length,
    deadLinks,
    success: deadLinks.length === 0,
  };
}

/**
 * 生成死链检查报告并打印到控制台
 */
function generateReport(result: CheckResult): void {
  console.log();

  if (result.deadLinks.length === 0) {
    console.log(chalk.green(`✓ Check completed: All ${result.totalLinks} links are valid`));
    console.log();
    return;
  }

  const linksByFile = result.deadLinks.reduce((acc, link) => {
    if (!acc[link.sourceFile]) {
      acc[link.sourceFile] = [];
    }
    acc[link.sourceFile].push(link);
    return acc;
  }, {} as Record<string, DeadLink[]>);

  console.log(
    chalk.yellow(
      `📊 Found ${result.deadLinks.length}/${result.totalLinks} dead links in ${Object.keys(linksByFile).length} files`,
    ),
  );

  Object.entries(linksByFile).forEach(([file, links]) => {
    console.log();
    console.log(chalk.yellow(`📄 ${file}:`));

    links.forEach((link) => {
      console.log(chalk.red(`  ✗ ${link.url}`));
      console.log(chalk.gray(`    • Text: ${link.text}`));
      console.log(chalk.gray(`    • Reason: ${link.reason}`));
    });
  });

  console.log();
  console.log(chalk.cyan(`💡 Tip: Please fix these links and run \`npx dumi check-links\` to verify`));
  console.log(chalk.cyan(`💡 Tip: Don't forget to run \`npm run build\` after fixing the links`));
  console.log();
}

/**
 * dumi 死链检查插件
 */
export default (api: IApi) => {
  // 从 themeConfig 中获取配置
  const getConfig = (): DeadLinkConfig => {
    const themeConfig = (api.config.themeConfig || {}) as any;
    let userConfig = themeConfig?.deadLinkChecker;

    if (!userConfig) {
      userConfig = { enable: false };
    }

    const config = merge({}, defaultConfig, userConfig);

    // 检查是否禁用
    if (!config.enable) {
      return processConfig({
        ...config,
        // 设置为空数组，使插件不执行任何检查
        fileExtensions: [],
      });
    }

    // 合并默认配置和用户配置
    return processConfig(config);
  };

  const checkLinks = async (onBeforeCheck?: () => void) => {
    const config = getConfig();
    // 如果禁用了功能或文件扩展名为空，则跳过检查
    if (config.fileExtensions.length === 0) {
      return;
    }

    onBeforeCheck?.();

    console.log(chalk.gray('🔍 Checking for dead links...'));

    const result = await runCheck(config);
    generateReport(result);

    // 只有在发现死链接且配置为失败时退出
    if (!result.success && config.failOnError) {
      process.exit(1);
    }
  };

  return checkLinks;
};
