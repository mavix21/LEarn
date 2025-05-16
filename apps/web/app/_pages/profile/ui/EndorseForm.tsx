"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
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
import { abi } from "@/app/_shared/lib/abi";
import { CERTIFICATION_CONTRACT_ADDRESS } from "@/app/_shared/lib/constants";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment must be less than 500 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EndorseForm({
  tokenId,
  certificationId,
}: {
  tokenId: bigint;
  certificationId: Id<"certifications">;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const endorse = useMutation(api.certifications.endorse);
  const { isPending, writeContract } = useWriteContract({
    mutation: {
      onSuccess: async (data) => {
        try {
          await endorse({
            comment: form.getValues("comment"),
            id: certificationId,
            transactionHash: data,
          });
        } catch (error) {
          console.error(error);
          if (error instanceof ConvexError) {
            toast.error(error.data.message);
          }
        }
      },
    },
  });
  const onSubmit = async (data: FormValues) => {
    try {
      writeContract({
        address: CERTIFICATION_CONTRACT_ADDRESS,
        abi,
        functionName: "endorseCertificate",
        args: [tokenId, data.comment],
      });
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message);
      }
    }
  };

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
        <Button type="submit" disabled={isPending}>
          {isPending ? "Endorsing..." : "Submit Endorsement"}
        </Button>
      </form>
    </Form>
  );
}
