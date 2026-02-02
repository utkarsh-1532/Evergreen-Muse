import { FieldValue, Timestamp } from 'firebase/firestore';

export type UserProfile = {
    id: string;
    userId: string;
    username: string;
    profilePicUrl?: string;
    bio?: string;
    email?: string;
    createdAt: any; // Firestore Timestamp
};

export type Post = {
    id: string;
    authorId: string;
    authorUsername: string;
    authorProfilePicUrl?: string;
    title?: string;
    text: string;
    imageUrl?: string;
    imageCaption?: string;
    songTitle?: string;
    artistName?: string;
    albumArtUrl?: string;
    audioPreviewUrl?: string;
    timestamp: Timestamp;
    likeIds: string[];
};

export type Like = {
    id: string;
    userId: string;
    postId: string;
    timestamp: FieldValue;
};

export type Habit = {
    id: string;
    userId: string;
    title: string;
    streak: number;
    lastCompleted: Timestamp | null;
    completedDates: Timestamp[];
    createdAt: Timestamp;
};

export type LearningSeed = {
    id: string;
    userId: string;
    front: string;
    back: string;
    box: number;
    nextReview: Timestamp;
    category: string;
    createdAt: Timestamp;
};
