"use client"

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { isTeacher } from '@/lib/teacher';
import { Button } from "@/components/ui/button";
import SearchInput from "./search-input";

const NavbarRoutes = () => {
    const { userId } = useAuth();         // fetch the userId in a client component
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isPlayerPage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";

  return (
    <>
        {isSearchPage && (
            <div className="hidden md:block">
                <SearchInput />
            </div>
        )}
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isPlayerPage ? (
                <Link href='/'>
                    <Button size='sm' variant='ghost'>
                        <LogOut className="h-4 w-4 mr-2" />
                        Exit
                    </Button>
                </Link>
            ) : isTeacher(userId) ? (       // pass the condition to protect the button using `isTeacher`
                <Link href='/teacher/courses'>
                    <Button size='sm' variant='ghost'>
                        Teacher mode
                    </Button>
                </Link>
            ) : null}
            
            <UserButton 
                afterSignOutUrl="/"
            />
        </div>
    </>
  )
}

export default NavbarRoutes