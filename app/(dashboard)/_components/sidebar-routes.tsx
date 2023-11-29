"use client"

import { STUDENT_ROUTES } from "@/constants"
import SidebarItem from "./sidebar-item";

const SidebarRoutes = () => {
    const ROUTES = STUDENT_ROUTES;

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