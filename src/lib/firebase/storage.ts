'use client';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import type { Storage } from 'firebase/storage';

export const uploadImage = async (storage: Storage, file: File, userId: string): Promise<string> => {
    if (!file || !userId) {
        throw new Error('File and user ID are required for upload.');
    }
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
        throw new Error('File is not an image.');
    }
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
        throw new Error('Image must be less than 20MB.');
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `post_images/${userId}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
};
