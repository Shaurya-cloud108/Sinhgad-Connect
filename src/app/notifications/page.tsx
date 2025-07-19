import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, MessageSquare, CalendarCheck, Briefcase } from "lucide-react";

const notifications = [
  {
    type: "connection",
    icon: <UserPlus className="h-6 w-6 text-primary" />,
    text: (
      <p>
        <b>Rohan Verma</b> sent you a connection request.
      </p>
    ),
    time: "2 hours ago",
    actions: [
      <Button key="accept" size="sm">Accept</Button>,
      <Button key="ignore" size="sm" variant="outline">Ignore</Button>,
    ],
    avatar: "https://placehold.co/100x100.png",
    aiHint: "professional man"
  },
  {
    type: "message",
    icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
    text: (
      <p>
        <b>Priya Sharma</b> sent you a new message.
      </p>
    ),
    time: "5 hours ago",
    actions: [<Button key="reply" size="sm" variant="outline">Reply</Button>],
    avatar: "https://placehold.co/100x100.png",
    aiHint: "professional woman"
  },
  {
    type: "event",
    icon: <CalendarCheck className="h-6 w-6 text-green-500" />,
    text: (
      <p>
        Reminder: <b>Annual Alumni Grand Meet 2024</b> is tomorrow.
      </p>
    ),
    time: "1 day ago",
    actions: [<Button key="details" size="sm" variant="outline">View Event</Button>],
    avatar: "https://placehold.co/100x100.png",
    aiHint: "university logo"
  },
  {
    type: "job",
    icon: <Briefcase className="h-6 w-6 text-purple-500" />,
    text: (
      <p>
        A new job matching your profile was posted: <b>Senior Frontend Engineer</b> at Innovate Inc.
      </p>
    ),
    time: "2 days ago",
    actions: [<Button key="view" size="sm" variant="outline">View Job</Button>],
    avatar: "https://placehold.co/100x100.png",
    aiHint: "briefcase icon"
  },
];

export default function NotificationsPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Notifications</h1>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors">
                 <Avatar className="h-10 w-10 mt-1">
                  <AvatarImage src={notification.avatar} data-ai-hint={notification.aiHint} />
                  <AvatarFallback>{notification.icon}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="text-sm">{notification.text}</div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                   <div className="flex items-center gap-2 mt-3">
                    {notification.actions}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
