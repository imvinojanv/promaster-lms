"use client"

import qs from "query-string";
import { IconType } from "react-icons";
import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
    label: string;
    icon?: IconType;
    value?: string
}

const CategoryItem = ({
    label,
    icon: Icon,         // remap the 'icon'
    value
}: CategoryItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // getting url search params
    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        // query-string used to capture the URL to track and provide additional information to a web server when making requests
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,      // Like toggle - when click, select and unselect the category
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
                isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
            )}
            type="button"
        >
            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
    )
}

export default CategoryItem