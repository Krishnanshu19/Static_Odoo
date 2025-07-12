import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/apis";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onClose,
  user,
  onLogout,
}) => {
  if (!user) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="text-lg font-semibold">{user.username}</div>
          <div className="text-gray-400 text-sm">{user.email}</div>
          <div className="text-gray-400 text-sm">{user.name}</div>
        </div>
        <Button
          className="w-full bg-red-600 hover:bg-red-700 mt-4"
          onClick={onLogout}
        >
          Logout
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
