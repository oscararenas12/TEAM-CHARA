// Database types matching Supabase schema

// ===== Profile Types =====
export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  student_id: string | null;
  university: string;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_verified: boolean;
  rating: number;
  items_sold: number;
  items_listed: number;
  created_at: string;
  updated_at: string;
}

// ===== Chat Types =====
export interface Chat {
  id: string;
  title: string | null;
  is_group: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string;
  is_read: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
  created_at: string;
}

// ===== Category Types =====
export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

// ===== Item Types =====
export type ItemCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';

export interface Item {
  id: string;
  seller_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  condition: ItemCondition | null;
  is_available: boolean;
  location: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface ItemImage {
  id: string;
  item_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface ItemTag {
  id: string;
  item_id: string;
  tag: string;
  created_at: string;
}

// ===== Transaction Types =====
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface Transaction {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: TransactionStatus;
  payment_method: string | null;
  created_at: string;
  completed_at: string | null;
}

// ===== Review Types =====
export interface Review {
  id: string;
  transaction_id: string | null;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// ===== Favorite Types =====
export interface Favorite {
  id: string;
  user_id: string;
  item_id: string;
  created_at: string;
}

// ===== Joined/Extended Types for API responses =====
export interface ChatWithParticipants extends Chat {
  participants: Profile[];
}

export interface ChatWithDetails extends Chat {
  participants: Profile[];
  last_message: Message | null;
  unread_count: number;
}

export interface MessageWithSender extends Message {
  sender: Profile;
  read_receipts?: MessageReadReceipt[];
}

export interface ItemWithDetails extends Item {
  seller: Profile;
  category: Category | null;
  images: ItemImage[];
  tags: ItemTag[];
}
