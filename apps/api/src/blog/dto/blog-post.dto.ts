import { IsArray, IsOptional, IsString, IsEnum } from 'class-validator';
import { BlogPostStatus } from '@prisma/client';

export class CreateBlogPostDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  titleUa?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  excerptUa?: string;

  @IsOptional()
  @IsString()
  excerptEn?: string;

  @IsOptional()
  @IsString()
  bodyUa?: string;

  @IsOptional()
  @IsString()
  bodyEn?: string;

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
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus;

  @IsOptional()
  publishedAt?: Date;
}

export class UpdateBlogPostDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  titleUa?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  excerptUa?: string;

  @IsOptional()
  @IsString()
  excerptEn?: string;

  @IsOptional()
  @IsString()
  bodyUa?: string;

  @IsOptional()
  @IsString()
  bodyEn?: string;

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
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus;

  @IsOptional()
  publishedAt?: Date;
}
