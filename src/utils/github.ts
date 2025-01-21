import { useSiteData } from 'dumi';
import useSWR from 'swr';

export const useGithubRepo = () => {
  const { githubUrl } = useSiteData().themeConfig;

  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const [, owner, repo] = githubUrl.match(regex);

  const { data: details } = useSWR(`/repos/${owner}/${repo}`, () => {
    return getRepoDetails(owner, repo);
  });

  return { owner, repo, defaultBranch: details?.default_branch };
};

export async function getLatestVersion(owner: string, repo: string): Promise<string> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
    const data = await response.json();
    return data.tag_name;
  } catch (e) {
    return undefined;
  }
}

export async function getRepoDetails(owner: string, repo: string): Promise<any> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    const data = await response.json();
    return data;
  } catch (e) {
    return undefined;
  }
}
