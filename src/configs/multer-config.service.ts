import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { diskStorage, memoryStorage } from "multer";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      dest: './uploads',
      limits: this.getUploadLimits(),
      fileFilter: this.fileFilter(),
      storage: this.diskStorage(),
    };
  }

  private getUploadLimits() {
    return {
      fileSize: 10 * 1024 * 1024,
    };
  }

  private fileFilter() {
    return (req, file, callback: any) => {
      const allowedTypes = ['image/png', 'image/jpeg', 'application/zip', 'application/geo+json', 'application/vnd.google-earth.kmz'];
      if (!allowedTypes.includes(file.mimetype)) {
        return callback(new Error('Invalid file type'));
      }
      callback(null, true);
    };
  }

  private diskStorage() {
    return diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const ext = file.originalname.split('.').pop();
        const randomName = `${name}-${Date.now()}.${ext}`;
        callback(null, randomName);
      },
    });
  }

  private memoryStorage(){ // use to buffer 
    return memoryStorage();
  }
}
