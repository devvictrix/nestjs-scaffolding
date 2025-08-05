import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { LocalStorageStrategy } from './strategies/local-storage.strategy';
// import { GcpStorageStrategy } from './strategies/gcp-storage.strategy';
// import { S3StorageStrategy } from './strategies/s3-storage.strategy';

@Module({
  providers: [
    StorageService,
    LocalStorageStrategy,
    // GcpStorageStrategy,
    // S3StorageStrategy,
  ],
  exports: [StorageService],
})
export class StorageModule {}
