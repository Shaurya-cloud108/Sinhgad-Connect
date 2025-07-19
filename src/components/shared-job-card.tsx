
"use client";

import { jobListings } from "@/lib/data.tsx";
import { Card, CardContent } from "./ui/card";
import { Briefcase, MapPin } from "lucide-react";
import Link from "next/link";

type SharedJobCardProps = {
  jobId: number;
};

export function SharedJobCard({ jobId }: SharedJobCardProps) {
  const job = jobListings.find((item) => item.id === jobId);

  if (!job) {
    return (
      <Card className="my-2 bg-background/50">
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground italic">
            This job listing is no longer available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/jobs`} className="block my-2">
        <Card className="bg-background/50 border shadow-none hover:shadow-md transition-shadow">
            <CardContent className="p-3 space-y-1">
                <p className="font-semibold text-sm line-clamp-1">{job.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Briefcase className="h-3 w-3" />{job.company}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" />{job.location}</p>
            </CardContent>
        </Card>
    </Link>
  );
}
