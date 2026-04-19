import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { PrismaService } from '../prisma/prisma.service';
import { BlogPostStatus } from '@prisma/client';

const postRow = {
  id: 'p1',
  slug: 'top-5',
  categoryId: 'cat1',
  titleUa: 'Топ-5',
  titleEn: 'Top 5',
  excerptUa: null,
  excerptEn: null,
  bodyUa: null,
  bodyEn: null,
  coverImage: null,
  metaTitleUa: null,
  metaTitleEn: null,
  metaDescriptionUa: null,
  metaDescriptionEn: null,
  tags: [],
  status: BlogPostStatus.draft,
  publishedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BlogService', () => {
  let service: BlogService;
  const prisma = {
    blogCategory: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    blogPost: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(BlogService);
    jest.clearAllMocks();
  });

  describe('categories', () => {
    it('creates category', async () => {
      prisma.blogCategory.create.mockResolvedValue({ id: 'cat1', slug: 'medical-tourism' });
      await service.createCategory({ slug: 'medical-tourism', nameUa: 'Медичний', nameEn: 'Medical' });
      expect(prisma.blogCategory.create).toHaveBeenCalled();
    });

    it('lists categories sorted by slug asc', async () => {
      prisma.blogCategory.findMany.mockResolvedValue([]);
      await service.findAllCategories();
      expect(prisma.blogCategory.findMany).toHaveBeenCalledWith({ orderBy: { slug: 'asc' } });
    });

    it('removes category', async () => {
      prisma.blogCategory.delete.mockResolvedValue({ id: 'cat1' });
      const res = await service.removeCategory('cat1');
      expect(res).toEqual({ success: true });
    });
  });

  describe('createPost()', () => {
    it('throws ConflictException when slug already exists', async () => {
      prisma.blogPost.findUnique.mockResolvedValue(postRow);
      await expect(service.createPost({ slug: 'top-5' })).rejects.toBeInstanceOf(ConflictException);
    });

    it('defaults tags to [] and status to draft', async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      prisma.blogPost.create.mockResolvedValue(postRow);
      await service.createPost({ slug: 'top-5' });
      expect(prisma.blogPost.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ tags: [], status: BlogPostStatus.draft }),
      });
    });

    it('sets publishedAt when creating a published post without one', async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      prisma.blogPost.create.mockResolvedValue(postRow);
      await service.createPost({ slug: 'top-5', status: BlogPostStatus.published });
      const arg = prisma.blogPost.create.mock.calls[0][0];
      expect(arg.data.publishedAt).toBeInstanceOf(Date);
    });
  });

  describe('findAllPosts()', () => {
    it('includes category and orders by createdAt desc', async () => {
      prisma.blogPost.findMany.mockResolvedValue([]);
      await service.findAllPosts();
      expect(prisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          include: { category: true },
        }),
      );
    });
  });

  describe('findOnePost()', () => {
    it('throws NotFoundException when missing', async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      await expect(service.findOnePost('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updatePost()', () => {
    it('throws ConflictException when renaming to an existing slug', async () => {
      prisma.blogPost.findFirst.mockResolvedValue({ ...postRow, id: 'other' });
      await expect(service.updatePost('p1', { slug: 'top-5' })).rejects.toBeInstanceOf(ConflictException);
    });

    it('sets publishedAt when transitioning from draft to published', async () => {
      prisma.blogPost.findUnique.mockResolvedValue({ ...postRow, status: BlogPostStatus.draft });
      prisma.blogPost.update.mockResolvedValue(postRow);
      await service.updatePost('p1', { status: BlogPostStatus.published });
      const arg = prisma.blogPost.update.mock.calls[0][0];
      expect(arg.data.publishedAt).toBeInstanceOf(Date);
    });

    it('does not override publishedAt when already published', async () => {
      prisma.blogPost.findUnique.mockResolvedValue({
        ...postRow,
        status: BlogPostStatus.published,
        publishedAt: new Date('2024-01-01'),
      });
      prisma.blogPost.update.mockResolvedValue(postRow);
      await service.updatePost('p1', { status: BlogPostStatus.published });
      const arg = prisma.blogPost.update.mock.calls[0][0];
      expect(arg.data.publishedAt).toBeUndefined();
    });
  });

  describe('removePost()', () => {
    it('calls delete and returns success', async () => {
      prisma.blogPost.delete.mockResolvedValue(postRow);
      const res = await service.removePost('p1');
      expect(res).toEqual({ success: true });
    });
  });
});
