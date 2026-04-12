import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePageDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  titleUa?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  contentUa?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

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
  @IsString()
  ogImageUa?: string;

  @IsOptional()
  @IsString()
  ogImageEn?: string;

  @IsOptional()
  @IsString()
  canonical?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class UpdatePageDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  titleUa?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  contentUa?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

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
  @IsString()
  ogImageUa?: string;

  @IsOptional()
  @IsString()
  ogImageEn?: string;

  @IsOptional()
  @IsString()
  canonical?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
