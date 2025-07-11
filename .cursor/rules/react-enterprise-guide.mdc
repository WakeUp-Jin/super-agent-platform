---
description: 在编写React相关的代码中使用，这是一套现代化的企业级React代码规范，融合了**函数式编程**、**性能优化**和**可维护性**的最佳实践。
alwaysApply: false
---

# React 代码风格指南 (Modern Enterprise Style)

## 📋 概述

这是一套现代化的企业级React代码规范，融合了**函数式编程**、**性能优化**和**可维护性**的最佳实践。

## 🏗️ 核心设计原则

### 1. SOLID

- 单一职责：组件/函数只做一件事；复杂 UI 拆分子组件。
- 开闭原则：通过 props 组合、HoC、自定义 hook 扩展而非修改。
- 依赖倒置：业务逻辑通过接口 & 回调解耦；组件不直接依赖服务实现。

### 2. 函数式范式

- 纯函数优先：使用 useMemo / useCallback 保持引用稳定。
- 避免副作用：副作用集中到使用专用 hook；尽量通过 props 传状态。
- 不可变数据：state 更新遵循不可变原则；禁止直接修改数组/对象。

### 3. 单一职责原则 (Single Responsibility Principle)

- 每个组件只负责一个功能
- 每个函数只做一件事
- 每个常量对象只管理一类数据

### 4. 性能优先 (Performance First)

- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存函数引用
- 明确依赖数组，避免不必要的重渲染

### 5. 可维护性 (Maintainability)

- 常量外置，集中管理
- 类型定义清晰，接口明确
- 代码结构层次分明
- 模块化：小而专一的组件和函数

## 📁 文件结构规范

### 组件文件结构顺序

```typescript
'use client';
import React, { useCallback, useMemo } from 'react';
// 其他导入...

// 1. 常量定义
const STYLES = {
  // 样式常量
} as const;

const CONFIG = {
  // 配置常量
} as const;

// 2. 类型定义
interface ComponentProps {
  // 主组件props
}

interface SubComponentProps {
  // 子组件props
}

// 3. 子组件定义
const SubComponent: React.FC<SubComponentProps> = ({ ... }) => (
  // 子组件实现
);

// 4. 主组件定义
export const MainComponent: React.FC<ComponentProps> = ({ ... }) => {
  // 主组件实现
};
```

## 🎯 常量定义规范

### 1. 常量命名

```typescript
// ✅ 正确：大写下划线命名，按功能分组
const CONTAINER_STYLES = {
  base: 'flex items-center',
  pending: 'bg-yellow-100',
  approved: 'bg-green-100',
} as const;

const BUTTON_STYLES = {
  primary: 'bg-blue-500 hover:bg-blue-600',
  secondary: 'bg-gray-500 hover:bg-gray-600',
} as const;

// ❌ 错误：混合不同类型的常量
const MIXED_CONSTANTS = {
  containerClass: 'flex items-center',
  buttonText: '确认',
  maxRetries: 3,
} as const;
```

### 2. 使用 `as const` 断言

```typescript
// ✅ 正确：提供类型推断和自动完成
const STATUS_LABELS = {
  pending: '待处理',
  approved: '已批准',
  rejected: '已拒绝',
} as const;

// ❌ 错误：缺少类型约束
const STATUS_LABELS = {
  pending: '待处理',
  approved: '已批准',
  rejected: '已拒绝',
};
```

## 🔧 类型定义规范

### 1. 接口命名

```typescript
// ✅ 正确：清晰的命名，Props后缀
interface UserCardProps {
  user: User;
  onEdit?: (userId: string) => void;
}

interface PlayButtonProps {
  value: AudioValue;
  className?: string;
  onClick: () => void;
}

// ❌ 错误：模糊的命名
interface Props {
  data: any;
  callback: Function;
}
```

### 2. 可选属性标记

```typescript
// ✅ 正确：明确标记可选属性
interface ComponentProps {
  title: string; // 必需
  description?: string; // 可选
  onSubmit?: (data: FormData) => void; // 可选回调
}
```

## 🎨 子组件提取规范

### 1. 简单UI组件

```typescript
// ✅ 正确：提取可复用的UI组件
const PlayButton: React.FC<PlayButtonProps> = ({ value, className, onClick }) => (
  <Button
    variant="ghost"
    size="icon"
    className={className}
    onClick={onClick}
    title={`播放: ${value.name}`}
  >
    <Play className="h-4 w-4" />
  </Button>
);

// ❌ 错误：内联复杂的JSX
return (
  <div>
    <Button variant="ghost" size="icon" className="..." onClick={...}>
      <Play className="h-4 w-4" />
    </Button>
  </div>
);
```

