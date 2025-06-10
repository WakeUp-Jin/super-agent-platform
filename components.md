ChatContainer // 顶层容器，管理整体聊天流程
├── useChatStream Hook // 状态管理和API调用
├── ChatMessages // 消息列表渲染
└── ChatMessageItem // 单条消息路由
├── UserMessageItem // 用户消息显示
└── AssistantMessage // AI消息显示
├── AgentStatesDisplay // Agent状态列表管理
│ └── AgentStatusItem // 单个Agent状态显示
└── Markdown内容显示
