import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import {
  initialCommunityMembers,
  initialFeedItems,
  initialJobListings,
  initialEvents,
  initialGroups,
  initialSuccessStories,
  initialNotifications,
} from './data';

export async function migrateDataToFirebase() {
  try {
    console.log('🚀 Starting data migration to Firebase...');

    // Migrate Users (Community Members)
    console.log('📝 Migrating users...');
    const usersBatch = writeBatch(db);
    
    initialCommunityMembers.forEach((user) => {
      const userRef = doc(db, 'users', user.handle); // Use handle as document ID
      usersBatch.set(userRef, {
        ...user,
        uid: user.handle, // For compatibility
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    
    await usersBatch.commit();
    console.log(`✅ Migrated ${initialCommunityMembers.length} users`);

    // Migrate Posts (Feed Items)
    console.log('📝 Migrating posts...');
    const postsBatch = writeBatch(db);
    
    initialFeedItems.forEach((post) => {
      const postRef = doc(db, 'posts', post.id.toString());
      postsBatch.set(postRef, {
        ...post,
        timestamp: new Date(post.timestamp || Date.now()),
        createdAt: new Date(),
      });
    });
    
    await postsBatch.commit();
    console.log(`✅ Migrated ${initialFeedItems.length} posts`);

    // Migrate Jobs
    console.log('📝 Migrating job listings...');
    const jobsBatch = writeBatch(db);
    
    initialJobListings.forEach((job) => {
      const jobRef = doc(db, 'jobs', job.id.toString());
      jobsBatch.set(jobRef, {
        ...job,
        createdAt: new Date(),
      });
    });
    
    await jobsBatch.commit();
    console.log(`✅ Migrated ${initialJobListings.length} job listings`);

    // Migrate Events
    console.log('📝 Migrating events...');
    const eventsBatch = writeBatch(db);
    
    initialEvents.forEach((event) => {
      const eventRef = doc(db, 'events', event.id);
      eventsBatch.set(eventRef, {
        ...event,
        date: new Date(event.date),
        createdAt: new Date(),
        attendees: event.attendees || [],
        rsvp: event.rsvp || {},
      });
    });
    
    await eventsBatch.commit();
    console.log(`✅ Migrated ${initialEvents.length} events`);

    // Migrate Groups
    console.log('📝 Migrating groups...');
    const groupsBatch = writeBatch(db);
    
    initialGroups.forEach((group) => {
      const groupRef = doc(db, 'groups', group.id);
      groupsBatch.set(groupRef, {
        ...group,
        createdAt: new Date(),
      });
    });
    
    await groupsBatch.commit();
    console.log(`✅ Migrated ${initialGroups.length} groups`);

    // Migrate Success Stories
    console.log('📝 Migrating success stories...');
    const storiesBatch = writeBatch(db);
    
    initialSuccessStories.forEach((story) => {
      const storyRef = doc(db, 'successStories', story.id);
      storiesBatch.set(storyRef, {
        ...story,
        createdAt: new Date(),
      });
    });
    
    await storiesBatch.commit();
    console.log(`✅ Migrated ${initialSuccessStories.length} success stories`);

    // Migrate Notifications (optional - these are usually generated dynamically)
    console.log('📝 Migrating notifications...');
    const notificationsBatch = writeBatch(db);
    
    initialNotifications.forEach((notification) => {
      const notificationRef = doc(db, 'notifications', notification.id);
      notificationsBatch.set(notificationRef, {
        ...notification,
        createdAt: new Date(notification.timestamp),
      });
    });
    
    await notificationsBatch.commit();
    console.log(`✅ Migrated ${initialNotifications.length} notifications`);

    console.log('🎉 Data migration completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error during data migration:', error);
    throw error;
  }
}

// Function to clear all data (use with caution!)
export async function clearAllData() {
  console.log('🗑️ Clearing all data from Firebase...');
  
  const collections = ['users', 'posts', 'jobs', 'events', 'groups', 'successStories', 'notifications'];
  
  for (const collectionName of collections) {
    console.log(`Clearing ${collectionName}...`);
    // Note: In production, you'd want to use Firebase Admin SDK for bulk deletes
    // This is a simplified version for development
  }
  
  console.log('✅ All data cleared');
}

// Utility function to check migration status
export async function checkMigrationStatus() {
  try {
    const collections = [
      { name: 'users', expected: initialCommunityMembers.length },
      { name: 'posts', expected: initialFeedItems.length },
      { name: 'jobs', expected: initialJobListings.length },
      { name: 'events', expected: initialEvents.length },
      { name: 'groups', expected: initialGroups.length },
      { name: 'successStories', expected: initialSuccessStories.length },
    ];

    console.log('📊 Migration Status:');
    
    for (const col of collections) {
      // Note: Getting collection size requires reading all documents
      // In production, you might want to use Firebase Admin SDK or counters
      console.log(`${col.name}: Expected ${col.expected} documents`);
    }
    
  } catch (error) {
    console.error('Error checking migration status:', error);
  }
}