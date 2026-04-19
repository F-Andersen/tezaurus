import { IsString, IsOptional, IsInt, IsBoolean, IsArray } from 'class-validator';

export class CreateServiceDto {
  @IsString() slug: string;
  @IsOptional() @IsString() nameUa?: string;
  @IsOptional() @IsString() nameEn?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() descriptionUa?: string;
  @IsOptional() @IsString() descriptionEn?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsInt() priceFrom?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() metaTitleUa?: string;
  @IsOptional() @IsString() metaTitleEn?: string;
  @IsOptional() @IsString() metaDescriptionUa?: string;
  @IsOptional() @IsString() metaDescriptionEn?: string;
}

export class UpdateServiceDto {
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() nameUa?: string;
  @IsOptional() @IsString() nameEn?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() descriptionUa?: string;
  @IsOptional() @IsString() descriptionEn?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsInt() priceFrom?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() metaTitleUa?: string;
  @IsOptional() @IsString() metaTitleEn?: string;
  @IsOptional() @IsString() metaDescriptionUa?: string;
  @IsOptional() @IsString() metaDescriptionEn?: string;
}
