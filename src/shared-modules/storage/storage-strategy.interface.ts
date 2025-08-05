export interface StorageStrategy {
  uploadFile(file: Express.Multer.File, destination: string): Promise<string>;
  removeFile(filePath: string): Promise<void>;
}
