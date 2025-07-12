import { useEffect, useCallback } from 'react'
import {
  useRegisterMutation,
  useLoginMutation,
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useCreateQuestionMutation,
  useCreateAnswerMutation,
  useReplyToAnswerMutation,
  useVoteMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '../redux/rtk-query/Query'
import { websocketService } from '../lib/websocket'
import type { Notification } from '../types/apis'

// Custom hook for authentication
export const useAuth = () => {
  const [register, registerState] = useRegisterMutation()
  const [login, loginState] = useLoginMutation()

  const handleRegister = useCallback(async (credentials: {
    username: string
    email: string
    password: string
    name: string
  }) => {
    try {
      const result = await register(credentials).unwrap()
      if (result.success && result.data.token) {
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))
      }
      return result
    } catch (error) {
      throw error
    }
  }, [register])

  const handleLogin = useCallback(
    async (emailOrUsername: string, password: string) => {
      try {
        let loginPayload: any = { password };
        if (emailOrUsername.includes("@")) {
          loginPayload.email = emailOrUsername;
        } else {
          loginPayload.username = emailOrUsername;
        }
        const result = await login(loginPayload).unwrap();
        if (result.success && result.data.token) {
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
        }
        return result;
      } catch (error) {
        throw error;
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    websocketService.disconnect()
  }, [])

  return {
    register: handleRegister,
    login: handleLogin,
    logout,
    registerState,
    loginState,
  }
}

// Custom hook for questions
export const useQuestions = (filter?: string) => {
  const { data: questions, isLoading, error, refetch } = useGetQuestionsQuery(filter ? { filter } : undefined);
  const [createQuestion, createState] = useCreateQuestionMutation();

  const handleCreateQuestion = useCallback(async (questionData: {
    title: string
    description: string
    tags: string[]
  }) => {
    try {
      const result = await createQuestion(questionData).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [createQuestion]);

  return {
    questions,
    isLoading,
    error,
    refetch,
    createQuestion: handleCreateQuestion,
    createState,
  };
}

// Custom hook for a single question
export const useQuestion = (questionId: string) => {
  const { data: questionDetails, isLoading, error } = useGetQuestionQuery(questionId)
  const [createAnswer, createAnswerState] = useCreateAnswerMutation()
  const [vote, voteState] = useVoteMutation()

  // Map backend answer.user to author for frontend compatibility
  const mappedAnswers = (questionDetails?.answers || []).map((answer: any) => ({
    ...answer,
    author: answer.user || answer.author, // prefer user, fallback to author
    replies: answer.replies?.map((reply: any) => ({
      ...reply,
      author: reply.user || reply.author,
    })) || [],
  }))

  const handleCreateAnswer = useCallback(async (answerData: {
    content: string
    userTagged?: string[]
  }) => {
    try {
      const result = await createAnswer({
        questionId,
        ...answerData,
      }).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }, [createAnswer, questionId])

  const handleVote = useCallback(async (voteData: {
    targetType: 'question' | 'answer' | 'reply'
    targetId: string
    voteType: 'up' | 'down'
  }) => {
    try {
      const result = await vote(voteData).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }, [vote])

  return {
    question: questionDetails?.question,
    answers: mappedAnswers,
    isLoading,
    error,
    createAnswer: handleCreateAnswer,
    vote: handleVote,
    createAnswerState,
    voteState,
  }
}

// Custom hook for answers and replies
export const useAnswers = () => {
  const [replyToAnswer, replyState] = useReplyToAnswerMutation()

  const handleReply = useCallback(async (replyData: {
    answerId: string
    content: string
    userTagged?: string[]
  }) => {
    try {
      const result = await replyToAnswer(replyData).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }, [replyToAnswer])

  return {
    replyToAnswer: handleReply,
    replyState,
  }
}

// Custom hook for notifications with WebSocket integration
export const useNotifications = () => {
  const { data: notifications, isLoading, error, refetch } = useGetNotificationsQuery()
  const [markAsRead, markAsReadState] = useMarkNotificationAsReadMutation()

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      const result = await markAsRead(notificationId).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }, [markAsRead])

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      websocketService.connect(userData.username, (notification: Notification) => {
        // Refetch notifications when a new one arrives
        refetch()
      })
    }

    return () => {
      websocketService.disconnect()
    }
  }, [refetch])

  return {
    notifications,
    isLoading,
    error,
    refetch,
    markAsRead: handleMarkAsRead,
    markAsReadState,
  }
}

// Custom hook for user profile
export const useUserProfile = (username?: string) => {
  const { data: profile, isLoading, error } = useGetUserProfileQuery(username || '', {
    skip: !username,
  })
  const [updateProfile, updateState] = useUpdateUserProfileMutation()

  const handleUpdateProfile = useCallback(async (updates: Partial<{
    name: string
    email: string
  }>) => {
    try {
      const result = await updateProfile(updates).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }, [updateProfile])

  return {
    profile,
    isLoading,
    error,
    updateProfile: handleUpdateProfile,
    updateState,
  }
}

// Utility hook to get current user
export const useCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
} 