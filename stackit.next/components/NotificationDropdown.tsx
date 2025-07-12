"use client";

import React from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, CheckCircle } from "lucide-react";

interface NotificationDropdownProps {
  children: React.ReactNode;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  children,
}) => {
  const { notifications, markAsRead, markAllAsRead, isLoading } =
    useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "answer":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "reply":
        return <MessageSquare className="w-4 h-4 text-yellow-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-gray-800 border-gray-600 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-3">
          <h3 className="font-semibold text-white">Notifications</h3>
          {notifications.some((n) => !n.isRead) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-blue-400 hover:text-blue-300"
            >
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification._id}
              className={`p-3 cursor-pointer hover:bg-gray-700 ${
                !notification.isRead ? "bg-gray-750" : ""
              }`}
              onClick={() =>
                !notification.isRead && markAsRead(notification._id)
              }
            >
              <div className="flex items-start space-x-3 w-full">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      !notification.isRead
                        ? "text-white font-medium"
                        : "text-gray-300"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