### 2. 条件渲染组件

```typescript
// ✅ 正确：提取条件渲染逻辑
const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick }) => (
  <Button
    variant="ghost"
    size="sm"
    className={type === 'approve' ? BUTTON_STYLES.approve : BUTTON_STYLES.reject}
    onClick={onClick}
  >
    {type === 'approve' ? (
      <>
        <Check className="mr-1 h-3 w-3" />
        同意
      </>
    ) : (
      <>
        <X className="mr-1 h-3 w-3" />
        拒绝
      </>
    )}
  </Button>
);
```

## ⚡ 性能优化规范

### 1. useMemo 使用场景

```typescript
// ✅ 正确：缓存计算结果
const currentValue = useMemo((): ValueType => {
  if (status === 'normal') {
    return originalValue;
  }
  return selectedValue === 'update' ? updateValue : originalValue;
}, [status, selectedValue, originalValue, updateValue]);

// ❌ 错误：缓存简单值
const userName = useMemo(() => user.name, [user.name]); // 不必要
```

### 2. useCallback 使用场景

```typescript
// ✅ 正确：缓存事件处理函数
const handleSubmit = useCallback((data: FormData) => {
  onSubmit?.(data);
}, [onSubmit]);

// ✅ 正确：缓存复杂渲染函数
const renderButtons = useCallback(() => {
  switch (status) {
    case 'pending':
      return <PendingButtons />;
    case 'approved':
      return <ApprovedButtons />;
    default:
      return null;
  }
}, [status]);

// ❌ 错误：缓存简单函数
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]); // 应该使用函数式更新
```

### 3. 依赖数组规范

```typescript
// ✅ 正确：明确列出所有依赖
const handlePlay = useCallback(
  (value: AudioValue) => {
    if (value.url) {
      playAudio(value.url, {
        title: value.name,
        type: 'voice',
        itemIndex: index,
      });
    }
  },
  [playAudio, index] // 明确依赖
);

// ❌ 错误：遗漏依赖
const handlePlay = useCallback(
  (value: AudioValue) => {
    playAudio(value.url, { title: value.name, itemIndex: index });
  },
  [playAudio] // 遗漏了 index
);
```

## 🔀 条件渲染规范

### 1. Switch 语句优于 if-else 链

```typescript
// ✅ 正确：使用 switch 语句
const renderContent = useCallback(() => {
  switch (status) {
    case 'pending':
      return <PendingContent />;
    case 'approved':
      return <ApprovedContent />;
    case 'rejected':
      return <RejectedContent />;
    default:
      return null;
  }
}, [status]);

// ❌ 错误：冗长的 if-else 链
const renderContent = useCallback(() => {
  if (status === 'pending') {
    return <PendingContent />;
  } else if (status === 'approved') {
    return <ApprovedContent />;
  } else if (status === 'rejected') {
    return <RejectedContent />;
  } else {
    return null;
  }
}, [status]);
```

### 2. 早期返回模式

```typescript
// ✅ 正确：早期返回
const renderActions = useCallback(() => {
  if (status !== 'pending') return null;

  return (
    <div className="flex gap-2">
      <ActionButton type="approve" onClick={handleApprove} />
      <ActionButton type="reject" onClick={handleReject} />
    </div>
  );
}, [status, handleApprove, handleReject]);

// ❌ 错误：嵌套条件
const renderActions = useCallback(() => {
  return (
    <div>
      {status === 'pending' && (
        <div className="flex gap-2">
          <ActionButton type="approve" onClick={handleApprove} />
          <ActionButton type="reject" onClick={handleReject} />
        </div>
      )}
    </div>
  );
}, [status, handleApprove, handleReject]);
```

## 🎭 组件定义规范

### 1. React.FC 类型定义

```typescript
// ✅ 正确：使用 React.FC 类型
export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  // 组件实现
};

// ❌ 错误：使用 function 声明
export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  // 组件实现
}
```

### 2. 解构赋值参数

```typescript
// ✅ 正确：参数解构
export const TextItem: React.FC<TextItemProps> = ({
  textItem,
  index,
  parentStatus,
  onApprove,
  onReject,
}) => {
  // 组件实现
};

// ❌ 错误：使用 props 对象
export const TextItem: React.FC<TextItemProps> = (props) => {
  const { textItem, index } = props;
  // 组件实现
};
```

## 📝 命名规范

### 1. 组件命名

