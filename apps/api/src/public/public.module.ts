import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicPagesService } from './public-pages.service';
import { PublicClinicsService } from './public-clinics.service';
import { PublicBlogService } from './public-blog.service';
import { PublicSettingsService } from './public-settings.service';
import { PublicServicesService } from './public-services.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [PublicController],
  providers: [PublicPagesService, PublicClinicsService, PublicBlogService, PublicSettingsService, PublicServicesService],
})
export class PublicModule {}
