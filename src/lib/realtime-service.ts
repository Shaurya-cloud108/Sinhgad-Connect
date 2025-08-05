import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  off,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
  equalTo,
} from 'firebase/database';
import { rtdb } from './firebase';

// Real-time Chat System
export const chatService = {
  // Send a message
  async sendMessage(conversationId: string, message: {
    senderId: string;
    senderName: string;
    senderAvatar: string;
    text: string;
    type?: 'text' | 'image' | 'file';
    fileUrl?: string;
  }) {
    const messagesRef = ref(rtdb, `conversations/${conversationId}/messages`);
    const newMessageRef = push(messagesRef);
    
    await set(newMessageRef, {
      ...message,
      timestamp: serverTimestamp(),
      id: newMessageRef.key,
    });

    // Update conversation metadata
    const conversationRef = ref(rtdb, `conversations/${conversationId}`);
    await update(conversationRef, {
      lastMessage: message.text,
      lastMessageTimestamp: serverTimestamp(),
      lastMessageSender: message.senderId,
    });

    return newMessageRef.key;
  },

  // Subscribe to messages in a conversation
  subscribeToMessages(conversationId: string, callback: (messages: any[]) => void) {
    const messagesRef = ref(rtdb, `conversations/${conversationId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(100));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messages: any[] = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      callback(messages);
    });

    return () => off(messagesRef, 'value', unsubscribe);
  },

  // Create or get conversation
  async createConversation(participants: string[], type: 'direct' | 'group' = 'direct') {
    const conversationsRef = ref(rtdb, 'conversations');
    const newConversationRef = push(conversationsRef);
    
    await set(newConversationRef, {
      id: newConversationRef.key,
      participants,
      type,
      createdAt: serverTimestamp(),
      lastMessage: '',
      lastMessageTimestamp: serverTimestamp(),
    });

    return newConversationRef.key;
  },

  // Subscribe to user's conversations
  subscribeToConversations(userId: string, callback: (conversations: any[]) => void) {
    const conversationsRef = ref(rtdb, 'conversations');
    
    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const conversations: any[] = [];
      snapshot.forEach((childSnapshot) => {
        const conversation = childSnapshot.val();
        if (conversation.participants && conversation.participants.includes(userId)) {
          conversations.push({
            id: childSnapshot.key,
            ...conversation,
          });
        }
      });
      
      // Sort by last message timestamp
      conversations.sort((a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0));
      callback(conversations);
    });

    return () => off(conversationsRef, 'value', unsubscribe);
  },
};

// Real-time Notifications
export const realtimeNotificationService = {
  // Send a real-time notification
  async sendNotification(userId: string, notification: {
    type: 'like' | 'comment' | 'follow' | 'message' | 'event' | 'job';
    title: string;
    message: string;
    actionUrl?: string;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
  }) {
    const notificationsRef = ref(rtdb, `notifications/${userId}`);
    const newNotificationRef = push(notificationsRef);
    
    await set(newNotificationRef, {
      ...notification,
      id: newNotificationRef.key,
      timestamp: serverTimestamp(),
      read: false,
    });

    return newNotificationRef.key;
  },

  // Subscribe to user notifications
  subscribeToNotifications(userId: string, callback: (notifications: any[]) => void) {
    const notificationsRef = ref(rtdb, `notifications/${userId}`);
    const notificationsQuery = query(notificationsRef, orderByChild('timestamp'), limitToLast(50));

    const unsubscribe = onValue(notificationsQuery, (snapshot) => {
      const notifications: any[] = [];
      snapshot.forEach((childSnapshot) => {
        notifications.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      
      // Sort by timestamp (newest first)
      notifications.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(notifications);
    });

    return () => off(notificationsRef, 'value', unsubscribe);
  },

  // Mark notification as read
  async markAsRead(userId: string, notificationId: string) {
    const notificationRef = ref(rtdb, `notifications/${userId}/${notificationId}`);
    await update(notificationRef, { read: true });
  },

  // Clear all notifications
  async clearNotifications(userId: string) {
    const notificationsRef = ref(rtdb, `notifications/${userId}`);
    await remove(notificationsRef);
  },
};

// Online Presence System
export const presenceService = {
  // Set user online status
  async setUserOnline(userId: string, userInfo: {
    name: string;
    avatar: string;
    lastSeen?: number;
  }) {
    const userStatusRef = ref(rtdb, `presence/${userId}`);
    await set(userStatusRef, {
      ...userInfo,
      online: true,
      lastSeen: serverTimestamp(),
    });

    // Set up offline detection
    const userStatusOfflineRef = ref(rtdb, `presence/${userId}`);
    const isOfflineForDatabase = {
      ...userInfo,
      online: false,
      lastSeen: serverTimestamp(),
    };

    // Use onDisconnect to set offline status when user disconnects
    await set(userStatusRef, {
      ...userInfo,
      online: true,
      lastSeen: serverTimestamp(),
    });
  },

  // Set user offline
  async setUserOffline(userId: string) {
    const userStatusRef = ref(rtdb, `presence/${userId}`);
    await update(userStatusRef, {
      online: false,
      lastSeen: serverTimestamp(),
    });
  },

  // Subscribe to online users
  subscribeToOnlineUsers(callback: (users: any[]) => void) {
    const presenceRef = ref(rtdb, 'presence');
    
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const users: any[] = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.online) {
          users.push({
            id: childSnapshot.key,
            ...user,
          });
        }
      });
      callback(users);
    });

    return () => off(presenceRef, 'value', unsubscribe);
  },

  // Get user online status
  subscribeToUserStatus(userId: string, callback: (status: any) => void) {
    const userStatusRef = ref(rtdb, `presence/${userId}`);
    
    const unsubscribe = onValue(userStatusRef, (snapshot) => {
      callback(snapshot.val());
    });

    return () => off(userStatusRef, 'value', unsubscribe);
  },
};

// Live Feed Updates (for likes, comments in real-time)
export const liveFeedService = {
  // Update post engagement in real-time
  async updatePostEngagement(postId: string, engagement: {
    likes?: number;
    comments?: number;
    shares?: number;
  }) {
    const postEngagementRef = ref(rtdb, `postEngagement/${postId}`);
    await update(postEngagementRef, {
      ...engagement,
      lastUpdated: serverTimestamp(),
    });
  },

  // Subscribe to post engagement updates
  subscribeToPostEngagement(postId: string, callback: (engagement: any) => void) {
    const postEngagementRef = ref(rtdb, `postEngagement/${postId}`);
    
    const unsubscribe = onValue(postEngagementRef, (snapshot) => {
      callback(snapshot.val() || { likes: 0, comments: 0, shares: 0 });
    });

    return () => off(postEngagementRef, 'value', unsubscribe);
  },

  // Live story views
  async updateStoryViews(storyId: string, viewerId: string, viewerInfo: {
    name: string;
    avatar: string;
  }) {
    const storyViewsRef = ref(rtdb, `storyViews/${storyId}/${viewerId}`);
    await set(storyViewsRef, {
      ...viewerInfo,
      timestamp: serverTimestamp(),
    });
  },

  // Subscribe to story views
  subscribeToStoryViews(storyId: string, callback: (viewers: any[]) => void) {
    const storyViewsRef = ref(rtdb, `storyViews/${storyId}`);
    
    const unsubscribe = onValue(storyViewsRef, (snapshot) => {
      const viewers: any[] = [];
      snapshot.forEach((childSnapshot) => {
        viewers.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      callback(viewers);
    });

    return () => off(storyViewsRef, 'value', unsubscribe);
  },
};

// Typing Indicators
export const typingService = {
  // Set typing status
  async setTyping(conversationId: string, userId: string, isTyping: boolean, userInfo?: {
    name: string;
    avatar: string;
  }) {
    const typingRef = ref(rtdb, `typing/${conversationId}/${userId}`);
    
    if (isTyping && userInfo) {
      await set(typingRef, {
        ...userInfo,
        timestamp: serverTimestamp(),
      });
    } else {
      await remove(typingRef);
    }
  },

  // Subscribe to typing indicators
  subscribeToTyping(conversationId: string, callback: (typingUsers: any[]) => void) {
    const typingRef = ref(rtdb, `typing/${conversationId}`);
    
    const unsubscribe = onValue(typingRef, (snapshot) => {
      const typingUsers: any[] = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        // Only show users who started typing in the last 3 seconds
        if (Date.now() - (user.timestamp || 0) < 3000) {
          typingUsers.push({
            id: childSnapshot.key,
            ...user,
          });
        }
      });
      callback(typingUsers);
    });

    return () => off(typingRef, 'value', unsubscribe);
  },
};