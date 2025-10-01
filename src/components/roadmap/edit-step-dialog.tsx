"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { RoadmapStep } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(3, { message: "Description must be at least 3 characters." }),
});

interface EditStepDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  step: RoadmapStep;
  onSave: (newStepData: Partial<RoadmapStep>) => void;
}

export function EditStepDialog({ isOpen, setIsOpen, step, onSave }: EditStepDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: step.title, description: step.description },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ title: step.title, description: step.description });
    }
  }, [isOpen, step, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/80 animate-fade-in"
      />
      <div className="relative z-50 w-full max-w-lg bg-background border p-6 rounded-lg shadow-lg animate-zoom-in">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          <span className="sr-only">Close</span>
          ✕
        </button>

        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">Edit Step</h2>
          <p className="text-sm text-muted-foreground">
            Make changes to your roadmap step here. Click save when you're done.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
