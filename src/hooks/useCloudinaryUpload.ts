import { useState } from "react";
import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryResponse {
    asset_id: string;
    public_id: string;
    secure_url: string;
    url: string;
    resource_type: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
    duration?: number;
}

export const useCloudinaryUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const upload = async (file: File): Promise<CloudinaryResponse> => {
        setUploading(true);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            const { data } = await axios.post<CloudinaryResponse>(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
                formData,
                {
                    onUploadProgress(event) {
                        if (!event.total) return;

                        setProgress(
                            Math.round((event.loaded * 100) / event.total)
                        );
                    },
                }
            );

            return data;
        } finally {
            setUploading(false);
        }
    };

    return {
        upload,
        uploading,
        progress,
    };
};