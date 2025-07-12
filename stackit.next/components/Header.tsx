"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Search, Bell, Menu, User, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import NotificationDropdown from "./NotificationDropdown";
import AuthModal from "./AuthModal";
import { useRouter } from "next/navigation";
import AskQuestionModal from "./AskQuestionModal";
import ProfileModal from "./ProfileModal";

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleAskQuestion = () => {
    console.log("Ask Question clicked, isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      setAskModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-white">
              StackIt
            </Link>

            {/* Desktop search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </form>
            {/* Mobile search icon */}
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setShowMobileSearch(true)}
            >
              <Search className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white hidden md:inline-flex"
                  onClick={handleAskQuestion}
                >
                  Ask Question
                </Button>
                <NotificationDropdown>
                  <Button variant="ghost" className="relative p-2">
                    <Bell className="w-5 h-5 text-gray-300" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </NotificationDropdown>
                <Button
                  variant="ghost"
                  className="hidden sm:flex items-center space-x-2 p-2"
                  onClick={() => setProfileModalOpen(true)}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-300" />
                  )}
                  <span className="hidden lg:block text-gray-300">
                    {user?.username}
                  </span>
                </Button>
                <ProfileModal
                  open={profileModalOpen}
                  onClose={() => setProfileModalOpen(false)}
                  user={user}
                  onLogout={logout}
                />
              </>
            ) : (
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            )}
            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-300" />
            </Button>
          </div>
        </div>

        {/* Mobile search overlay */}
        {showMobileSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-start justify-center pt-24">
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setShowMobileSearch(false);
              }}
              className="w-full max-w-md mx-auto px-4"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowMobileSearch(false)}
                >
                  ✕
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4 space-y-4">
            {/* Mobile filters */}
            <div className="flex flex-wrap gap-2">
              {["Newest", "Unanswered", "Popular", "Hot", "Week", "Month"].map(
                (filter) => (
                  <Button
                    key={filter}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {filter}
                  </Button>
                )
              )}
            </div>
            {/* Mobile user menu */}
            {isAuthenticated && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-300" />
                  )}
                  <span className="text-gray-300">{user?.username}</span>
                </div>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating plus button for mobile Ask Question */}
      {isAuthenticated && (
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 md:hidden bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center"
          onClick={handleAskQuestion}
          aria-label="Ask Question"
        >
          <Plus className="w-7 h-7" />
        </button>
      )}

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AskQuestionModal
        open={askModalOpen}
        onClose={() => setAskModalOpen(false)}
      />
    </header>
  );
};

export default Header;
