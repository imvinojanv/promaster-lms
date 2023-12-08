"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Button } from "@/components/ui/button";
import ConfirmModel from "@/components/models/confirm-model";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
};

const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course unpublished");
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course published");
                confetti.onOpen();                  // use the confetti effect 
            }

            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}`);

            toast.success("Course deleted");
            router.refresh();
            router.push(`/teacher/courses`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModel onConfirm={onDelete}>
                <Button
                    size="sm"
                    disabled={isLoading}
                    variant='destructive'
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModel>
        </div>
    )
}

export default Actions