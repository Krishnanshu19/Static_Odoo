"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Search, Bell, Menu, User, LogOut } from "lucide-react";
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

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [askModalOpen, setAskModalOpen] = useState(false);
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
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hidden sm:flex items-center space-x-2 p-2"
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
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-800 border-gray-600">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4 space-y-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </form>

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

            {/* Mobile Ask Question button */}
            {isAuthenticated && (
              <>
                <Link href="/ask" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Ask Question
                  </Button>
                </Link>

                {/* Mobile user menu */}
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
              </>
            )}
          </div>
        )}
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AskQuestionModal
        open={askModalOpen}
        onClose={() => setAskModalOpen(false)}
      />
    </header>
  );
};

export default Header;
