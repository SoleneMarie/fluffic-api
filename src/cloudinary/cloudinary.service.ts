// méthodes communiquant directement avec Cloudinary: uploadimage, deleteimage
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

import { TCloudinaryImage } from './types/cloudinary-image-type';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.getOrThrow<string>(
      'CLOUDINARY_CLOUD_NAME',
    );
    const cloudApiKey =
      this.configService.getOrThrow<string>('CLOUDINARY_API_KEY');
    const cloudApiSecret = this.configService.getOrThrow<string>(
      'CLOUDINARY_API_SECRET',
    );

    cloudinary.config({
      cloud_name: cloudName,
      api_key: cloudApiKey,
      api_secret: cloudApiSecret,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<TCloudinaryImage> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            return reject(new Error('Cloudinary upload returned no result'));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  }
}
