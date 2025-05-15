"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@skill-based/ui/components/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@skill-based/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@skill-based/ui/components/form";
import { Textarea } from "@skill-based/ui/components/textarea";

import type { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment must be less than 500 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EndorseForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  function onSubmit(data: FormValues) {
    // TODO: Handle form submission
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>Endorsement Comment</DialogTitle>
          <DialogDescription>
            Write a comment about why you're endorsing this skill.
          </DialogDescription>
        </DialogHeader>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endorsement Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="I endorse this skill because..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit Endorsement</Button>
      </form>
    </Form>
  );
}
