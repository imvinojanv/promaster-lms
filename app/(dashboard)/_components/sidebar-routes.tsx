"use client"

import { usePathname } from "next/navigation";

import { STUDENT_ROUTES, TEACHER_ROUTES } from "@/constants"
import SidebarItem from "./sidebar-item";

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const ROUTES = isTeacherPage ? TEACHER_ROUTES : STUDENT_ROUTES;

  return (
    <div className="flex flex-col w-full">
        {ROUTES.map((route) => (
            <SidebarItem
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
            />
        ))}
    </div>
  )
}

export default SidebarRoutes