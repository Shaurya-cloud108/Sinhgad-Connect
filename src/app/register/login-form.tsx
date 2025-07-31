
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ProfileContext } from "@/context/ProfileContext";
import { AppContext } from "@/context/AppContext";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address to send a reset link."),
});

function ForgotPasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
        try {
            await sendPasswordResetEmail(auth, values.email);
            toast({
                title: "Password Reset Link Sent",
                description: `If an account exists for ${values.email}, a reset link has been sent.`,
            });
            onOpenChange(false);
            form.reset();
        } catch (error: any) {
            console.error("Password reset error:", error);
            toast({
                variant: "destructive",
                title: "Error Sending Reset Email",
                description: "There was a problem sending the reset email. Please check the address and try again.",
            });
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Forgot Your Password?</DialogTitle>
                    <DialogDescription>
                        No problem. Enter your email address below and we'll send you a link to reset it.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Send Reset Link</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { setLoggedInUserHandle } = useContext(ProfileContext);
  const { communityMembers } = useContext(AppContext);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = communityMembers.find(m => m.contact.email === values.email);

        if (user) {
            setLoggedInUserHandle(user.handle);
            toast({
                title: "Login Successful!",
                description: `Welcome back, ${user.name.split(' ')[0]}!`,
            });
            router.push(`/profile/${user.handle}`);
        } else {
            // This case might happen if user exists in Firebase Auth but not in our mock DB
            // In a real app, user profile would be fetched from a database
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Could not find a matching profile for this user.",
            });
        }
    } catch (error: any) {
        console.error("Login Error:", error.code);
        let description = "An unknown error occurred. Please try again.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            description = "Invalid email or password. Please check your credentials and try again.";
        }
        toast({
            variant: "destructive",
            title: "Login Failed",
            description,
        });
    }
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="priya.sharma@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-xs"
                    onClick={() => setIsForgotPassOpen(true)}
                >
                    Forgot Password?
                </Button>
              </div>
              <div className="relative">
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full !mt-6">
          Login
        </Button>
      </form>
    </Form>
    <ForgotPasswordDialog open={isForgotPassOpen} onOpenChange={setIsForgotPassOpen} />
    </>
  );
}
