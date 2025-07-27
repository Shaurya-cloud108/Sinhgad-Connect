

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";

const editGroupSchema = z.object({
  name: z.string().min(5, "Group name must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  links: z.array(z.object({
    label: z.string().min(1, "Label is required."),
    url: z.string().url("Please enter a valid URL."),
  })).optional(),
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
      links: group.links || [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  useEffect(() => {
    form.reset({
        name: group.name,
        description: group.description,
        links: group.links || [],
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
                <Separator />
                <div>
                  <FormLabel>Useful Links</FormLabel>
                  <div className="space-y-4 mt-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-md relative space-y-2">
                        <FormField control={form.control} name={`links.${index}.label`} render={({ field }) => (<FormItem><FormLabel>Label</FormLabel><FormControl><Input placeholder="e.g. Department Website" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`links.${index}.url`} render={({ field }) => (<FormItem><FormLabel>URL</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ label: '', url: '' })}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Link
                    </Button>
                  </div>
                </div>
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

