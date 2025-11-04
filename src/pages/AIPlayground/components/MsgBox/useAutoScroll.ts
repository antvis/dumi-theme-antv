import { useRef, useLayoutEffect, useState } from 'react';

// threshold: 容差值，表示离底部多远以内都算“在底部”
export const useAutoScroll = (dependencies: any, threshold = 100) => {
    // 指向滚动容器
    const containerRef = useRef<HTMLDivElement>(null);
    // 指向一个永远在列表末尾的空div，作为滚动的目标
    const anchorRef = useRef<HTMLDivElement>(null);

    const [showScrollDownButton, setShowScrollDownButton] = useState(false);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // scrollTop: 滚动条距离顶部的距离
        // scrollHeight: 整个可滚动内容的总高度
        // clientHeight: 容器可视区域的高度
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + threshold + 200;

        // 只有当用户已经在底部时，才执行自动滚动
        if (isAtBottom) {
            anchorRef.current?.scrollIntoView({
                block: 'end',       // 滚动到元素的末尾
            });
            setShowScrollDownButton(false);
        } else {
            setShowScrollDownButton(true);
        }
    }, [dependencies, threshold]); // 依赖项改变时（比如新消息来了），触发此 effect

    return { containerRef, anchorRef, showScrollDownButton };
};