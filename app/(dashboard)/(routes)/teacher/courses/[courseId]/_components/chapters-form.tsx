"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";          // changed

interface ChaptersFormProps {
    initialData: Course & { chapters:Chapter[] };              // Extended schema - changed
    courseId: string;
};

const formSchema = z.object({
    // Our form schema inside of this form will just be used to create a chapter using a title, but then we're gonna have to add a video and a description to the chapter in a separate view, which will enable us to publish that chapter until those fields are not filled
    title: z.string().min(1),           // changed
});

const ChaptersForm = ({
    initialData,
    courseId
}: ChaptersFormProps) => {

    const [isCreating, setIsCreating] = useState(false);            // changed
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => {                          // changed
        setIsCreating((current) => !current);
    }

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // We are using this form to create a new chapter, not editing the chapter, editing will be in separately, So we don't need any initial values
            title: "",                  // changed
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);          // changed
            toast.success("Chapter created");
            toggleCreating();
            router.refresh();   // refresh the server component and fetch the new data from the db
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course chapters                                              {/* changed */}
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (                                // changed
                        <div className="text-red-600">
                            Cancel
                        </div>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>

            {/* changed */}
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"          // changed
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        {/* changed */}
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No chapters"}
                    {/* TODO: Add a list of chapters */}
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    )
}

export default ChaptersForm