// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Question Types
export interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: User;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  answers?: Answer[];
  views?: number;
  hasAcceptedAnswer?: boolean;
}

// Answer Types
export interface Answer {
  _id: string;
  content: string;
  questionId: string;
  author: User;
  userTagged?: string[];
  replies?: Answer[];
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
}

// Vote Types
export interface Vote {
  _id: string;
  targetType: 'question' | 'answer' | 'reply';
  targetId: string;
  voteType: 'up' | 'down';
  user: User;
  createdAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  recipient: string;
  type: 'answer' | 'reply';
  question: string;
  answer?: string;
  fromUser: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Auth Types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
  statusCode: number;
}

// Question Types
export interface CreateQuestionRequest {
  title: string;
  description: string;
  tags: string[];
}

export interface QuestionResponse {
  message: string;
  question: Question;
}

// Answer Types
export interface CreateAnswerRequest {
  questionId: string;
  content: string;
  userTagged?: string[];
}

export interface ReplyRequest {
  answerId: string;
  content: string;
  userTagged?: string[];
}

export interface AnswerResponse {
  message: string;
  answer: Answer;
}

// Vote Types
export interface VoteRequest {
  targetType: 'question' | 'answer' | 'reply';
  targetId: string;
  voteType: 'up' | 'down';
}

export interface VoteResponse {
  message: string;
  vote: Vote;
}

// WebSocket Types
export interface WebSocketRegister {
  type: 'register';
  username: string;
}

export interface WebSocketNotification {
  type: 'notification';
  notification: Notification;
}

// Error Response Type
export interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
}
