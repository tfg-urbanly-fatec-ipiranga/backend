import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'
import * as streamifier from 'streamifier'

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARI_API_SECRET,
        })
    }

    async upload(file: Express.Multer.File, name: string): Promise<{ url: string }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    public_id: name,
                    folder: 'avatars',
                    format: 'jpg',
                    quality: 'auto'
                },
                (error, result) => {
                    if (error || !result) {
                        console.error('Cloudinary error:', error);
                        reject(error);
                    } else {
                        const url = cloudinary.url(result.public_id, {
                            fetch_format: 'auto',
                            quality: 'auto'
                        });
                        resolve({ url });
                    }
                }
            );

            // FIX: streamifier cria stream correto
            streamifier.createReadStream(file.buffer!).pipe(uploadStream);
        });
    }
}
