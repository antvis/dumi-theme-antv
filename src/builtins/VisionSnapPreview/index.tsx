import React, { useContext, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeAntVContext } from '../../context';
import { getDemoInfo } from '../../slots/CodeRunner/utils';
import { wrap2VisionSnap } from '../../pages/AIPlayground/components/TaskBox/generateCode';
import { requestProxy, useVisionsnapSdk } from '../../hooks/useVisionsnapSdk';
import { useAntVConfig } from '../../hooks/useProducts';
import Loading from '../../slots/Loading';
import { ErrorFallback } from '../Playground';

export type VisionSnapPreviewProps = {
    /**
     * 代码示例的地址
     */
    path: string;
    /**
     * 渲染容器的 id
     */
    rid?: string;
    /**
     * 容器的高度，默认为 400px
     */
    height?: number | string;
};

const VisionSnapPreview: React.FC<VisionSnapPreviewProps> = ({ path, rid, height = 400 }) => {
    const { meta }: any = useContext(ThemeAntVContext);
    const { exampleTopics } = meta;

    const demoInfo = useMemo(() => {
        const match = path.match(/([\w-]+)\/([\w-]+)\/demo\/([\w-]+)/i);
        if (!match) return null;
        const [_, topic, example, demo] = match;

        // Try exact match first (e.g. "adaptive")
        const info = getDemoInfo(exampleTopics, topic, example, demo);
        if (info) return info;

        // Try with .vue extension if not found (e.g. "adaptive.vue")
        // dumi might not strip .vue extension from the ID
        return getDemoInfo(exampleTopics, topic, example, `${demo}.vue`);
    }, [path, exampleTopics]);

    const { data: { VisionSnapVersion: version } = { VisionSnapVersion: '3.5.12' } } = useAntVConfig();
    const { sdk, loading } = useVisionsnapSdk(version);

    const wrappedVisionSnapCode = useMemo(() => {
        if (!demoInfo) return null;
        return wrap2VisionSnap(demoInfo.source);
    }, [demoInfo]);

    const resolvedHeight = useMemo(() => {
        if (typeof height === 'string' && /^\d+$/.test(height)) {
            return `${height}px`;
        }
        return height;
    }, [height]);

    if (!demoInfo) {
        return <div style={{ height: resolvedHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>Demo not found: {path}</div>;
    }

    if (loading || !wrappedVisionSnapCode) {
        return <Loading style={{ height: resolvedHeight }} />;
    }

    const handleEsmLoadFailed = (err: any) => {
        console.error('VisionSnap ESM Load Failed', err);
    };

    const isVue = wrappedVisionSnapCode.modules["/package.json"].code.includes("vue");

    return (
        <div style={{ height: resolvedHeight }}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <sdk.VisionPreview
                    id={rid || `visionIframe-${path}`}
                    bizCode="antv"
                    style={{ height: '100%' }}
                    userId="antv"
                    displayMode="code-and-preview"
                    initialView="preview"
                    theme="light"
                    code={wrappedVisionSnapCode}
                    requestProxy={requestProxy}
                    isStreaming={false}
                    proxyOptions={{ isWAN: true }}
                    src={`https://www.weavefox.cn/_visionsnap_render${isVue ? '_vue' : ''}/index.html?version=${version}&enableInspector=1`}
                    onEsmLoadFailed={handleEsmLoadFailed}
                    previewZoomConfig={{
                        defaultZoomMode: 100
                    }}
                />
            </ErrorBoundary>
        </div>
    );
};

export default VisionSnapPreview;
