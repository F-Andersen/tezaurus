import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { S3Service } from './s3.service';
import { LocalMediaStore } from './local-media.store';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, S3Service, LocalMediaStore],
  exports: [MediaService, S3Service, LocalMediaStore],
})
export class MediaModule {}
