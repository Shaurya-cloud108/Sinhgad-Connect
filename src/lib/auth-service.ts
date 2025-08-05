import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { CommunityMember } from './data';

const googleProvider = new GoogleAuthProvider();

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface UserProfile extends CommunityMember {
  uid: string;
  createdAt?: any;
  updatedAt?: any;
}

export const authService = {
  // Sign up with email and password
  async signUpWithEmail(
    email: string, 
    password: string, 
    profileData: Omit<CommunityMember, 'handle'>
  ): Promise<{ user: AuthUser; profile: UserProfile }> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, {
        displayName: profileData.name,
      });

      // Generate a unique handle
      const handle = await generateUniqueHandle(profileData.name);

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        ...profileData,
        uid: user.uid,
        handle,
        email: user.email || '',
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        },
        profile: userProfile,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  },

  // Sign in with email and password
  async signInWithEmail(email: string, password: string): Promise<{ user: AuthUser; profile: UserProfile | null }> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user profile from Firestore
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      const profile = profileDoc.exists() ? { id: profileDoc.id, ...profileDoc.data() } as UserProfile : null;

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        },
        profile,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<{ user: AuthUser; profile: UserProfile; isNewUser: boolean }> {
    try {
      const userCredential: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if user profile exists
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      let profile: UserProfile;
      let isNewUser = false;

      if (!profileDoc.exists()) {
        // New user - create profile
        isNewUser = true;
        const handle = await generateUniqueHandle(user.displayName || 'User');
        
        profile = {
          uid: user.uid,
          handle,
          name: user.displayName || 'Anonymous User',
          email: user.email || '',
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=8B0000&color=fff`,
          bio: '',
          location: '',
          website: '',
          education: [],
          experience: [],
          skills: [],
          interests: [],
          following: [],
          followers: [],
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(doc(db, 'users', user.uid), profile);
      } else {
        // Existing user - get profile
        profile = { id: profileDoc.id, ...profileDoc.data() } as UserProfile;
        
        // Update last login time
        await updateDoc(doc(db, 'users', user.uid), {
          updatedAt: serverTimestamp(),
        });
      }

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        },
        profile,
        isNewUser,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // If updating display name, also update Firebase Auth profile
      if (updates.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name,
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  // Get current user profile
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      return profileDoc.exists() ? { id: profileDoc.id, ...profileDoc.data() } as UserProfile : null;
    } catch (error) {
      console.error('Error getting current user profile:', error);
      return null;
    }
  },

  // Listen to authentication state changes
  onAuthStateChanged(callback: (user: AuthUser | null, profile: UserProfile | null) => void) {
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        const profile = profileDoc.exists() ? { id: profileDoc.id, ...profileDoc.data() } as UserProfile : null;
        
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        }, profile);
      } else {
        callback(null, null);
      }
    });
  },

  // Get current authenticated user
  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    } : null;
  },
};

// Helper function to generate unique handle
async function generateUniqueHandle(name: string): Promise<string> {
  const baseHandle = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 20);

  let handle = baseHandle;
  let counter = 1;

  while (true) {
    // Check if handle exists
    const snapshot = await getDoc(doc(db, 'users', handle));
    if (!snapshot.exists()) {
      break;
    }
    handle = `${baseHandle}-${counter}`;
    counter++;
  }

  return handle;
}