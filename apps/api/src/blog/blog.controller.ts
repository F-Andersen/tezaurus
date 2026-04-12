import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog-post.dto';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/blog-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/blog')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
export class BlogController {
  constructor(private blog: BlogService) {}

  @Post('categories')
  createCategory(@Body() dto: CreateBlogCategoryDto) {
    return this.blog.createCategory(dto);
  }

  @Get('categories')
  findAllCategories() {
    return this.blog.findAllCategories();
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateBlogCategoryDto) {
    return this.blog.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  removeCategory(@Param('id') id: string) {
    return this.blog.removeCategory(id);
  }

  @Post('posts')
  createPost(@Body() dto: CreateBlogPostDto) {
    return this.blog.createPost(dto);
  }

  @Get('posts')
  findAllPosts() {
    return this.blog.findAllPosts();
  }

  @Get('posts/:id')
  findOnePost(@Param('id') id: string) {
    return this.blog.findOnePost(id);
  }

  @Patch('posts/:id')
  updatePost(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blog.updatePost(id, dto);
  }

  @Delete('posts/:id')
  removePost(@Param('id') id: string) {
    return this.blog.removePost(id);
  }
}
