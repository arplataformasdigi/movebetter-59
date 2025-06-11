import React from "react";
import { Link } from "react-router-dom";
export function Logo() {
  return <Link to="/" className="flex items-center space-x-2">
      
      <span className="font-bold text-xl text-gray-900">FisioSmartCare</span>
    </Link>;
}