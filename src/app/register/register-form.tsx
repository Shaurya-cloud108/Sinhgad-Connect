
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { setDoc, doc } from 'firebase/firestore';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { AppContext } from "@/context/AppContext";
import { ProfileContext } from "@/context/ProfileContext";
import { CommunityMember } from "@/lib/data";
import { db } from "@/lib/firebase";


const formSchema = z.object({
  role: z.enum(["student", "alumni"], { required_error: "Please select your role." }),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  graduationMonth: z.string().min(1, "Please select a month."),
  graduationYear: z.string().min(4, "Please select a year."),
  degree: z.string().min(1, "Please select your degree/branch."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

const degreeMap: { [key: string]: string } = {
    "comp": "Computer Engineering",
    "it": "Information Technology",
    "entc": "E & TC",
    "mech": "Mechanical Engineering",
    "civil": "Civil Engineering"
};

export function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { setCommunityMembers, addStoryForUser } = useContext(AppContext);
  const { setLoggedInUserHandle } = useContext(ProfileContext);

  const [role, setRole] = useState("student");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "student",
      fullName: "",
      email: "",
      graduationMonth: "",
      graduationYear: "",
      degree: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userHandle = values.fullName.toLowerCase().replace(/\s+/g, '-') + `-${String(values.graduationYear).slice(-2)}`;
    
    const newUser: CommunityMember = {
        name: values.fullName,
        handle: userHandle,
        avatar: `https://placehold.co/150x150.png`,
        fallback: values.fullName.split(' ').map(n => n[0]).join(''),
        graduationYear: parseInt(values.graduationYear),
        graduationMonth: parseInt(values.graduationMonth),
        field: degreeMap[values.degree] || "Engineering",
        industry: values.role === "alumni" ? "Technology" : "Student",
        company: values.role === "alumni" ? "Your Company" : "Sinhgad College of Engineering",
        location: "Pune, India",
        followers: [],
        following: [],
        aiHint: "user avatar",
        banner: "https://placehold.co/1000x300.png",
        bannerAiHint: "university campus",
        headline: values.role === "alumni" ? "Your Headline" : "Eager to learn and connect!",
        about: `A ${values.role} from the class of ${values.graduationYear}.`,
        experience: [],
        education: [
            {
                degree: `B.E. ${degreeMap[values.degree] || "Engineering"}`,
                college: "Sinhgad College of Engineering",
                yearRange: `${parseInt(values.graduationYear) - 4} - ${values.graduationYear}`,
                graduationYear: parseInt(values.graduationYear),
                graduationMonth: parseInt(values.graduationMonth)
            }
        ],
        socials: { linkedin: "", github: "" },
        contact: { email: values.email }
    };

    try {
        // Save the new user to Firestore
        await setDoc(doc(db, "communityMembers", newUser.handle), newUser);

        // Add new user to the local state for immediate UI update
        setCommunityMembers(prev => [...prev, newUser]);
        
        // Add a story placeholder for the new user
        addStoryForUser(newUser);

        // "Log in" the new user
        setLoggedInUserHandle(newUser.handle);
        
        toast({
          title: "Registration Successful!",
          description: `Welcome to the community, ${values.fullName}!`,
        });
        
        router.push(`/profile/${newUser.handle}`);

    } catch (error) {
        console.error("Error creating user:", error);
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "There was an error creating your account. Please try again.",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>I am a...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setRole(value);
                  }}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="student" />
                    </FormControl>
                    <FormLabel className="font-normal">Current Student</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="alumni" />
                    </FormControl>
                    <FormLabel className="font-normal">Alumni</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Priya Sharma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="graduationMonth"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{role === 'student' ? 'Expected Grad Month' : 'Grad Month'}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Month" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {months.map((month, index) => (
                            <SelectItem key={month} value={String(index + 1)}>
                                {month}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{role === 'student' ? 'Expected Grad Year' : 'Grad Year'}</FormLabel>
                    <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    >
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Year" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() + 5 - i).map((year) => (
                            <SelectItem key={year} value={String(year)}>
                            {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Your branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="comp">Computer Engg.</SelectItem>
                    <SelectItem value="it">Information Tech.</SelectItem>
                    <SelectItem value="entc">E & TC</SelectItem>
                    <SelectItem value="mech">Mechanical Engg.</SelectItem>
                    <SelectItem value="civil">Civil Engg.</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full !mt-6">
          Create Account
        </Button>
      </form>
    </Form>
  );
}
