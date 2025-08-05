import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { 
  FeedItem, 
  JobListing, 
  Event, 
  Group, 
  SuccessStory,
  CommunityMember,
  Notification 
} from './data';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  JOBS: 'jobs',
  EVENTS: 'events',
  GROUPS: 'groups',
  SUCCESS_STORIES: 'successStories',
  NOTIFICATIONS: 'notifications',
  COMMENTS: 'comments',
} as const;

// User Profile Operations
export const userService = {
  async getProfile(userId: string) {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async updateProfile(userId: string, data: Partial<CommunityMember>) {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async followUser(currentUserId: string, targetUserId: string) {
    const batch = writeBatch(db);
    
    // Add to current user's following
    const currentUserRef = doc(db, COLLECTIONS.USERS, currentUserId);
    batch.update(currentUserRef, {
      following: arrayUnion(targetUserId),
    });
    
    // Add to target user's followers
    const targetUserRef = doc(db, COLLECTIONS.USERS, targetUserId);
    batch.update(targetUserRef, {
      followers: arrayUnion(currentUserId),
    });
    
    await batch.commit();
  },

  async unfollowUser(currentUserId: string, targetUserId: string) {
    const batch = writeBatch(db);
    
    const currentUserRef = doc(db, COLLECTIONS.USERS, currentUserId);
    batch.update(currentUserRef, {
      following: arrayRemove(targetUserId),
    });
    
    const targetUserRef = doc(db, COLLECTIONS.USERS, targetUserId);
    batch.update(targetUserRef, {
      followers: arrayRemove(currentUserId),
    });
    
    await batch.commit();
  },
};

// Feed/Posts Operations
export const postService = {
  async createPost(post: Omit<FeedItem, 'id' | 'timestamp'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.POSTS), {
      ...post,
      timestamp: serverTimestamp(),
      likes: 0,
      likedBy: [],
      comments: [],
    });
    return docRef.id;
  },

  async updatePost(postId: string, data: Partial<FeedItem>) {
    const docRef = doc(db, COLLECTIONS.POSTS, postId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePost(postId: string) {
    await deleteDoc(doc(db, COLLECTIONS.POSTS, postId));
  },

  async likePost(postId: string, userId: string) {
    const docRef = doc(db, COLLECTIONS.POSTS, postId);
    await updateDoc(docRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
  },

  async unlikePost(postId: string, userId: string) {
    const docRef = doc(db, COLLECTIONS.POSTS, postId);
    await updateDoc(docRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
  },

  // Real-time feed subscription
  subscribeFeed(callback: (posts: FeedItem[]) => void, following: string[] = []) {
    const q = query(
      collection(db, COLLECTIONS.POSTS),
      where('author.handle', 'in', following.length > 0 ? following : ['dummy']),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(),
      })) as FeedItem[];
      callback(posts);
    });
  },
};

// Job Listings Operations
export const jobService = {
  async createJob(job: Omit<JobListing, 'id'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.JOBS), {
      ...job,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getJobs(filters?: { location?: string; company?: string }) {
    let q = query(
      collection(db, COLLECTIONS.JOBS),
      orderBy('createdAt', 'desc')
    );

    if (filters?.location) {
      q = query(q, where('location', '==', filters.location));
    }
    if (filters?.company) {
      q = query(q, where('company', '==', filters.company));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as JobListing[];
  },

  subscribeJobs(callback: (jobs: JobListing[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.JOBS),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as JobListing[];
      callback(jobs);
    });
  },
};

// Events Operations
export const eventService = {
  async createEvent(event: Omit<Event, 'id'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
      ...event,
      createdAt: serverTimestamp(),
      attendees: [],
    });
    return docRef.id;
  },

  async rsvpEvent(eventId: string, userId: string, status: 'going' | 'maybe' | 'not-going') {
    const docRef = doc(db, COLLECTIONS.EVENTS, eventId);
    await updateDoc(docRef, {
      [`rsvp.${userId}`]: status,
      updatedAt: serverTimestamp(),
    });
  },

  subscribeEvents(callback: (events: Event[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.EVENTS),
      orderBy('date', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      callback(events);
    });
  },
};

// Groups Operations
export const groupService = {
  async createGroup(group: Omit<Group, 'id'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.GROUPS), {
      ...group,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async joinGroup(groupId: string, userId: string) {
    const docRef = doc(db, COLLECTIONS.GROUPS, groupId);
    await updateDoc(docRef, {
      'members': arrayUnion({ handle: userId, role: 'member' }),
    });
  },

  async leaveGroup(groupId: string, userId: string) {
    const docRef = doc(db, COLLECTIONS.GROUPS, groupId);
    await updateDoc(docRef, {
      'members': arrayRemove({ handle: userId, role: 'member' }),
    });
  },

  subscribeGroups(callback: (groups: Group[]) => void) {
    const q = query(collection(db, COLLECTIONS.GROUPS));
    
    return onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Group[];
      callback(groups);
    });
  },
};

// Notifications Operations
export const notificationService = {
  async createNotification(notification: Omit<Notification, 'id'>) {
    await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
      ...notification,
      createdAt: serverTimestamp(),
      read: false,
    });
  },

  async markAsRead(notificationId: string) {
    const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(docRef, { read: true });
  },

  subscribeNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      callback(notifications);
    });
  },
};