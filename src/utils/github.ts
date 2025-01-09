import { useSiteData } from 'dumi';

export const useGithubRepo = () => {
  const { githubUrl } = useSiteData().themeConfig;

  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const [, owner, repo] = githubUrl.match(regex);
  return { owner, repo };
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
