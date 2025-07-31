
// A script to populate the Firestore database with initial data.
// To run: `npm run-script seed-db`

import { db } from './firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { 
    initialCommunityMembers,
    initialGroupsData,
    initialEventsData,
    initialJobListings,
    initialConversations,
    initialMessages,
    initialStories,
    successStories,
    notifications,
} from './data-seed'; // Using a new file for seed data

async function seedDatabase() {
    try {
        console.log('Starting to seed database...');

        const batch = writeBatch(db);

        // Seed Community Members
        console.log(`Seeding ${initialCommunityMembers.length} community members...`);
        const membersCollection = collection(db, 'communityMembers');
        initialCommunityMembers.forEach(member => {
            const docRef = doc(membersCollection, member.handle);
            batch.set(docRef, member);
        });
        
        // Seed Groups
        console.log(`Seeding ${initialGroupsData.length} groups...`);
        const groupsCollection = collection(db, 'groups');
        initialGroupsData.forEach(group => {
            const docRef = doc(groupsCollection, group.id);
            batch.set(docRef, group);
        });

        // Seed Events
        console.log(`Seeding ${initialEventsData.length} events...`);
        const eventsCollection = collection(db, 'events');
        initialEventsData.forEach(event => {
            const docRef = doc(eventsCollection, event.id);
            batch.set(docRef, event);
        });

        // Seed Job Listings
        console.log(`Seeding ${initialJobListings.length} job listings...`);
        const jobsCollection = collection(db, 'jobListings');
        initialJobListings.forEach(job => {
            const docRef = doc(jobsCollection); // Auto-generate ID
            batch.set(docRef, job);
        });
        
        // Seed Stories (empty shells for users)
        console.log(`Seeding ${initialStories.length} story shells...`);
        const storiesCollection = collection(db, 'stories');
        initialStories.forEach(story => {
            const docRef = doc(storiesCollection, story.author.handle);
            batch.set(docRef, story);
        });

        // Seed Success Stories
        console.log(`Seeding ${successStories.length} success stories...`);
        const successStoriesCollection = collection(db, 'successStories');
        successStories.forEach(story => {
            const docRef = doc(successStoriesCollection, story.id);
            batch.set(docRef, story);
        });

        // NOTE: We are not seeding feedItems, conversations, or notifications
        // as they are better generated through user interaction.

        await batch.commit();

        console.log('-----------------------------------------');
        console.log('✅ Database seeded successfully!');
        console.log('-----------------------------------------');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
