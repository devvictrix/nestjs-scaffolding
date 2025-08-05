import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageStrategy } from './storage-strategy.interface';
import { LocalStorageStrategy } from './strategies/local-storage.strategy';
// import { GcpStorageStrategy } from './strategies/gcp-storage.strategy';
// import { S3StorageStrategy } from './strategies/s3-storage.strategy';

@Injectable()
export class StorageService {
  private strategy: StorageStrategy;

  constructor(
    private readonly configService: ConfigService,
    private readonly localStorageStrategy: LocalStorageStrategy,
    // private readonly gcpStorageStrategy: GcpStorageStrategy,
    // private readonly s3StorageStrategy: S3StorageStrategy,
  ) {
    this.selectStrategy();
  }

  private selectStrategy() {
    const strategyType = this.configService.get<string>('FILESYSTEM_DRIVER');
    switch (strategyType) {
      case 'local':
        this.strategy = this.localStorageStrategy;
        break;
      // case 'gcp':
      //   this.strategy = this.gcpStorageStrategy;
      //   break;
      // case 's3':
      //   this.strategy = this.s3StorageStrategy;
      //   break;
      default:
        throw new Error(`Unsupported storage strategy: ${strategyType}`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    destination: string,
  ): Promise<string> {
    return this.strategy.uploadFile(file, destination);
  }

  async removeFile(filename: string): Promise<void> {
    return this.strategy.removeFile(filename);
  }
}
