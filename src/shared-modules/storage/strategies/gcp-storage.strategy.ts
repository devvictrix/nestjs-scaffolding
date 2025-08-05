// import { Injectable } from '@nestjs/common';
// import { StorageStrategy } from '../storage-strategy.interface';
// import { Storage } from '@google-cloud/storage';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class GcpStorageStrategy implements StorageStrategy {
//   private storage: Storage;
//   private bucketName: string;

//   constructor(private configService: ConfigService) {
//     const projectId = this.configService.get<string>('GCP_PROJECT_ID');
//     const clientEmail = this.configService.get<string>('GCP_CLIENT_EMAIL');
//     const privateKey = this.configService.get<string>('GCP_PRIVATE_KEY');

//     if (clientEmail && privateKey) {
//       this.storage = new Storage({
//         projectId,
//         credentials: {
//           client_email: clientEmail,
//           private_key: privateKey.replace(/\\n/gm, '\n'),
//         },
//       });
//     } else {
//       this.storage = new Storage({ projectId });
//     }

//     this.bucketName = this.configService.get<string>('GCP_STORAGE_BUCKET');
//   }

//   async uploadFile(
//     file: Express.Multer.File,
//     destination: string,
//   ): Promise<string> {
//     const blob = this.storage.bucket(this.bucketName).file(destination);
//     const blobStream = blob.createWriteStream();

//     blobStream.end(file.buffer);

//     return new Promise((resolve, reject) => {
//       blobStream.on('finish', () => {
//         const publicUrl = `https://storage.googleapis.com/${
//           this.bucketName
//         }/${encodeURIComponent(blob.name)}`;
//         resolve(publicUrl);
//       });
//       blobStream.on('error', (err) => {
//         blobStream.end();
//         reject(err);
//       });
//     });
//   }

//   async removeFile(filename: string): Promise<void> {
//     const blobName = filename.replace(
//       `https://storage.googleapis.com/${this.bucketName}/`,
//       '',
//     );
//     const bucket = this.storage.bucket(this.bucketName);
//     const blob = bucket.file(blobName);
//     await blob.delete();
//   }
// }
