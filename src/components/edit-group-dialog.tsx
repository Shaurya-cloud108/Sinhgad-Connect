
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "./ui/scroll-area";
import type { Group } from "@/lib/data";
import { useEffect } from "react";

const editGroupSchema = z.object({
  name: z.string().min(5, "Group name must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
});

export type GroupEditFormData = z.infer<typeof editGroupSchema>;

type EditGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupUpdate: (data: GroupEditFormData) => void;
  group: Group;
};

export function EditGroupDialog({ open, onOpenChange, onGroupUpdate, group }: EditGroupDialogProps) {
  const form = useForm<GroupEditFormData>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      name: group.name,
      description: group.description,
    },
  });
  
  useEffect(() => {
    // Ensure form values are updated if the group prop changes while dialog is open
    // This is an edge case but good practice
    form.reset({
        name: group.name,
        description: group.description,
    });
  }, [group, form]);


  function onSubmit(values: GroupEditFormData) {
    onGroupUpdate(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit Group Details</DialogTitle>
          <DialogDescription>
            Make changes to your group's profile information below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Group Name</FormLabel>
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
                        <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </form>
            </Form>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
