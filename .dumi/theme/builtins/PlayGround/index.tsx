import React from 'react';
import { Result } from 'antd';
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from 'react-i18next';
import { PlayGround, PlayGroundProps } from '../../slots/PlayGround';

export type MdPlayGroundProps = {
  examples: PlayGroundProps[];
  path: string;
  height?: number;
  rid?: string;
}

const MdPlayGround: React.FC<any> = ({
  examples,
  path,
  rid,
  height = 400,
}) => {
  if (!examples || !examples.length || !path) return null;
  const example = examples.find((item: any) => item.relativePath === path);
  if (!example) return null;
  return (
    <PlayGround
      source={example.source}
      babeledSource={example.babeledSource}
      playground={example.playground}
      height={height}
      replaceId={rid}
    />
  );
};

class ErrorHandlerMdPlayGround extends React.Component<
  MdPlayGroundProps & WithTranslation,
  { error?: Error }
> {
  state = {
    error: undefined,
  };

  static getDerivedStateFromError(error: Error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { error };
  }

  render() {
    const { t } = this.props;
    const { error } = this.state;
    if (error) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <Result
          status="error"
          title={t('演示代码报错，请检查')}
          subTitle={<pre>{error && (error as any).message}</pre>}
        />
      );
    }
    return <MdPlayGround {...this.props} />;
  }
}

export default withTranslation()(ErrorHandlerMdPlayGround);
