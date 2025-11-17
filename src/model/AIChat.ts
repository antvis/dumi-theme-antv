import { proxy, subscribe, snapshot } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import localforage from 'localforage';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import {AIChatState, ChatSession} from '../types';
import {history} from "dumi";
import {message} from "antd";
import {AIMode} from "../components/AI/constant";
import {trackEvent} from "../utils/analytics";

// --- 配置 ---
// 定义需要持久化的 state key
const PERSIST_KEYS: (keyof AIChatState)[] = ['anonymousUserId', 'sessions'];
const STORAGE_KEY = 'ai-chat-state-v1';


// --- 初始状态 ---
const initialState: AIChatState = {
  isInitialized: false,
  anonymousUserId: null,
  sessions: [],
  activeSessionId: null,
  tempMessage: null,
  codeBlock: null,
  lib: null,
  mode: AIMode.implement,
};


// --- valtio Store 创建 ---
export const AIChatStore = proxy<AIChatState>(initialState);

// --- 持久化订阅 ---
subscribe(AIChatStore, () => {
  // 确保只在初始化后才进行持久化
  if (!AIChatStore.isInitialized) return;

  const stateSnapshot = snapshot(AIChatStore);

  // console.log('stateSnapshot', stateSnapshot);

  const stateToPersist: Partial<AIChatState> = {};

  PERSIST_KEYS.forEach((key: string) => {
    stateToPersist[key] = stateSnapshot[key];
  });

  // 异步保存，不阻塞UI
  localforage.setItem(STORAGE_KEY, stateToPersist);
});

export const clearEmptySession = () => {
  AIChatStore.sessions = AIChatStore.sessions.filter(s => s.messages.length > 0);
  if (AIChatStore.sessions.every(s => s.id !== AIChatStore.activeSessionId) && AIChatStore.sessions.length > 0) {
    AIChatStore.activeSessionId = AIChatStore.sessions[0].id;
  }
}

// --- 初始化逻辑 ---
export const initializeAIChat = async () => {
  // 1. 从 localForage 加载持久化的数据
  const persistedState = await localforage.getItem<Partial<AIChatState>>(STORAGE_KEY);

  // 2. 合并加载的数据到 store
  if (persistedState) {
    PERSIST_KEYS.forEach(key => {
      if (persistedState[key] !== undefined) {
        // @ts-ignore - Directly assigning to the proxy state
        AIChatStore[key] = persistedState[key];
      }
    });
  }

  // 3. 处理初始化边缘情况
  if (!AIChatStore.anonymousUserId) {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      // result.visitorId 是一个基于浏览器指纹生成的哈希值
      // 例如：'d8b759e6a5b2f1c3d9e8a6f0b7c5d4a3'
      AIChatStore.anonymousUserId = result.visitorId;
      // console.log('FingerprintJS ID generated:', result.visitorId);
    } catch (error) {
      // console.error('FingerprintJS failed, falling back to simple ID:', error);
      // 如果指纹生成失败（例如被浏览器插件阻止），回退到一个简单方案
      // 如果需要兼容旧浏览器，可以换成 `import { v4 as uuidv4 } from 'uuid';` 和 `uuidv4()`
      AIChatStore.anonymousUserId = crypto.randomUUID();
    }
  }

  if (AIChatStore.sessions.length === 0) {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      createdAt: Date.now(),
      messages: [],
    };
    AIChatStore.sessions.push(newSession);
    AIChatStore.activeSessionId = newSession.id;
  }

  if (!AIChatStore.activeSessionId || !AIChatStore.sessions.find(s => s.id === AIChatStore.activeSessionId)) {
    AIChatStore.activeSessionId = AIChatStore.sessions[0]?.id || null;
  }

  clearEmptySession();

  // 4. 标记初始化完成，这将触发持久化订阅
  AIChatStore.isInitialized = true;
  // console.log('Valtio store initialized:', snapshot(AIChatStore));
};


// --- 计算属性 (使用 derive) ---
export const derivedState = derive({
  // 获取当前激活的会话对象
  activeSession: (get) => {
    const { sessions, activeSessionId } = get(AIChatStore);
    if (!activeSessionId) return null;
    return sessions.find(s => s.id === activeSessionId) || null;
  },
});

