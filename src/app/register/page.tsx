import Image from "next/image";
import { RegisterForm } from "./register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-112px)] flex items-center justify-center p-4">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <h1 className="text-4xl font-headline font-bold mb-4">
            Join the Pride. <br /> Reconnect & Thrive.
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Become an official member of the Sinhgad Alumni Association. Unlock exclusive benefits, network with professionals, and stay updated with your alma mater.
          </p>
          <Image
            src="https://placehold.co/800x600.png"
            alt="Alumni networking"
            width={800}
            height={600}
            className="rounded-lg shadow-lg"
            data-ai-hint="graduates celebrating"
          />
        </div>
        <div>
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Alumni Registration</CardTitle>
              <CardDescription>
                It only takes a minute to join our community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
