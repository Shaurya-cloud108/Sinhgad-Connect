# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Seeding the Database (One-Time Setup)

To populate your Firestore database with the initial mock data for users, groups, jobs, etc., you need to run the seeding script.

1.  **Important:** Before running, go to your Firebase project's **Firestore Database** page in the Firebase Console and create a database. Choose "Start in production mode".
2.  Open a new terminal in your development environment.
3.  Run the following command:

    ```bash
    npm run-script seed-db
    ```

4.  This will execute the `src/lib/seed-db.ts` script, which uploads all the necessary data. You only need to do this once. After it's done, you can even delete the script file if you wish.
# Sinhgad-Connect
# Sinhgad-Connect
