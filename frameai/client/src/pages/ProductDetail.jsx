import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Globe, ArrowLeft, Package, Feather, Layers, Star } from 'lucide-react';
import api from '../lib/api';

const DEMO_PRODUCTS = {
  '1': { id: '1', name: 'Lincoln View Brown', shape: 'Pantos / ronde carrée douce', color: 'Écaille marron miel', material: 'Acétate', weight: 'Léger — 18 à 25 g', price: 115, score: 98, style: 'Élégant, naturel, masculin', availability: 'SITE_BOUTIQUE', stock: 8, reason: 'Structure le regard sans durcir le visage et reprend les tons chauds des cheveux.' },
  '2': { id: '2', name: 'Benedict View Brown', shape: 'Pantos douce', color: 'Brun transparent', material: 'Acétate', weight: 'Très léger — 17 à 23 g', price: 115, score: 94, style: 'Discret, raffiné, quotidien', availability: 'SITE_BOUTIQUE', stock: 12, reason: 'Monture facile à porter, idéale pour un rendu naturel et chic.' },
  '3': { id: '3', name: 'Henry View Brown', shape: 'Carrée arrondie', color: 'Brun profond', material: 'Acétate', weight: 'Moyen — 22 à 30 g', price: 125, score: 91, style: 'Old money, affirmé', availability: 'BOUTIQUE_ONLY', stock: 5, reason: 'Ajoute du caractère tout en gardant des angles doux.' },
  '4': { id: '4', name: 'Baldwin View Grey', shape: 'Rectangulaire douce', color: 'Gris transparent', material: 'Acétate', weight: 'Moyen — 21 à 28 g', price: 135, score: 88, style: 'Moderne, structuré', availability: 'SITE_ONLY', stock: 7, reason: 'Donne une ligne plus mature et professionnelle sans être trop sombre.' },
  '5': { id: '5', name: 'Zeta View Gold', shape: 'Ronde fine métal', color: 'Doré clair', material: 'Métal', weight: 'Ultra léger — 12 à 18 g', price: 95, score: 85, style: 'Fin, lumineux, minimal', availability: 'SITE_BOUTIQUE', stock: 15, reason: 'Parfait pour un style discret, léger et lumineux.' }
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        setProduct(DEMO_PRODUCTS[id] || DEMO_PRODUCTS['1']);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center"><p>Produit non trouvé</p></div>;

  const scoreColor = product.score >= 90 ? '#c9a84c' : '#8b9467';

  return (
    <div className="min-h-screen py-10 px-4 bg-beige-50 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-500 hover:text-dark-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="card flex items-center justify-center min-h-72">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-beige-100 to-beige-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-16 h-16 text-beige-400" />
              </div>
              <p className="text-sm text-dark-400">Image produit à venir</p>
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="badge-gold">Score {product.score}/100</span>
                <span className="badge bg-beige-100 text-dark-600">{product.style}</span>
              </div>
              <h1 className="font-serif text-3xl font-semibold text-dark-900 mb-1">{product.name}</h1>
              <p className="text-dark-500">{product.shape}</p>
            </div>

            <div className="text-3xl font-bold text-dark-900">{product.price} €</div>

            {/* Specs */}
            <div className="card grid grid-cols-2 gap-4">
              {[
                { icon: Layers, label: 'Matière', value: product.material },
                { icon: Feather, label: 'Poids', value: product.weight },
                { icon: Star, label: 'Couleur', value: product.color },
                { icon: Package, label: 'Stock', value: `${product.stock} disponible${product.stock > 1 ? 's' : ''}` }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3.5 h-3.5 text-gold-500" />
                    <span className="text-xs text-dark-400 uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="text-sm font-medium text-dark-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Reason */}
            <div className="card bg-beige-50 border-beige-200">
              <p className="text-xs text-dark-400 uppercase tracking-wider mb-2">Pourquoi ce modèle ?</p>
              <p className="text-sm text-dark-700 leading-relaxed">{product.reason}</p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              {(product.availability === 'SITE_BOUTIQUE' || product.availability === 'BOUTIQUE_ONLY') && (
                <button className="btn-primary justify-center !py-4">
                  <ShoppingBag className="w-5 h-5" />
                  Réserver en boutique
                </button>
              )}
              {(product.availability === 'SITE_BOUTIQUE' || product.availability === 'SITE_ONLY') && (
                <button className="btn-outline justify-center !py-4">
                  <Globe className="w-5 h-5" />
                  Voir sur le site
                </button>
              )}
              {product.availability === 'RUPTURE' && (
                <div className="text-center py-4 text-red-500 font-medium">Rupture de stock</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
