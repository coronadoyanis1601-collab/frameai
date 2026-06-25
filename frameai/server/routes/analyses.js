const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

// Profil MVP simulé
const MVP_PROFILE = {
  faceShape: 'Ovale légèrement anguleux',
  skinTone: 'Chaude neutre',
  hairColor: 'Châtain blond',
  recommendedShapes: 'Pantos douce, Rectangulaire arrondie, Ronde métal fine',
  recommendedColors: 'Écaille claire, Marron miel, Champagne transparent, Vert olive, Doré fin'
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const analyses = await prisma.analysis.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: true, recommendations: { include: { product: true } } }
    });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id: req.params.id },
      include: { client: true, recommendations: { include: { product: true }, orderBy: { score: 'desc' } } }
    });
    if (!analysis) return res.status(404).json({ error: 'Analyse non trouvée' });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer une analyse + recommandations MVP
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { clientId, photoUrl } = req.body;

    // Analyse simulée MVP
    const analysis = await prisma.analysis.create({
      data: {
        clientId,
        photoUrl,
        ...MVP_PROFILE,
        status: 'COMPLETED'
      }
    });

    // Récupérer tous les produits et créer les recommandations
    const products = await prisma.product.findMany({ orderBy: { score: 'desc' } });
    
    const recommendations = await Promise.all(
      products.map(product =>
        prisma.recommendation.create({
          data: {
            analysisId: analysis.id,
            productId: product.id,
            score: product.score,
            reason: product.reason
          }
        })
      )
    );

    const fullAnalysis = await prisma.analysis.findUnique({
      where: { id: analysis.id },
      include: { client: true, recommendations: { include: { product: true }, orderBy: { score: 'desc' } } }
    });

    res.status(201).json(fullAnalysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
