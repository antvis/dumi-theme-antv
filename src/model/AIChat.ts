import { proxy, subscribe, snapshot } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import localforage from 'localforage';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { AIChatState, ChatSession } from '../types';
import {history} from "dumi";

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
  codeBlock: null
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
}

// --- 初始化逻辑 ---
export const initializeStore = async () => {
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
  const newSessionId = crypto.randomUUID();
  AIChatStore.sessions.unshift({
    id: newSessionId,
    title: title ?? 'New Conversation',
    createdAt: Date.now(),
    messages: [],
  });
  AIChatStore.activeSessionId = newSessionId;
}

export const createNewSession = (config: { promptText: string, mode?: "implement" | "solve", lib?: string, jump?: boolean }) => {
  // todo  埋点
  // 1. 创建一个新的会话
  createPureNewSession();

  // 2. 创建临时消息并存入 store
  AIChatStore.tempMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: config.promptText,
    createdAt: Date.now(),
    mode: config.mode,
    lib: config.lib,
  };
  if (config.jump) {
    history.push(`/zh/ai-playground/2`);
  }
}
