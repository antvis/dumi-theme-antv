export const projectFiles = {
  "/package.json": {
    code: `{
      "name": "antv-g2-example",
      "version": "1.0.0",
      "main": "/index.js",
      "dependencies": {
        "@antv/g2": "^5"
      }
    }`
  },
  "/index.js": { // 入口文件是纯 JS
    code: `import { Chart } from '@antv/g2';

    const chart = new Chart({
      container: 'root',
    });

    chart.options({
      type: 'interval',
      autoFit: true,
      data: [
        { grade: '一年级', count: 200 },
        { grade: '二年级', count: 250 },
        { grade: '三年级', count: 300 },
        { grade: '四年级', count: 350 },
      ],
      encode: { x: 'grade', y: 'count' },
    });

    chart.render();
    `
  },
  "/index.html": {
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Vanilla JS Example</title>
</head>
<body>
  <div id="root"></div>
  <div id="container"></div>
  <script src="index.js"></script>
</body>
</html>`
  },
};

export const code = {
  modules: {
    // package.json 文件是必须要的，其中 name, version, main, dependencies 必填
    '/package.json': {
      fpath: '/package.json',
      code: `{
  "name": "dark-card-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@ant-design/icons": "^5.2.6",
    "@alipay/bigfish": "^4.3.0"
  },
"main": "src/index.jsx"
}
`,
    },
    // 入口文件默认是 /src/index.tsx，也可以配合 package.json main 字段指定其他入口
    '/src/index.jsx': {
      fpath: '/src/index.jsx',
      code: `import React from '@alipay/bigfish/react';
      import ReactDOM from '@alipay/bigfish/react-dom';
import { ConfigProvider, theme } from '@alipay/bigfish/antd';
import App from './App';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#141414',
          colorBorderSecondary: '#303030',
        }
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
`,
    },
    '/src/App.jsx': {
      fpath: '/src/App.jsx',
      code: `import React from '@alipay/bigfish/react';
import { Card, Avatar, Typography, Space } from '@alipay/bigfish/antd';
import { UserOutlined, ClockCircleOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import './App.less';
import {styled} from '@alipay/bigfish';
const Title = styled.div\`
  color: palevioletred;
\`;

const { Text } = Typography;

const DarkCard = () => {
  return (
    <div className="dark-card-container">
      <Card
        className="dark-card"
        cover={
          <div className="card-cover">
            <div className="cover-image-placeholder" />
          </div>
        }
        actions={[
          <Space key="time">
            <ClockCircleOutlined />
            <Text className="action-text">2 hours ago</Text>
          </Space>,
          <Space key="likes">
            <HeartOutlined />
            <Text className="action-text">128</Text>
          </Space>,
          <Space key="comments">
            <MessageOutlined />
            <Text className="action-text">24</Text>
          </Space>
        ]}
      >
        <Card.Meta
          avatar={<Avatar size={40} icon={<UserOutlined />} />}
          title={<Title>Dark Theme Card</Title>}
          description={
            <Text className="card-description">
              This is a dark themed card with modern design elements.
              Perfect for displaying content in low-light interfaces.
            </Text>
          }
        />
      </Card>
    </div>
  );
};

export default DarkCard;
`,
    },
    '/src/App.less': {
      fpath: '/src/App.less',
      code: `.dark-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0a0a0a;
  padding: 20px;
}

.dark-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

  .ant-card-head {
    border-bottom: 1px solid #303030;
  }

  .ant-card-actions {
    background: #1a1a1a;
    border-top: 1px solid #303030;

    > li {
      border-right: 1px solid #303030 !important;
    }
  }
}

.card-cover {
  height: 200px;
  background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
  position: relative;
  overflow: hidden;

  .cover-image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at center, #3a3a3a 0%, #1f1f1f 100%);
  }
}

.card-description {
  color: rgba(255, 255, 255, 0.65) !important;
}

.action-text {
  color: rgba(255, 255, 255, 0.45) !important;
  font-size: 12px;
}
`,
    },
  },
};
