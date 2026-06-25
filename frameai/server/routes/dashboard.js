const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [totalAnalyses, totalClients, totalReservations, totalProducts, pendingReservations, confirmedReservations] = await Promise.all([
      prisma.analysis.count(),
      prisma.client.count(),
      prisma.reservation.count(),
      prisma.product.count(),
      prisma.reservation.count({ where: { status: 'PENDING' } }),
      prisma.reservation.count({ where: { status: 'CONFIRMED' } })
    ]);

    const recentAnalyses = await prisma.analysis.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { client: true }
    });

    const recentReservations = await prisma.reservation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { client: true, product: true }
    });

    const conversionRate = totalAnalyses > 0 
      ? Math.round((totalReservations / totalAnalyses) * 100) 
      : 0;

    res.json({
      totalAnalyses,
      totalClients,
      totalReservations,
      totalProducts,
      pendingReservations,
      confirmedReservations,
      conversionRate,
      recentAnalyses,
      recentReservations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
