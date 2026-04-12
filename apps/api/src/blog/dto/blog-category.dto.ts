import { IsOptional, IsString } from 'class-validator';

export class CreateBlogCategoryDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  nameUa?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;
}

export class UpdateBlogCategoryDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  nameUa?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;
}