// --- 删除会话 ---
export const handleDeleteSession = (sessionId: string) => {
  const sessionIndex = AIChatStore.sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) return;

  // 从数组中移除
  AIChatStore.sessions.splice(sessionIndex, 1);

  // 如果删除的是当前激活的会话，需要重置 activeSessionId
  if (AIChatStore.activeSessionId === sessionId) {
    AIChatStore.activeSessionId = AIChatStore.sessions[0]?.id || null;
  }
};

// --- 重命名会话 ---
export const handleRenameSession = (sessionId: string, newTitle: string) => {
  const session = AIChatStore.sessions.find(s => s.id === sessionId);
  if (session) {
    session.title = newTitle;
  }
};

// --- 置顶会话 ---
export const handlePinSession = (sessionId: string) => {
  const sessionIndex = AIChatStore.sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex <= 0) return; // 如果找不到或者已经在第一位，则不操作

  // 找到会话，从原位置删除，然后添加到数组头部
  const [sessionToPin] = AIChatStore.sessions.splice(sessionIndex, 1);
  AIChatStore.sessions.unshift(sessionToPin);

  // （可选）置顶后自动激活该会话
  AIChatStore.activeSessionId = sessionId;
};

subscribeKey(AIChatStore, 'activeSessionId', () => {
  AIChatStore.codeBlock = null;
})

export const createPureNewSession = (title?: string) => {
  const newConversationName = 'New Conversation';
  const existNewSession = AIChatStore.sessions.find(s => s.title === newConversationName && s.messages.length === 0);
  if (existNewSession) {
    AIChatStore.activeSessionId = existNewSession.id;
    return;
  }
  const newSessionId = crypto.randomUUID();
  AIChatStore.sessions.unshift({
    id: newSessionId,
    title: title ?? newConversationName,
    createdAt: Date.now(),
    messages: [],
  });
  AIChatStore.activeSessionId = newSessionId;
}

export const createNewSession = (config: { promptText: string, mode?: "implement" | "solve", lib?: string, jump?: boolean, context?: string, lang?: string, entry_point?: string }) => {
  // 1. 创建一个新的会话
  createPureNewSession(config.promptText);

  // 2. 创建临时消息并存入 store
  AIChatStore.tempMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: config.promptText,
    createdAt: Date.now(),
    mode: config.mode,
    lib: config.lib,
    context: config.context,
  };
  if (config.jump) {
    history.push(`/${config.lang ?? 'zh'}/ai-playground`);
  }
  // 埋点
  if (typeof window === 'object') {
    trackEvent('start_ai_chat', {
      entry_point: config.entry_point,
      mode: AIChatStore.mode,
      lib: AIChatStore.lib,
      page_title: document.title,
      location: location.href
    });
  }
}


/**
 * 清空所有本地AI对话记录和相关状态。用户注销账户或手动请求清除数据时调用。
 *
 * 该函数会执行以下操作：
 * 1. 从 localforage 中删除持久化的状态数据。
 * 2. 将内存中的 AIChatStore 重置为初始状态。
 *
 */
export const clearAllChatData = async (): Promise<void> => {
  try {
    // 步骤 1: 从本地存储中移除持久化的状态。
    // 这是最关键的一步，可以防止下次加载应用时恢复旧数据。
    await localforage.removeItem(STORAGE_KEY);
    console.log(`[AIChat] Persistent state with key "${STORAGE_KEY}" has been removed.`);

    // 步骤 2: 将内存中的 valtio store 重置为初始状态。
    // 这会立即更新UI，让所有对话记录从界面上消失。
    // 注意：我们不能直接做 AIChatStore = initialState，
    // 因为 proxy 对象是不可替换的。我们必须逐个属性地重置。
    const initialKeys = Object.keys(initialState) as Array<keyof AIChatState>;
    for (const key of initialKeys) {
      // @ts-ignore
      AIChatStore[key] = initialState[key];
    }
    console.log('[AIChat] In-memory state has been reset to initial values.');

  } catch (error) {
    console.error('[AIChat] Failed to clear all chat data:', error);
    message.error('清空对话记录失败，请刷新页面后重试。');
  }
};


export function deleteMessage(msgId: string) {
  derivedState.activeSession.messages = derivedState.activeSession.messages.filter(m => m.id !== msgId);
}

export function branchMessage(index: number) {
  const messages = derivedState.activeSession.messages.slice(0, index + 1);
  createPureNewSession(messages[0].content);
  AIChatStore.sessions[0].messages = messages;
}
