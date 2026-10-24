"use client"

import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import Image from 'next/image';
import { themes } from '@/constants';

const Theme = () => {
  const { mode, setMode } = useTheme();

  return (
    <Menubar className="relative border-none bg-transparent shadow-none p-0">
      <MenubarMenu>
        <MenubarTrigger className="flex size-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:bg-neutral-100 dark:focus:bg-neutral-900 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-neutral-900 border-none outline-none">
          {mode === 'light' ? (
            <Image 
              src="/assets/icons/sun.svg" 
              alt="sun" 
              width={18} 
              height={18} 
              className="active-theme" 
            />
          ) : (
            <Image 
              src="/assets/icons/moon.svg" 
              alt="moon"
              width={18} 
              height={18} 
              className="active-theme" 
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute -right-2 mt-2 min-w-[130px] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-1.5 shadow-xl">
          {themes.map((item) => (
            // @ts-ignore
            <MenubarItem
              key={item.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
                mode === item.value ? 'text-sky-500' : 'text-neutral-700 dark:text-neutral-300'
              }`}
              onClick={() => {
                setMode(item.value);
                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("theme");
                }
              }}
            >
              <Image 
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${mode === item.value && 'active-theme'}`}
              />
              <span>{item.label}</span>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default Theme
