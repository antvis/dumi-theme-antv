import { useState, useEffect } from 'react';

// Hook的参数类型定义
interface TypewriterOptions {
  texts: string[];
  typingSpeed?: number; // 打字速度 (ms)
  pauseDelay?: number;  // 打完字后的停留时间 (ms)
}

/**
 * 一个自定义React Hook，用于实现打字机效果。
 * @param {TypewriterOptions} options - 配置选项
 * @returns {string} 当前应显示的文本
 */
export const useTypewriter = ({
                                texts,
                                typingSpeed = 150, // 默认打字速度 150ms
                                pauseDelay = 2000,   // 默认停留时间 2s
                              }: TypewriterOptions): string => {
  // 当前显示第几个字符串
  const [textIndex, setTextIndex] = useState(0);
  // 当前字符串显示到第几个字符
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    // 获取当前要处理的完整字符串
    const currentText = texts[textIndex];

    // 如果当前字符索引小于字符串长度，说明还在打字过程中
    if (charIndex < currentText.length) {
      const typingTimeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);

      // 清除定时器，防止内存泄漏
      return () => clearTimeout(typingTimeout);
    }
    // 如果字已经打完
    else {
      const pauseTimeout = setTimeout(() => {
        // 切换到下一个字符串
        setTextIndex((prev) => (prev + 1) % texts.length);
        // 重置字符索引，从头开始
        setCharIndex(0);
      }, pauseDelay);

      // 清除定时器
      return () => clearTimeout(pauseTimeout);
    }
  }, [charIndex, textIndex, texts, typingSpeed, pauseDelay]);

  // 根据当前状态截取并返回应该显示的字符串
  return texts[textIndex].substring(0, charIndex);
};
