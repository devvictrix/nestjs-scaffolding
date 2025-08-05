import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { StorageStrategy } from '../storage-strategy.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
  private basePath: string;

  constructor(private configService: ConfigService) {
    this.basePath =
      this.configService.get<string>('LOCAL_STORAGE_PATH') || 'storage/private';

    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  private sanitizePath(destination: string): string {
    return destination
      .replace(/(\.\.\/|\/\.\.)/g, '')
      .replace(/[^a-zA-Z0-9-_./]/g, '_');
  }

  async uploadFile(
    file: Express.Multer.File,
    destination: string,
  ): Promise<string> {
    const safeDestination = this.sanitizePath(destination);
    const fullPath = path.join(this.basePath, safeDestination);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, file.buffer);

    return fullPath;
  }

  async removeFile(filename: string): Promise<void> {
    const filePath = path.join(this.basePath, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
