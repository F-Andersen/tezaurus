import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/pages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
export class PagesController {
  constructor(private pages: PagesService) {}

  @Post()
  create(@Body() dto: CreatePageDto) {
    return this.pages.create(dto);
  }

  @Get()
  findAll() {
    return this.pages.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pages.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.pages.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pages.remove(id);
  }
}
