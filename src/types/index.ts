// ===== User Types =====
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isVerified: boolean;
  university?: string;
  createdAt: Date;
  lastActive?: Date;
}

// ===== Authentication Types =====
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  university?: string;
}

// ===== Chat/Messaging Types =====
export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  chatId: string;
  timestamp: Date;
  messageType: 'text' | 'image' | 'file';
  attachments?: MessageAttachment[];
  isRead: boolean;
  isEdited?: boolean;
  editedAt?: Date;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
  size: number;
}

export interface Chat {
  id: string;
  title: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatEngineCredentials {
  projectId: string;
  username: string;
  secret: string;
}

// ===== Marketplace Types =====
export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  seller: User;
  category: ItemCategory;
  condition: ItemCondition;
  isAvailable: boolean;
  location?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemCategory {
  id: string;
  name: string;
  icon?: string;
}

export type ItemCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ItemCondition[];
  location?: string;
  tags?: string[];
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ===== Component Props Types =====
export interface MessagesProps {
  userId?: string;
  initialChatId?: string;
}

export interface ChatWindowProps {
  chatId: string;
  currentUser: User;
  onMessageSent?: (message: Message) => void;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

// ===== Hook Types =====
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export interface UseChatReturn {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, attachments?: File[]) => Promise<void>;
  loadChats: () => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
}

// ===== Event Types =====
export interface MessageEvent {
  type: 'message_sent' | 'message_received' | 'message_read' | 'user_typing';
  data: {
    chatId: string;
    userId?: string;
    message?: Message;
    timestamp: Date;
  };
}

// ===== Error Types =====
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}
    