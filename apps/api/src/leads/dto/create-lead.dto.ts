import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum LeadTypeEnum {
  request = 'request',
  callback = 'callback',
}

export class CreateLeadDto {
  @IsEnum(LeadTypeEnum)
  type: 'request' | 'callback';

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  requestType?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsBoolean()
  consent: boolean;

  @IsOptional()
  @IsString()
  captchaToken?: string;
}
