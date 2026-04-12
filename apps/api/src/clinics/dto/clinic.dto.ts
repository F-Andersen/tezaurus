import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  nameUa?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @IsOptional()
  @IsString()
  descriptionUa?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  metaTitleUa?: string;

  @IsOptional()
  @IsString()
  metaTitleEn?: string;

  @IsOptional()
  @IsString()
  metaDescriptionUa?: string;

  @IsOptional()
  @IsString()
  metaDescriptionEn?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageIds?: string[];
}

export class UpdateClinicDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  nameUa?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @IsOptional()
  @IsString()
  descriptionUa?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  metaTitleUa?: string;

  @IsOptional()
  @IsString()
  metaTitleEn?: string;

  @IsOptional()
  @IsString()
  metaDescriptionUa?: string;

  @IsOptional()
  @IsString()
  metaDescriptionEn?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageIds?: string[];
}
