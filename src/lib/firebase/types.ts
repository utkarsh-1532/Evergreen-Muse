export type UserProfile = {
    id: string;
    userId: string;
    username: string;
    profilePicUrl?: string;
    bio?: string;
    email?: string;
    createdAt: any; // Firestore Timestamp
};
