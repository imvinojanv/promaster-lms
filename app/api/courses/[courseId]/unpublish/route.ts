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

        // Just find the individual course
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
            // We don't need to include individual chapters and their Mux data. So we simplified it
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        const unpublishedCourse = await db.course.update({            // Unpublish the course
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: false,
            }
        });

        return NextResponse.json(unpublishedCourse);

    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}