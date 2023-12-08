import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
);

export async function DELETE(
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
                userId: userId,
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
        
        for (const chapter of course.chapters) {        // delete Mux data
            if (chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId);
            }
        }
        
        // The DB Mux data gonna get deleted bcz we put on lead cascade inside of the relation in Prisma

        const deletedCourse = await db.course.delete({          // delete the course
            where: {
                id: params.courseId,
            },
        });

        return NextResponse.json(deletedCourse);

    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId          // userId: userId
            },
            data: {
                ...values,      // Spread values
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}