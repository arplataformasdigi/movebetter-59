
import React from "react";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Logo />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
