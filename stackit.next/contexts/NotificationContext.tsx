"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNotifications as useNotificationsApi } from "@/hooks/useStackitApi";
import { websocketService } from "@/lib/websocket";
import type { Notification } from "@/types/apis";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => void;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    notifications,
    markAsRead: markAsReadApi,
    isLoading,
    refetch,
  } = useNotificationsApi();

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadApi(id);
      // The RTK Query cache will automatically update
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  };

  const markAllAsRead = () => {
    // This would need a backend endpoint to mark all as read
    // For now, we'll mark them individually
    notifications?.forEach((notification) => {
      if (!notification.isRead) {
        handleMarkAsRead(notification._id);
      }
    });
  };

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        websocketService.connect(
          userData.username,
          (notification: Notification) => {
            // Refetch notifications when a new one arrives
            refetch();
          }
        );
      } catch (error) {
        console.error("Error parsing user data for WebSocket:", error);
      }
    }

    return () => {
      websocketService.disconnect();
    };
  }, [refetch]);

  return (
    <NotificationContext.Provider
      value={{
        notifications: notifications || [],
        unreadCount,
        markAsRead: handleMarkAsRead,
        markAllAsRead,
        isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
