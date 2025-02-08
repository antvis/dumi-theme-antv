/**
 * Github Contributors Avatar List
 */
import React from 'react';
import useSWR from 'swr';

export interface AvatarListItem {
  username?: string;
  url?: string;
}

export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  fileName: string;
  owner: string;
  repo: string;
  filter?: (item: AvatarListItem) => boolean;
  emptyRender?: (fileName: string, owner: string, repo: string, branch: string) => React.ReactNode;
  renderItem?: (item?: AvatarListItem, loading?: boolean) => React.ReactNode;
  cache?: boolean;
  branch?: string;
}

// 获取头像列表
const getAvatarList = async ({
  fileName,
  repo,
  owner,
  branch,
}: {
  owner: string;
  repo: string;
  fileName: string;
  branch: string;
}): Promise<AvatarListItem[]> => {
  const url = `https://proapi.azurewebsites.net/doc/getAvatarList?filename=${fileName}&owner=${owner}&repo=${repo}&branch=${branch}`;
  const data = await fetch(url, { mode: 'cors' })
    .then((res) => res.json())
    .catch((e) => console.log(e));
  if (!data) {
    return [];
  }
  return data;
};

const AvatarList: React.FC<ButtonProps> = ({
  className,
  renderItem,
  repo,
  owner,
  style,
  fileName,
  filter = () => true,
  emptyRender,
  branch = 'master',
}: ButtonProps) => {
  const { data, isLoading } = useSWR(
    `/doc/getAvatarList?filename=${fileName}&owner=${owner}&repo=${repo}&branch=${branch}`,
    () => {
      return getAvatarList({ owner, repo, fileName, branch });
    },
  );
  if (isLoading) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          ...style,
        }}
      >
        {(renderItem && renderItem({}, true)) || <span>loading</span>}
      </div>
    );
  }

  const displayList = data?.filter(filter) || [];
  return (
    <>
      <ul
        className={className}
        style={{
          display: 'flex',
          boxSizing: 'border-box',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          flexFlow: 'wrap',
          ...style,
        }}
      >
        {displayList.map((item) => {
          if (renderItem) {
            return renderItem(item, isLoading);
          }
          return (
            <li
              key={item.username}
              style={{
                marginRight: 8,
                borderRadius: 20,
                boxSizing: 'border-box',
                overflow: 'hidden',
                border: '1px solid #ddd',
                display: 'flex',
              }}
            >
              <a
                href={`https://github.com/${item.username}`}
                style={{
                  display: 'flex',
                }}
              >
                <img width={40} src={item.url} alt={item.username} />
              </a>
            </li>
          );
        })}
        {displayList.length === 0 && emptyRender && emptyRender(fileName, owner, repo, branch)}
      </ul>
    </>
  );
};

export default AvatarList;
