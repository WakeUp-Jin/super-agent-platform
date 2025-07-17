import { useState, useCallback } from 'react';
import { sendMessageStreamReadable } from './stream';
import { SendMessageRequest, StreamEventData, AgentEventData } from './interface/chatInterface';
import { useViewBoardStore, useViewBoardTwoStore } from './store/useViewBoardStore';
import { getView } from './api/view';
import { useButtonStore } from './store/useButtonStore';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  agentStates?: Map<string, AgentEventData>; // 存储当前消息相关的所有 agent 状态
}

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 添加用户消息
  const addUserMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    return userMessage.id;
  }, []);

  // 添加助手消息
  const addAssistantMessage = useCallback((content: string = '') => {
    const assistantMessage: Message = {
      id: Date.now().toString() + '_assistant',
      role: 'assistant',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    return assistantMessage.id;
  }, []);

  // 更新助手消息内容
  const updateAssistantMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg)));
  }, []);

  // 更新助手消息的 Agent 状态
  const updateAssistantAgentStates = useCallback(
    (messageId: string, agentStates: Map<string, AgentEventData>) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, agentStates: new Map(agentStates) } : msg
        )
      );
    },
    []
  );

  // 处理错误的统一函数
  const handleError = useCallback(
    (error: Error, messageId: string) => {
      console.error('流传输错误:', error);
      setError(error.message);
      setLoading(false);
      updateAssistantMessage(messageId, `抱歉，发生了错误: ${error.message}`);
    },
    [updateAssistantMessage]
  );

  // 处理自定义事件
  const handleCustomEvent = useCallback(
    (
      data: StreamEventData,
      agentStates: Map<string, AgentEventData>,
      messageId: string,
      request: SendMessageRequest
    ) => {
      const eventData = data.data as AgentEventData;

      if (!eventData?.agentId) return null;

      // 更新 agent 状态
      agentStates.set(eventData.agentId, eventData);
      updateAssistantAgentStates(messageId, agentStates);

      //处理编辑节点
      if (eventData.agentId.includes('editAgentNode') && eventData.shouldQueryRedis === '2') {
        const { setBoard } = useViewBoardStore.getState();
        const { setBoardTwo } = useViewBoardTwoStore.getState();
        const {
          setTextOneButtonDisabled,
          isTextOneButtonDisabled,
          setAudioOneButtonDisabled,
          isAudioOneButtonDisabled,
        } = useButtonStore.getState();

        const { userId, sessionId, messageId } = request.inputParam || {};

        // 直接使用 async/await，无需包装函数
        getView({
          sessionId: sessionId || '456-debug3-800',
          userId: userId || '123',
          viewType: eventData.viewType || 'oneText',
        })
          .then((data) => {
            console.log('编辑节点更新画本数据:', data);

            if (eventData.viewType === 'oneText') {
              setTextOneButtonDisabled(false);
              console.log('textOneButtonDisabled', isTextOneButtonDisabled);
              setBoard(data);
            } else if (eventData.viewType === 'twoAudio') {
              setAudioOneButtonDisabled(false);
              console.log('audioOneButtonDisabled', isAudioOneButtonDisabled);
              console.log('data', data);
              setBoardTwo(data);
            }
          })
          .catch((error) => {
            console.error('获取画本数据失败:', error);
          });
      }

      // 处理聊天节点的完成状态
      if (
        data.name === 'chatNode' &&
        eventData.status === 'completed' &&
        eventData.chatAgentContent
      ) {
        return eventData.chatAgentContent.text;
      }

      return null;
    },
    [updateAssistantAgentStates]
  );

  // 处理流数据的主函数
  const handleStreamData = useCallback(
    (
      data: StreamEventData,
      agentStates: Map<string, AgentEventData>,
      messageId: string,
      request: SendMessageRequest
    ) => {
      console.log('收到流数据:', data);

      switch (data.event) {
        case 'on_custom_event':
          return handleCustomEvent(data, agentStates, messageId, request);

        case 'stream_end':
          console.log('流传输结束:', data.data?.message);
          return null;

        default:
          return null;
      }
    },
    [handleCustomEvent]
  );

  // 发送消息
  const sendMessage = useCallback(
    async (content: string, inputParam?: any) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      // 添加用户消息
      addUserMessage(content);

      // 创建空的助手消息用于流式更新
      const assistantMessageId = addAssistantMessage();
      const agentStates = new Map<string, AgentEventData>();

      const request: SendMessageRequest = {
        userInput: content,
        inputParam,
      };

      try {
        await sendMessageStreamReadable(
          request,
          // 流数据处理器
          (data: StreamEventData) => {
            const assistantContent = handleStreamData(
              data,
              agentStates,
              assistantMessageId,
              request
            );
            if (assistantContent) {
              updateAssistantMessage(assistantMessageId, assistantContent);
            }
          },
          // 完成回调
          () => {
            console.log('流传输完成');
            setLoading(false);
          },
          // 错误回调
          (error: Error) => handleError(error, assistantMessageId)
        );
      } catch (error) {
        console.error('发送消息失败:', error);
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        setError(errorMessage);
        setLoading(false);
        updateAssistantMessage(assistantMessageId, '抱歉，发送消息失败，请重试。');
      }
    },
    [
      loading,
      addUserMessage,
      addAssistantMessage,
      updateAssistantMessage,
      handleStreamData,
      handleError,
    ]
  );

  // 清空对话
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}
