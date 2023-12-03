"use client"

import * as z from "zod";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };          // Extended schema - changed
    courseId: string;
};

const formSchema = z.object({
    url: z.string().min(1),             // changed
});

const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);          // changed

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);           // changed
            toast.success("Course updated");
            toggleEdit();
            router.refresh();   // refresh the server component and fetch the new data from the db
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (id: string) => {                // changed
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted!");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <div className="text-red-600">
                            Cancel
                        </div>
                    )}
                    {/* changed */}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>

            {/* changed */}
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">            {/* line-clamp-1: for short the line and show dots if its longer */}
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div className="ml-auto">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            onClick={() => onDelete(attachment.id)}
                                            className="ml-auto hover:opacity-75 transition"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* changed */}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"             // changed
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete the course.
                    </div>
                </div>
            )}
        </div>
    )
}

export default AttachmentForm