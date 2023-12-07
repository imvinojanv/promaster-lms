"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";            // changed
import { cn } from "@/lib/utils";
import Preview from "@/components/preview";

interface ChapterAccessFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    isFree: z.boolean().default(false),             // changed
});

const ChapterAccessForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterAccessFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // We are gonna turn that into a definite boolean, Just in case it's undefined or somthing, you can add like this
            // isFree: Boolean(initialData.isFree)    OR 👇
            isFree: !!initialData.isFree      // Output: TRUE or FALSE                              // changed
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
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
                Chapter access
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <div className="text-red-600">
                            Cancel
                        </div>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            {/* changed */}
            {!isEditing && (
                <div className="text-sm mt-2">
                    {initialData.isFree ? (
                        <div className="flex flex-row items-center space-x-2 space-y-0">
                            <Checkbox
                                checked={true}
                            />
                            <p className="space-y-1 leading-none">
                                This chapter is for <span className="font-semibold">FREE</span> 💸
                            </p>
                        </div>
                    ) : (
                        <p className="text-slate-500">
                            This chapter is not FREE.
                        </p>
                    )}
                </div>
            )}

            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="isFree"                       // changed
                            render={({ field }) => (

                                // Changed
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white/50">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-0.5"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Check this box if you want to make this chapter for <span className="font-semibold">FREE</span> 💸
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default ChapterAccessForm