```typescript
// ✅ 正确：PascalCase，描述性命名
const UserProfileCard: React.FC<Props> = ({ ... }) => { ... };
const PlayButton: React.FC<Props> = ({ ... }) => { ... };
const ActionButton: React.FC<Props> = ({ ... }) => { ... };

// ❌ 错误：模糊或不一致的命名
const Component1: React.FC<Props> = ({ ... }) => { ... };
const btn: React.FC<Props> = ({ ... }) => { ... };
```

### 2. 函数命名

```typescript
// ✅ 正确：动词开头，描述性命名
const handleSubmit = useCallback(() => { ... }, []);
const handleUserEdit = useCallback(() => { ... }, []);
const renderPlayButtons = useCallback(() => { ... }, []);

// ❌ 错误：模糊的命名
const onClick = useCallback(() => { ... }, []);
const render = useCallback(() => { ... }, []);
```

### 3. 常量命名

```typescript
// ✅ 正确：大写下划线，按功能分组
const BUTTON_STYLES = { ... };
const API_ENDPOINTS = { ... };
const ERROR_MESSAGES = { ... };

// ❌ 错误：不一致的命名
const buttonStyles = { ... };
const API_endpoints = { ... };
const errorMsg = { ... };
```

## 🔍 代码审查清单

### 性能检查

- [ ] 是否正确使用了 `useMemo` 和 `useCallback`？
- [ ] 依赖数组是否完整且正确？
- [ ] 是否避免了不必要的重渲染？

### 可维护性检查

- [ ] 常量是否外置且按功能分组？
- [ ] 类型定义是否清晰且完整？
- [ ] 组件是否遵循单一职责原则？

### 代码质量检查

- [ ] 是否使用了早期返回模式？
- [ ] 条件渲染是否使用了 switch 语句？
- [ ] 命名是否清晰且一致？

## 📚 最佳实践示例

### 完整组件示例

```typescript
'use client';
import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Edit } from 'lucide-react';

// 常量定义
const CONTAINER_STYLES = {
  base: 'flex items-center gap-4 p-4 rounded-lg',
  pending: 'bg-yellow-50 border-l-4 border-yellow-400',
  approved: 'bg-green-50 border-l-4 border-green-400',
} as const;

const BUTTON_STYLES = {
  play: 'text-blue-500 hover:bg-blue-50',
  edit: 'text-gray-500 hover:bg-gray-50',
} as const;

// 类型定义
interface MediaItemProps {
  item: MediaItem;
  index: number;
  onPlay?: (item: MediaItem) => void;
  onEdit?: (item: MediaItem) => void;
}

interface ActionButtonProps {
  type: 'play' | 'edit';
  onClick: () => void;
}

// 子组件
const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick }) => (
  <Button
    variant="ghost"
    size="icon"
    className={type === 'play' ? BUTTON_STYLES.play : BUTTON_STYLES.edit}
    onClick={onClick}
  >
    {type === 'play' ? <Play className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
  </Button>
);

// 主组件
export const MediaItem: React.FC<MediaItemProps> = ({
  item,
  index,
  onPlay,
  onEdit,
}) => {
  // 计算样式
  const containerStyle = useMemo(() => {
    const baseStyle = CONTAINER_STYLES.base;
    const statusStyle = item.status === 'pending'
      ? CONTAINER_STYLES.pending
      : CONTAINER_STYLES.approved;
    return `${baseStyle} ${statusStyle}`;
  }, [item.status]);

  // 事件处理
  const handlePlay = useCallback(() => {
    onPlay?.(item);
  }, [onPlay, item]);

  const handleEdit = useCallback(() => {
    onEdit?.(item);
  }, [onEdit, item]);

  // 渲染函数
  const renderActions = useCallback(() => {
    return (
      <div className="flex items-center gap-2">
        <ActionButton type="play" onClick={handlePlay} />
        <ActionButton type="edit" onClick={handleEdit} />
      </div>
    );
  }, [handlePlay, handleEdit]);

  return (
    <div className={containerStyle}>
      <div className="flex-1">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
      </div>
      {renderActions()}
    </div>
  );
};
```

---

## 📋 总结

这套代码规范的核心特点：

1. **现代化**：使用最新的React Hooks和TypeScript特性
2. **性能优化**：通过memoization减少不必要的重渲染
3. **可维护性**：清晰的结构和命名，易于理解和修改
4. **可扩展性**：模块化设计，易于添加新功能
5. **团队协作**：统一的代码风格，降低沟通成本

遵循这套规范，可以编写出高质量、高性能、易维护的React代码。
