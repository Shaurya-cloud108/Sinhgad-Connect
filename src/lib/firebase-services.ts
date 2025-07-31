

import { db, auth } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDoc,
  runTransaction,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { FeedItem, Comment, CommunityMember, JobListing, Event, Group, SuccessStory, Notification } from './data';
import type { PostEditFormData } from '@/components/edit-post-dialog';

const feedItemsCollection = collection(db, 'feedItems');
const communityMembersCollection = collection(db, 'communityMembers');
const jobsCollection = collection(db, 'jobListings');
const eventsCollection = collection(db, 'events');
const groupsCollection = collection(db, 'groups');
const successStoriesCollection = collection(db, 'successStories');
const notificationsCollection = collection(db, 'notifications');


// Feed Item Services
export const getFeedItems = async (): Promise<FeedItem[]> => {
  const q = query(feedItemsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedItem));
};

export const addFeedItem = async (item: Omit<FeedItem, 'id'>) => {
  const itemData: any = { ...item };
  if (itemData.groupId === undefined) {
    delete itemData.groupId;
  }
  const docRef = await addDoc(feedItemsCollection, {
    ...itemData,
  });
  return docRef.id;
};

export const updateFeedItem = async (id: string, data: PostEditFormData) => {
  const docRef = doc(db, 'feedItems', id);
  await updateDoc(docRef, {
    content: data.content,
    location: data.location,
  });
};

export const deleteFeedItem = async (id: string) => {
  const docRef = doc(db, 'feedItems', id);
  await deleteDoc(docRef);
};

export const toggleLike = async (postId: string, userHandle: string, isLiked: boolean) => {
    const docRef = doc(db, 'feedItems', postId);
    await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(docRef);
        if (!postDoc.exists()) {
            throw "Document does not exist!";
        }
        const currentLikes = postDoc.data().likes || 0;
        transaction.update(docRef, {
            likedBy: isLiked ? arrayRemove(userHandle) : arrayUnion(userHandle),
            likes: isLiked ? currentLikes - 1 : currentLikes + 1,
        });
    });
};

export const addComment = async (postId: string, comment: Omit<Comment, 'id'>): Promise<Comment> => {
    const postRef = doc(db, 'feedItems', postId);
    const newComment = { ...comment, id: Date.now() }; // Simple unique ID for now
    await updateDoc(postRef, {
        comments: arrayUnion(newComment),
    });
    return newComment;
};

export const deleteComment = async (postId: string, commentId: number) => {
    const postRef = doc(db, 'feedItems', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
        const postData = postSnap.data() as FeedItem;
        const updatedComments = postData.comments.filter(c => c.id !== commentId);
        await updateDoc(postRef, { comments: updatedComments });
    }
};

// Community Member Services
export const getCommunityMembers = async (): Promise<CommunityMember[]> => {
    const snapshot = await getDocs(communityMembersCollection);
    return snapshot.docs.map(doc => ({ ...doc.data(), handle: doc.id } as CommunityMember));
};

export const addCommunityMember = async (member: CommunityMember, password: string): Promise<void> => {
    // Create user in Firebase Authentication
    await createUserWithEmailAndPassword(auth, member.contact.email, password);

    // Create user profile document in Firestore
    const docRef = doc(communityMembersCollection, member.handle);
    await setDoc(docRef, member);
};

export const toggleFollow = async (currentUserHandle: string, targetUserHandle: string, isFollowing: boolean) => {
    const currentUserRef = doc(db, 'communityMembers', currentUserHandle);
    const targetUserRef = doc(db, 'communityMembers', targetUserHandle);

    const batch = runTransaction(db, async (transaction) => {
        transaction.update(currentUserRef, {
            following: isFollowing ? arrayRemove(targetUserHandle) : arrayUnion(targetUserHandle)
        });
        transaction.update(targetUserRef, {
            followers: isFollowing ? arrayRemove(currentUserHandle) : arrayUnion(currentUserHandle)
        });
    });

    await batch;
};


// Job Listing Services
export const getJobListings = async (): Promise<JobListing[]> => {
    const snapshot = await getDocs(jobsCollection);
    // Note: Assuming jobs don't need a specific order for now.
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobListing));
}

export const addJobListing = async (job: Omit<JobListing, 'id'>): Promise<string> => {
    const docRef = await addDoc(jobsCollection, job);
    return docRef.id;
};

// Event Services
export const getEvents = async (): Promise<Event[]> => {
    const snapshot = await getDocs(eventsCollection);
    // Note: Assuming events don't need a specific order for now. Can be ordered by date later.
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
}

// Group Services
export const getGroups = async (): Promise<Group[]> => {
    const snapshot = await getDocs(groupsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
}

// Success Story Services
export const getSuccessStories = async (): Promise<SuccessStory[]> => {
    const snapshot = await getDocs(successStoriesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SuccessStory));
}

// Notification Services
export const getNotifications = async (): Promise<Notification[]> => {
    const q = query(notificationsCollection); // Can be ordered by a timestamp later
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
};

// Story Services
export const addStoryShell = async (story: any) => {
    const docRef = doc(db, 'stories', story.author.handle);
    await setDoc(docRef, story);
};
