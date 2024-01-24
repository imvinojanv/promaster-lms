"use client"

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";                  // changed - part 2
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";              // changed
import Image from "next/image";
import Video from 'next-video';

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };            // changed
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1),                // changed
});

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId,                             // changed
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);        // changed
            toast.success("Chapter updated");
            toggleEdit();
            router.refresh();   // refresh the server component and fetch the new data from the db
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <div className="text-red-600">
                            Cancel
                        </div>
                    )}
                    {!isEditing && !initialData.videoUrl && (           // changed
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (            // changed
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            {/* changed */}
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <VideoIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2 rounded-md">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
                // <div className="relative aspect-video mt-2 rounded-md">
                //     {/* Uploadthing-(2GB), Cloudinary-(25GB), Imagekit.io-(20GB), Filebase-(5GB) */}
                //     <Video src='https://utfs.io/f/81db0c85-f5e2-474c-9120-960cb9affe70-i2ci5i.mp4' />
                // </div>
            )}

            {/* changed */}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"             // changed
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter&apos;s video
                    </div>
                </div>
            )}

            {/* Added Newly */}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div>
    )
}

export default ChapterVideoForm
