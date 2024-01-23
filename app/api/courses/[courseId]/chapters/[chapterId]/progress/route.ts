import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { isCompleted } = await req.json();       // get from req

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // upsert: it's either gonna create it for the first time or it's going to update it
        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {     // the combination of userId and chapterId
                    userId,
                    chapterId: params.chapterId,
                }
            },
            update: {           // update
                isCompleted
            },
            create: {           // If we gonna creating for first time
                userId,
                chapterId: params.chapterId,
                isCompleted,
            }
        })

        return NextResponse.json(userProgress);

    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}