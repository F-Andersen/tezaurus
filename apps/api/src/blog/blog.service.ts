import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlogPostStatus } from '@prisma/client';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog-post.dto';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/blog-category.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CreateBlogCategoryDto) {
    return this.prisma.blogCategory.create({ data: dto });
  }

  async findAllCategories() {
    return this.prisma.blogCategory.findMany({ orderBy: { slug: 'asc' } });
  }

  async updateCategory(id: string, dto: UpdateBlogCategoryDto) {
    return this.prisma.blogCategory.update({ where: { id }, data: dto });
  }

  async removeCategory(id: string) {
    await this.prisma.blogCategory.delete({ where: { id } });
    return { success: true };
  }

  async createPost(dto: CreateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug already exists');
    const data = { ...dto, tags: dto.tags ?? [], status: dto.status ?? BlogPostStatus.draft };
    if (dto.status === BlogPostStatus.published && !dto.publishedAt) {
      (data as { publishedAt: Date }).publishedAt = new Date();
    }
    return this.prisma.blogPost.create({ data });
  }

  async findAllPosts() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  async findOnePost(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async updatePost(id: string, dto: UpdateBlogPostDto) {
    if (dto.slug) {
      const existing = await this.prisma.blogPost.findFirst({ where: { slug: dto.slug, NOT: { id } } });
      if (existing) throw new ConflictException('Slug already exists');
    }
    const data = { ...dto, tags: dto.tags ?? undefined };
    if (dto.status === BlogPostStatus.published) {
      const current = await this.prisma.blogPost.findUnique({ where: { id } });
      if (current?.status !== BlogPostStatus.published) {
        (data as { publishedAt: Date }).publishedAt = dto.publishedAt ?? new Date();
      }
    }
    return this.prisma.blogPost.update({ where: { id }, data });
  }

  async removePost(id: string) {
    await this.prisma.blogPost.delete({ where: { id } });
    return { success: true };
  }
}
