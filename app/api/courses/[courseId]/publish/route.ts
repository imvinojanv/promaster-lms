import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        // Check the published chapters in this course
        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);
        // At least one chapter needs to be published, So we are using 'some()'. If we need all chapter to be published, we will use 'every()'

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
            return new NextResponse("Missing required fields", { status: 401 });
        }

        const publishedCourse = await db.course.update({            // Publish the course
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedCourse);

    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}