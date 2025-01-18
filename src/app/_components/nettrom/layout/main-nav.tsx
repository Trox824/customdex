"use client";

import Link from "next/link";
import {
  AiOutlineHome,
  AiOutlineFire,
  AiFillStar,
  AiOutlineClockCircle,
  AiFillHeart,
} from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { Constants } from "~/app/constants";
import { useState } from "react";

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const menuItems = [
    {
      text: "Trang chủ",
      icon: <AiOutlineHome />,
      href: Constants.Routes.nettrom.index,
    },
    {
      text: "Theo dõi",
      icon: <AiFillHeart />,
      href: Constants.Routes.nettrom.following,
    },
    {
      text: "Hot",
      icon: <AiOutlineFire />,
      href: `${Constants.Routes.nettrom.search}?order[followedCount]=desc#results`,
    },
    {
      text: "Yêu thích",
      icon: <AiFillStar />,
      href: `${Constants.Routes.nettrom.search}?order[rating]=desc#results`,
    },
    {
      text: "Mới cập nhật",
      icon: <AiOutlineClockCircle />,
      href: `${Constants.Routes.nettrom.search}?order[createdAt]=desc#results`,
    },
  ];

  return (
    <div className="group fixed bottom-8 left-8 z-50 flex flex-col-reverse gap-4">
      {/* Main floating button */}
      <div
        className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-4xl text-white shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-110 hover:bg-gray-800"
        onClick={toggleMenu}
      >
        <BiMenu />
      </div>

      {/* Menu items expanding upward */}
      <div className="flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`group relative flex h-20 w-20 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            } transform items-center justify-center rounded-full bg-gray-900 text-white shadow-md backdrop-blur-sm transition-all duration-300 ease-out`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className="text-4xl">{item.icon}</span>
            <span
              className="absolute left-full ml-4 -translate-x-2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {item.text}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
