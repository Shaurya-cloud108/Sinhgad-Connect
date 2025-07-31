
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, MessageSquare, CalendarCheck, Briefcase, Heart, MessageCircle } from "lucide-react";
import type { Notification } from "@/lib/data.tsx";
import { communityMembers } from "@/lib/data-seed";
import Link from "next/link";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import { Skeleton } from "@/components/ui/skeleton";


const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
    switch (type) {
        case 'connection':
            return <UserPlus className="h-6 w-6 text-primary" />;
        case 'message':
            return <MessageSquare className="h-6 w-6 text-blue-500" />;
        case 'event':
            return <CalendarCheck className="h-6 w-6 text-green-500" />;
        case 'job':
            return <Briefcase className="h-6 w-6 text-purple-500" />;
        case 'like':
            return <Heart className="h-6 w-6 text-red-500" />;
        case 'comment':
            return <MessageCircle className="h-6 w-6 text-sky-500" />;
        default:
            return null;
    }
}

const renderNotificationText = (notification: Notification) => {
    const member = communityMembers.find(m => m.name === notification.userName);
    const userLink = member ? (
        <Link href={`/profile/${member.handle}`} className="font-bold hover:underline">{notification.userName}</Link>
    ) : (
        <b className="font-bold">{notification.userName}</b>
    );

    switch (notification.type) {
        case 'like':
            return <p>{userLink} liked your post.</p>;
        case 'comment':
            return <p>{userLink} commented: "{notification.commentText}"</p>;
        case 'connection':
            return <p>{userLink} sent you a connection request.</p>;
        case 'message':
            return <p>{userLink} sent you a new message.</p>;
        case 'event':
            return <p>Reminder: <b>{notification.eventTitle}</b> is tomorrow.</p>;
        case 'job':
            return <p>A new job matching your profile was posted: <b>{notification.jobTitle}</b> at {notification.companyName}.</p>;
        default:
            return <p>{notification.rawText}</p>;
    }
}

export default function NotificationsPage() {
    const { notifications } = useContext(AppContext);

    if (!notifications) {
        return (
            <div className="container max-w-2xl mx-auto py-8 md:py-12">
                <Skeleton className="h-10 w-64 mb-8" />
                <Card>
                    <CardContent className="p-0">
                        <div className="space-y-2 p-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="container max-w-2xl mx-auto py-8 md:py-12">
      <h1 className="text-3xl font-headline font-bold mb-8">Notifications</h1>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
              <div key={notification.id} className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors">
                 <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
                  <AvatarImage src={notification.avatar} data-ai-hint={notification.aiHint} />
                  <AvatarFallback><NotificationIcon type={notification.type} /></AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="text-sm">
                    {renderNotificationText(notification)}
                    {notification.contentPreview && (
                        <p className="pl-3 mt-1 text-xs border-l-2 text-muted-foreground italic">
                            "{notification.contentPreview}"
                        </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                   <div className="flex items-center gap-2 mt-3">
                    {notification.actions?.map((action, i) => (
                        <Link href={action.href} key={i}>
                            <Button size="sm" variant={i === 0 ? "default" : "outline"}>{action.label}</Button>
                        </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))
            ) : (
                <p className="p-8 text-center text-muted-foreground">You have no new notifications.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
