import { Body, Controller, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CaptchaGuard } from './captcha.guard';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class LeadsController {
  constructor(private leads: LeadsService) {}

  @Post('public/leads')
  @Throttle({ default: { limit: 10, ttl: 900000 } })
  @UseGuards(CaptchaGuard)
  create(@Body() dto: CreateLeadDto) {
    return this.leads.create(dto);
  }

  @Get('admin/leads')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER, UserRole.SALES)
  findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.leads.findAll({ status: status as never, type, from, to });
  }

  @Get('admin/leads/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SALES)
  async export(
    @Res() res: Response,
    @Query('format') format: 'csv' | 'xlsx' = 'csv',
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const data = await this.leads.export({ status, type, from, to }, 'csv');
    const filename = `leads-${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + data);
  }

  @Get('admin/leads/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SALES)
  findOne(@Param('id') id: string) {
    return this.leads.findOne(id);
  }

  @Patch('admin/leads/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SALES)
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leads.updateStatus(id, dto);
  }
}
