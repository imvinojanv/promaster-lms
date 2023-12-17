import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {        // getCourses function should be returned as array like this
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
};

export const getCourses = async ({
    userId,
    title,
    categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,        // It's only going to works, if properly wrote the prisma schema
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
                purchases: {
                    where: {
                        userId,         // fetch only the logged in users
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {

                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null,         // its gonna hide from the card if it is not purchased
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);    // fetch the progress through get-progress.ts

                return {
                    ...course,
                    progress: progressPercentage,       // If its purchased, returned with progress status
                };
            })
        );

        return coursesWithProgress;         // Finally return the array

    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];      // If something gonna wrong, we are not gonna load any  
    }
}