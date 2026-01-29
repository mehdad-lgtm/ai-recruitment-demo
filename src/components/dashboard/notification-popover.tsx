"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Calendar,
  Check,
  CheckCheck,
  Clock,
  MessageSquare,
  Sparkles,
  Users
} from "lucide-react";
import * as React from "react";

interface Notification {
  id: string;
  type: string;
  status: string;
  title: string;
  message: string;
  channel: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  metadata: Record<string, unknown> | null;
  sentAt: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

const notificationIcons: Record<string, React.ElementType> = {
  interview_scheduled: Calendar,
  interview_reminder: Clock,
  candidate_update: Users,
  message: MessageSquare,
  system: Sparkles,
};

const notificationColors: Record<string, string> = {
  interview_scheduled: "text-blue-500 bg-blue-500/10",
  interview_reminder: "text-orange-500 bg-orange-500/10",
  candidate_update: "text-green-500 bg-green-500/10",
  message: "text-purple-500 bg-purple-500/10",
  system: "text-primary bg-primary/10",
};

export function NotificationPopover() {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/notifications/${notificationId}/mark-read`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to mark all as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-96 p-0 overflow-hidden"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="default" className="h-5 px-1.5">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="p-3 rounded-full bg-muted/50 mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No notifications
              </p>
              <p className="text-xs text-muted-foreground text-center">
                You&apos;re all caught up! We&apos;ll notify you when something new happens.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              <AnimatePresence mode="popLayout">
                {notifications.map((notification, index) => {
                  const Icon =
                    notificationIcons[notification.type] || Sparkles;
                  const colorClass =
                    notificationColors[notification.type] ||
                    "text-primary bg-primary/10";
                  const isUnread = !notification.readAt;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "group relative p-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer",
                        isUnread && "bg-primary/5"
                      )}
                      onClick={() => {
                        if (isUnread) {
                          handleMarkAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 p-2 rounded-lg transition-transform group-hover:scale-110",
                            colorClass
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">
                              {notification.title}
                            </p>
                            {isUnread && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isUnread && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-border/50 bg-muted/30">
            <Button
              variant="ghost"
              className="w-full h-8 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
