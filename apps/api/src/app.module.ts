import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { PublicModule } from './public/public.module';
import { LeadsModule } from './leads/leads.module';
import { PagesModule } from './pages/pages.module';
import { ClinicsModule } from './clinics/clinics.module';
import { BlogModule } from './blog/blog.module';
import { MediaModule } from './media/media.module';
import { RedirectsModule } from './redirects/redirects.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 100 }]),
    PrismaModule,
    EmailModule,
    AuthModule,
    UsersModule,
    SettingsModule,
    PublicModule,
    LeadsModule,
    PagesModule,
    ClinicsModule,
    BlogModule,
    MediaModule,
    RedirectsModule,
    DashboardModule,
    ServicesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
