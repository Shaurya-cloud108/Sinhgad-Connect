
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, CreditCard, University, Heart, CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

const donationSchema = z.object({
  amount: z.string().min(1, "Please select or enter an amount."),
  customAmount: z.string().optional(),
  fund: z.string().min(1, "Please select a fund to support."),
  isRecurring: z.boolean().default(false),
  donorName: z.string().min(2, "Please enter your full name."),
  donorEmail: z.string().email("Please enter a valid email address."),
  paymentMethod: z.enum(["card", "upi"], { required_error: "Please select a payment method." }),
});

type DonationFormValues = z.infer<typeof donationSchema>;

export default function DonatePage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DonationFormValues | null>(null);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: "",
      fund: "",
      isRecurring: false,
      donorName: "",
      donorEmail: "",
      paymentMethod: "card",
    },
  });

  const selectedAmount = form.watch("amount");

  function onSubmit(values: DonationFormValues) {
    const finalAmount = values.amount === 'custom' ? values.customAmount : values.amount;
    const submissionData = { ...values, amount: finalAmount };
    
    console.log("Donation Submitted:", submissionData);
    setFormData(submissionData);
    setStep(2);
    
    toast({
      title: "Processing Donation...",
      description: "Thank you for your generosity! Your donation is being processed.",
    });
  }

  if (step === 2 && formData) {
    return (
      <div className="container py-8 md:py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="max-w-lg w-full text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full p-3 w-fit">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="font-headline text-3xl mt-4">Thank You, {formData.donorName}!</CardTitle>
            <CardDescription>
              Your generous contribution makes a world of difference.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold text-primary">₹{formData.amount}</p>
            <div className="text-sm text-muted-foreground bg-secondary p-4 rounded-md">
                <p>A confirmation receipt has been sent to <strong>{formData.donorEmail}</strong>.</p>
                <p className="mt-2">You supported the <strong>{
                    { 'scholarship': 'Scholarship Fund', 'infrastructure': 'Infrastructure Development', 'innovation': 'Innovation & Research Hub' }[formData.fund]
                }</strong>.</p>
            </div>
            <Button onClick={() => setStep(1)} className="mt-6">
                Make Another Donation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
         <div className="hidden lg:block">
            <h1 className="text-4xl lg:text-5xl font-headline font-bold mb-4 leading-tight">
              Give Back to Your Alma Mater
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your contribution fuels innovation, supports students, and builds a stronger Sinhgad community for generations to come.
            </p>
            <Image
              src="https://placehold.co/800x600.png"
              alt="University campus"
              width={800}
              height={600}
              className="rounded-lg shadow-lg"
              data-ai-hint="university campus"
            />
        </div>
        <div>
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Heart className="text-primary"/> Secure Donation Portal
                    </CardTitle>
                    <CardDescription>
                        Every contribution, big or small, makes a difference.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-base">Choose an Amount (INR)</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
                                    >
                                    {['500', '1000', '2500', '5000', '10000', '25000', '50000', 'custom'].map((val) => (
                                        <FormItem key={val}>
                                        <FormControl>
                                            <RadioGroupItem value={val} className="sr-only"/>
                                        </FormControl>
                                        <FormLabel className={`flex items-center justify-center p-3 rounded-md border-2 cursor-pointer font-bold transition-all ${field.value === val ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                            {val === 'custom' ? 'Custom' : `₹${val}`}
                                        </FormLabel>
                                        </FormItem>
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedAmount === 'custom' && (
                            <FormField
                                control={form.control}
                                name="customAmount"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Custom Amount</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                            <Input type="number" placeholder="Enter amount" className="pl-8" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="fund"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-base">I want to support</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a fund to contribute to" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="scholarship">Scholarship Fund</SelectItem>
                                    <SelectItem value="infrastructure">Infrastructure Development</SelectItem>
                                    <SelectItem value="innovation">Innovation & Research Hub</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isRecurring"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                     <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Make this a monthly donation
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        
                        <div className="space-y-4">
                             <FormField
                                control={form.control}
                                name="donorName"
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
                                name="donorEmail"
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
                        </div>

                         <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-base">Payment Method</FormLabel>
                                 <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-2 gap-4 pt-2"
                                    >
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="card" id="card" className="sr-only"/>
                                            </FormControl>
                                            <FormLabel htmlFor="card" className={`flex flex-col items-center justify-center p-4 rounded-md border-2 cursor-pointer font-medium transition-all ${field.value === 'card' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                                <CreditCard className="h-8 w-8 mb-2"/>
                                                Credit/Debit Card
                                            </FormLabel>
                                        </FormItem>
                                         <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="upi" id="upi" className="sr-only"/>
                                            </FormControl>
                                            <FormLabel htmlFor="upi" className={`flex flex-col items-center justify-center p-4 rounded-md border-2 cursor-pointer font-medium transition-all ${field.value === 'upi' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                                <University className="h-8 w-8 mb-2"/>
                                                Net Banking / UPI
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                 </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full text-lg py-6 !mt-8">
                            Donate Now
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
