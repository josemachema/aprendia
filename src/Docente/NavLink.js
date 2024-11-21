import React from "react";
import { Link } from "react-router-dom";

const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default NavLink;
