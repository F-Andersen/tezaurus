import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicPagesService } from './public-pages.service';
import { PublicClinicsService } from './public-clinics.service';
import { PublicBlogService } from './public-blog.service';
import { PublicSettingsService } from './public-settings.service';
import { PublicServicesService } from './public-services.service';

type Lang = 'ua' | 'en';

function toLang(v?: string): Lang {
  return v === 'en' ? 'en' : 'ua';
}

@Controller('public')
export class PublicController {
  constructor(
    private pages: PublicPagesService,
    private clinics: PublicClinicsService,
    private blog: PublicBlogService,
    private settings: PublicSettingsService,
    private services: PublicServicesService,
  ) {}

  @Get('pages')
  listPageSlugs() {
    return this.pages.listSlugs();
  }

  @Get('pages/:slug')
  getPage(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.pages.findBySlug(slug, toLang(lang));
  }

  @Get('clinics')
  getClinics(@Query('lang') lang?: string, @Query('country') country?: string, @Query('city') city?: string) {
    return this.clinics.findAll(toLang(lang), country, city);
  }

  @Get('clinics/:slug')
  getClinic(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.clinics.findBySlug(slug, toLang(lang));
  }

  @Get('blog')
  getBlog(@Query('lang') lang?: string, @Query('category') category?: string) {
    return this.blog.findAll(toLang(lang), category);
  }

  @Get('blog/:slug')
  getBlogPost(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.blog.findBySlug(slug, toLang(lang));
  }

  @Get('services')
  getServices(@Query('lang') lang?: string, @Query('category') category?: string, @Query('country') country?: string) {
    return this.services.findAll(toLang(lang), category, country);
  }

  @Get('services/:slug')
  getService(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.services.findBySlug(slug, toLang(lang));
  }

  @Get('settings')
  getSettings() {
    return this.settings.getPublic();
  }
}
