"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Iconify from "~/app/_components/iconify";
import { Constants } from "~/app/constants";
import SearchInput from "../common/search-input";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import Image from "next/image";

import lyratechnologies_logo from "public/lyratechnologies_logo.jpeg";
import { signIn } from "next-auth/react";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, params]);

  return (
    <div className="relative z-50">
      <Navbar
        maxWidth="xl"
        className="fixed top-0 z-50 h-20 border-b bg-white px-4"
      >
        <NavbarContent className="w-full" justify="center">
          <NavbarBrand as="li" className="max-w-fit gap-3">
            <Link
              className="flex items-center justify-start gap-1"
              href={Constants.Routes.nettrom.index}
            ></Link>
          </NavbarBrand>
          <NavbarItem className="hidden flex-1 justify-center px-4 lg:flex">
            <SearchInput />
          </NavbarItem>
          <NavbarItem className="hidden sm:flex">
            {/* <AuthDropdownNew /> */}
          </NavbarItem>
          <NavbarItem className="sm:hidden">
            {/* <Button
              isIconOnly
              variant="light"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              <Iconify icon={isMenuOpen ? "fa:times" : "fa:bars"} />
            </Button> */}
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b bg-white shadow-lg sm:hidden">
          <div className="container mx-auto space-y-4 px-4 py-4">
            <SearchInput />
            <div className="flex justify-end">
              {/* <AuthDropdownNew mobile /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
