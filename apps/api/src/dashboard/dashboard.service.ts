import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalLeads,
      newLeads,
      inProgressLeads,
      totalClinics,
      publishedClinics,
      totalPosts,
      publishedPosts,
      totalPages,
      totalUsers,
      recentLeads,
    ] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { status: 'NEW' } }),
      this.prisma.lead.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.clinic.count(),
      this.prisma.clinic.count({ where: { published: true } }),
      this.prisma.blogPost.count(),
      this.prisma.blogPost.count({ where: { status: 'published' } }),
      this.prisma.page.count(),
      this.prisma.user.count(),
      this.prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          name: true,
          phone: true,
          email: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const leadsToday = await this.prisma.lead.count({
      where: { createdAt: { gte: today } },
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const leadsThisWeek = await this.prisma.lead.count({
      where: { createdAt: { gte: weekAgo } },
    });

    return {
      leads: { total: totalLeads, new: newLeads, inProgress: inProgressLeads, today: leadsToday, thisWeek: leadsThisWeek },
      clinics: { total: totalClinics, published: publishedClinics },
      blog: { total: totalPosts, published: publishedPosts },
      pages: { total: totalPages },
      users: { total: totalUsers },
      recentLeads,
    };
  }
}
