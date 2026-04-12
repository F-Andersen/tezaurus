import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
export class MediaController {
  constructor(private media: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, altUa: { type: 'string' }, altEn: { type: 'string' } } } })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('altUa') altUa?: string,
    @Body('altEn') altEn?: string,
  ) {
    return this.media.upload(file, altUa, altEn);
  }

  @Get()
  findAll() {
    return this.media.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.media.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { altUa?: string; altEn?: string }) {
    return this.media.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.media.remove(id);
  }
}
