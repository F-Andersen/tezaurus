import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateRedirectDto {
  @IsString()
  fromPath: string;

  @IsString()
  toPath: string;

  @IsOptional()
  @IsInt()
  @Min(301)
  @Max(302)
  code?: number;
}

export class UpdateRedirectDto {
  @IsOptional()
  @IsString()
  fromPath?: string;

  @IsOptional()
  @IsString()
  toPath?: string;

  @IsOptional()
  @IsInt()
  @Min(301)
  @Max(302)
  code?: number;
}
