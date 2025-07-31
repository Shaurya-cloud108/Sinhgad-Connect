
import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDoc,
  runTransaction,
} from 'firebase/firestore';
import type { FeedItem, Comment } from './data';
import type { PostEditFormData } from '@/components/edit-post-dialog';

const feedItemsCollection = collection(db, 'feedItems');

// Get all feed items
export const getFeedItems = async (): Promise<FeedItem[]> => {
  const q = query(feedItemsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedItem));
};

// Add a new feed item
export const addFeedItem = async (item: Omit<FeedItem, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(feedItemsCollection, {
    ...item,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update a feed item
export const updateFeedItem = async (id: string, data: PostEditFormData) => {
  const docRef = doc(db, 'feedItems', id);
  await updateDoc(docRef, {
    content: data.content,
    location: data.location,
  });
};

// Delete a feed item
export const deleteFeedItem = async (id: string) => {
  const docRef = doc(db, 'feedItems', id);
  await deleteDoc(docRef);
};

// Toggle like on a feed item
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

// Add a comment to a feed item
export const addComment = async (postId: string, comment: Omit<Comment, 'id'>): Promise<Comment> => {
    const postRef = doc(db, 'feedItems', postId);
    const newComment = { ...comment, id: Date.now() }; // Simple unique ID for now
    await updateDoc(postRef, {
        comments: arrayUnion(newComment),
    });
    return newComment;
};

// Delete a comment from a feed item
export const deleteComment = async (postId: string, commentId: number) => {
    const postRef = doc(db, 'feedItems', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
        const postData = postSnap.data() as FeedItem;
        const updatedComments = postData.comments.filter(c => c.id !== commentId);
        await updateDoc(postRef, { comments: updatedComments });
    }
};
