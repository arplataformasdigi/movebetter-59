
import React from "react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-movebetter-primary to-movebetter-secondary flex items-center justify-center">
        <span className="text-white font-bold text-sm">MB</span>
      </div>
      <span className="font-bold text-xl text-gray-900">MoveBetter</span>
    </Link>
  );
}
