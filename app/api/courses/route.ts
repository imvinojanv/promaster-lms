import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unautherized", { status: 401 })
        }

        // Create the course
        const course = await db.course.create({
            data: {
                // We have to pass data to all the required fields in the prisma.schema file (Ignored optional fields)
                userId,
                title,
            }
        });

        // Returing the response to frontend (Client)
        return NextResponse.json(course);

    } catch (error) {
        console.error("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}