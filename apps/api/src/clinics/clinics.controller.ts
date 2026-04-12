import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto, UpdateClinicDto } from './dto/clinic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/clinics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
export class ClinicsController {
  constructor(private clinics: ClinicsService) {}

  @Post()
  create(@Body() dto: CreateClinicDto) {
    return this.clinics.create(dto);
  }

  @Get()
  findAll() {
    return this.clinics.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinics.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClinicDto) {
    return this.clinics.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinics.remove(id);
  }
}
