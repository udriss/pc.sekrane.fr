"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { 
  Menu as MenuIcon,
  School as SchoolIcon 
} from "@mui/icons-material";
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarMenu,
  NavbarMenuItem,
  NavbarItem, 
  NavbarMenuToggle } from "@nextui-org/react";

export function MainNav() {
  const pathname = usePathname();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { href: "/", name: "Accueil" },
    { href: "/courses", name: "Lycée" },
    { href: "/but/optique", name: "BUT" },
  ];

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full 
            bg-white/20 backdrop-blur-lg shadow-lg
            hover:bg-white/30 transition-all duration-300
            ring-4 ring-white/10 ring-offset-0"
        >
          <MenuIcon
            sx={{ 
              fontSize: 42,
              transition: 'transform 0.3s',
              transform: isSideMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
            }}
          />
        </button>

        {/* Side Menu */}
        <div
          className={`fixed inset-y-0 right-0 w-64 
            bg-white/10 backdrop-blur-xl
            border border-white/10
            shadow-[_8px_32px_0_rgba(0,0,0,0.37)]
            transform transition-transform duration-300 ease-in-out z-40
            ${isSideMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="mt-20 p-6 space-y-4">
            <div className="space-y-4 mt-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 text-center rounded-lg transition-colors duration-200 ${
                    pathname === item.href
                      ? "bg-black/90 text-gray-100 font-bold text-2xl hover:backdrop-blur-xl"
                      : "text-gray-500 font-bold text-2xl hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isSideMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setIsSideMenuOpen(false)}
          />
        )}
      </>
    );
  }

  // Navigation for larger screens
  return (
    <Navbar 
      isBordered 
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      // ajouter "fixed" pour le rendre toujours visible
      className={`bg-gray-100/40 backdrop-blur-md shadow-sm top-0 z-50 transition-transform 
        duration-150 ease-in-out ${isScrolled ? "-translate-y-full" : "translate-y-0"}`}
      style={{ 
        backdropFilter: "blur(20px)", 
        WebkitBackdropFilter: "blur(10px)", 
        width: "800px", 
        margin: "0 auto", 
        borderRadius: "0 0 1rem 1rem", 
        height: "4rem", 
        padding: "1rem 1rem 0rem 1rem"
      }}
    >
      <div className="max-w-[800px] mx-auto w-full flex flex-row justify-between items-center">
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarContent>

        <NavbarBrand className="flex items-center justify-center max-w-[100px]">
          <Link href="/" color="foreground">
            <SchoolIcon sx={{ width: 48, height: 48, mx: 'auto', color: 'primary.main' }} />
          </Link>
        </NavbarBrand>
        
        <NavbarContent 
          className="hidden sm:flex gap-4" 
          justify="center"
        >
          {menuItems.map((item) => (
            <NavbarItem 
              key={item.href} 
              isActive={pathname === item.href}
            >
              <Link 
                href={item.href}
                color={pathname === item.href ? "secondary" : "foreground"}
                className={`px-4 py-1 rounded-full transition-all duration-300 ease-in-out ${
                  pathname === item.href
                      ? 'text-gray-100 font-bold text-lg bg-black hover:backdrop-blur-xl'
                      : 'text-gray-500 font-bold text-lg hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent className="flex max-w-[100px] w-[100px] justify-center">
          <NavbarItem>
            <Button 
              asChild
              color="secondary" 
              variant='ghost'
              className="font-semibold hover:bg-gradient-to-r hover:from-gray-100/80 hover:by-secondary-600/80 hover:to-gray-100/80 hover:shadow-sm"
            >
              <Link href="/admin">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Link>
            </Button>
          </NavbarItem>
        </NavbarContent>
      </div>
      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              href={item.href}
              color={pathname === item.href ? "secondary" : "foreground"}
              className={`w-full ${pathname === item.href ? "font-semibold" : ""}`}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}