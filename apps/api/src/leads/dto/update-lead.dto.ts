import { IsEnum } from 'class-validator';
import { LeadStatus } from '@prisma/client';

export class UpdateLeadDto {
  @IsEnum(LeadStatus)
  status: LeadStatus;
}
