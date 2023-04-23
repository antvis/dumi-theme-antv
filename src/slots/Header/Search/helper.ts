import type { ISearchResult } from './SearchResult';

/**
 * dumi 搜索结果转页面 UI 的数据结构
 * @param dumiResult
 * @returns 
 */
export function getSearchResults(dumiResults: any[]): ISearchResult[] {
  const hints = dumiResults.map(r => r.hints).flat();

  return hints.map(({ pageTitle = '', highlightTitleTexts, highlightTexts, link }) => {
    return {
      link,
      subject: pageTitle,
      tilte: highlightTitleTexts,
      description: highlightTexts,
    };
  });
}