'use client';

import { getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import type { Storage } from 'firebase/storage';

export const uploadImageWithProgress = (
    storage: Storage, 
    file: File, 
    userId: string,
    onProgress: (progress: number) => void
): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!file || !userId) {
            return reject(new Error('File and user ID are required for upload.'));
        }
        
        if (!file.type.startsWith('image/')) {
            return reject(new Error('File is not an image.'));
        }
        // The check for 20MB is now less critical due to compression, 
        // but it's a good safeguard. We'll check the original file size in the dialog.
        
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const fileName = `${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, `post_images/${userId}/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
            (snapshot: UploadTaskSnapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            }, 
            (error) => {
                console.error("Upload failed:", error);
                // Handle specific errors here if needed (e.g., permissions)
                reject(error);
            }, 
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};
