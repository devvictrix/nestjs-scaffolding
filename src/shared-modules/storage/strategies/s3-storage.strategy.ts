// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { StorageStrategy } from '../storage-strategy.interface';
// import * as AWS from 'aws-sdk';

// @Injectable()
// export class S3StorageStrategy implements StorageStrategy {
//   private s3: AWS.S3;
//   private bucketName: string;

//   constructor(private readonly configService: ConfigService) {
//     this.s3 = new AWS.S3({
//       accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
//       secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
//       region: this.configService.get<string>('AWS_REGION'),
//     });

//     this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
//   }

//   async uploadFile(
//     file: Express.Multer.File,
//     destination: string,
//   ): Promise<string> {
//     const params = {
//       Bucket: this.bucketName,
//       Key: destination,
//       Body: file.buffer,
//       ACL: 'public-read',
//     };

//     const { Location } = await this.s3.upload(params).promise();

//     return Location;
//   }

//   async removeFile(filename: string): Promise<void> {
//     const key = filename.split('/').pop();

//     const params = {
//       Bucket: this.bucketName,
//       Key: key,
//     };

//     await this.s3.deleteObject(params).promise();
//   }
// }
