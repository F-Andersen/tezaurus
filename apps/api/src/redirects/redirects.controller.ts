import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import { CreateRedirectDto, UpdateRedirectDto } from './dto/redirect.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/redirects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
export class RedirectsController {
  constructor(private redirects: RedirectsService) {}

  @Post()
  create(@Body() dto: CreateRedirectDto) {
    return this.redirects.create(dto);
  }

  @Get()
  findAll() {
    return this.redirects.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.redirects.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRedirectDto) {
    return this.redirects.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.redirects.remove(id);
  }
}
