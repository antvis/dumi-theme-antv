/**
 * 统一的事件跟踪函数
 * @param {string} eventName - 事件名称，如 'button_click'
 * @param {object} params - 事件相关的参数
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined') {
    return false;
  }
  if (window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    console.warn('[Analytics] gtag is not available.');
  }
};
