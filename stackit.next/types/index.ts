export interface User {
  id: string;
  username: string;
  email: string;
  role: 'guest' | 'user' | 'admin';
  avatar?: string;
  reputation: number;
  joinedAt: Date;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorId: string;
  author: User;
  createdAt: Date;
  votes: number;
  answers: Answer[];
  acceptedAnswerId?: string;
}

export interface Answer {
  id: string;
  content: string;
  authorId: string;
  author: User;
  questionId: string;
  createdAt: Date;
  votes: number;
  isAccepted: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'answer' | 'comment' | 'mention';
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedId: string; // question or answer ID
}

export interface Vote {
  id: string;
  userId: string;
  targetId: string; // question or answer ID
  targetType: 'question' | 'answer';
  type: 'up' | 'down';
}