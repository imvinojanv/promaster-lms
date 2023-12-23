"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { priceFormat } from "@/lib/format";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

const CourseEnrollButton = ({
    price,
    courseId,
}: CourseEnrollButtonProps) => {
    return (
        <Button
            size="sm"
            className="w-full md:w-auto"
        >
            Enroll for {priceFormat(price)}
        </Button>
    )
}

export default CourseEnrollButton