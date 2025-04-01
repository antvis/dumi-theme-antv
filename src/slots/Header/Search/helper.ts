import type { ISearchResult } from './SearchResult';

/**
 * dumi 搜索结果转页面 UI 的数据结构，默认取 30 条
 * @param dumiResult
 * @param limit
 * @returns
 */
export function getSearchResults(dumiResults: any[], limit = 30, sort?: string[]): ISearchResult[] {
  const flattenHints = dumiResults
    .flatMap((r) => r.hints)
    .map(({ pageTitle = '', highlightTitleTexts, highlightTexts, link }) => ({
      key: pageTitle,
      link,
      subject: pageTitle,
      title: highlightTitleTexts,
      description: highlightTexts,
    }));

  const sorted = sort
    ? flattenHints.sort((a, b) => {
        const isMatch = (a) =>
          sort.some((pattern) =>
            pattern.startsWith('!') ? !a.link.includes(pattern.slice(1)) : a.link.includes(pattern),
          );
        const linkA = isMatch(a);
        const linkB = isMatch(b);

        if (linkA && !linkB) return -1;
        if (!linkA && linkB) return 1;
        return 0;
      })
    : flattenHints;

  return sorted.slice(0, limit);
}
