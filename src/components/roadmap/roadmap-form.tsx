"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormDescription, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Your goal should be at least 10 characters long.",
  }).max(500, {
    message: "Prompt cannot exceed 500 characters."
  }),
});

interface RoadmapFormProps {
  onGenerate: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

// const isRoadmap = true;

export function RoadmapForm({ onGenerate, isLoading }: RoadmapFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await onGenerate(values.prompt);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          {/* <Wand2 className="text-primary"/> */}
          Describe Your Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Learn to build a full-stack web application with Next.js and Firebase'"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be as specific as you can for the best results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate Roadmap"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
