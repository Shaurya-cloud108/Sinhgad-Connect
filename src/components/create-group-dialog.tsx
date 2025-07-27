
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
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const createGroupSchema = z.object({
  name: z.string().min(5, "Group name must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  type: z.enum(["public", "private"], {
    required_error: "You need to select a group type.",
  }),
  banner: z.string().optional(),
});

export type GroupFormData = z.infer<typeof createGroupSchema>;

type CreateGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupSubmit: (data: GroupFormData) => void;
};

export function CreateGroupDialog({ open, onOpenChange, onGroupSubmit }: CreateGroupDialogProps) {
  const { toast } = useToast();
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<GroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "public",
    },
  });

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBannerPreview(result);
        form.setValue("banner", result);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: GroupFormData) {
    onGroupSubmit(values);
    toast({
      title: "Group Created!",
      description: "Your new group is now active and ready for members.",
    });
    form.reset();
    setBannerPreview(null);
    if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Create a New Group</DialogTitle>
          <DialogDescription>
            Fill out the details below to start a new community.
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
                        <Input placeholder="e.g. Bay Area Alumni Chapter" {...field} />
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
                        <Textarea placeholder="What is the purpose of your group?" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Group Type</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="public" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            Public - Anyone can join and see posts.
                            </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="private" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            Private - Members must request to join.
                            </FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div>
                    <FormLabel>Group Banner (Optional)</FormLabel>
                    {bannerPreview ? (
                        <div className="mt-2 relative">
                            <Image src={bannerPreview} alt="Banner preview" className="rounded-lg w-full aspect-video object-cover" width={400} height={225} />
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => {
                                setBannerPreview(null);
                                form.setValue("banner", undefined);
                                if (bannerInputRef.current) bannerInputRef.current.value = "";
                            }}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-2 flex items-center justify-center w-full">
                            <label htmlFor="group-banner-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">Click to upload a banner</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 800x400px)</p>
                                </div>
                                <Input id="group-banner-upload" type="file" className="sr-only" accept="image/*" onChange={handleBannerUpload} ref={bannerInputRef} />
                            </label>
                        </div>
                    )}
                </div>
            </form>
            </Form>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
