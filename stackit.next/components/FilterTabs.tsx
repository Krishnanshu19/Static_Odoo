"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  className = "",
}) => {
  const filters = [
    { id: "newest", label: "Newest" },
    { id: "unanswered", label: "Unanswered" },
    { id: "popular", label: "Popular" },
  ];

  const activeFilterLabel =
    filters.find((f) => f.id === activeFilter)?.label || "Newest";

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Desktop filters */}
      <div className="hidden md:flex items-center space-x-1">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className={`${
              activeFilter === filter.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      {/* Mobile filters */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300"
            >
              {activeFilterLabel} <ChevronDown className="ml-1 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-600">
            {filters.map((filter) => (
              <DropdownMenuItem
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`cursor-pointer ${
                  activeFilter === filter.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {filter.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FilterTabs;
