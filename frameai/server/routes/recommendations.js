const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const recs = await prisma.recommendation.findMany({
      include: { product: true, analysis: { include: { client: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(recs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analysis/:analysisId', async (req, res) => {
  try {
    const recs = await prisma.recommendation.findMany({
      where: { analysisId: req.params.analysisId },
      include: { product: true },
      orderBy: { score: 'desc' }
    });
    res.json(recs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
