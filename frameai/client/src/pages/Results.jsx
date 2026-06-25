import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Share2, Download, Star, ChevronRight, Eye, Palette, User } from 'lucide-react';
import api from '../lib/api';

const DEMO_ANALYSIS = {
  faceShape: 'Ovale légèrement anguleux',
  skinTone: 'Chaude neutre',
  hairColor: 'Châtain blond',
  recommendedShapes: 'Pantos douce, Rectangulaire arrondie, Ronde métal fine',
  recommendedColors: 'Écaille claire, Marron miel, Champagne transparent, Vert olive, Doré fin',
  recommendations: [
    { score: 98, productName: 'Lincoln View Brown', product: { id: '1', name: 'Lincoln View Brown', shape: 'Pantos / ronde carrée douce', color: 'Écaille marron miel', price: 115, availability: 'SITE_BOUTIQUE' }, reason: 'Structure le regard sans durcir le visage et reprend les tons chauds des cheveux.' },
    { score: 94, productName: 'Benedict View Brown', product: { id: '2', name: 'Benedict View Brown', shape: 'Pantos douce', color: 'Brun transparent', price: 115, availability: 'SITE_BOUTIQUE' }, reason: 'Monture facile à porter, idéale pour un rendu naturel et chic.' },
    { score: 91, productName: 'Henry View Brown', product: { id: '3', name: 'Henry View Brown', shape: 'Carrée arrondie', color: 'Brun profond', price: 125, availability: 'BOUTIQUE_ONLY' }, reason: 'Ajoute du caractère tout en gardant des angles doux.' },
    { score: 88, productName: 'Baldwin View Grey', product: { id: '4', name: 'Baldwin View Grey', shape: 'Rectangulaire douce', color: 'Gris transparent', price: 135, availability: 'SITE_ONLY' }, reason: 'Donne une ligne plus mature et professionnelle sans être trop sombre.' },
    { score: 85, productName: 'Zeta View Gold', product: { id: '5', name: 'Zeta View Gold', shape: 'Ronde fine métal', color: 'Doré clair', price: 95, availability: 'SITE_BOUTIQUE' }, reason: 'Parfait pour un style discret, léger et lumineux.' }
  ]
};

const availabilityLabel = {
  SITE_BOUTIQUE: { label: 'Site + Boutique', color: 'bg-green-100 text-green-700' },
  BOUTIQUE_ONLY: { label: 'Boutique', color: 'bg-blue-100 text-blue-700' },
  SITE_ONLY: { label: 'Site internet', color: 'bg-purple-100 text-purple-700' },
  RUPTURE: { label: 'Rupture', color: 'bg-red-100 text-red-700' }
};

const ScoreRing = ({ score }) => {
  const color = score >= 90 ? '#c9a84c' : score >= 80 ? '#8b9467' : '#ceb89a';
  return (
    <div className="relative w-14 h-14">
      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
        <circle cx="28" cy="28" r="22" fill="none" stroke="#f5f0e8" strokeWidth="4" />
        <circle cx="28" cy="28" r="22" fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${(score / 100) * 138} 138`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-dark-900">{score}</span>
      </div>
    </div>
  );
};

export default function Results() {
  const { analysisId } = useParams();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const clientName = location.state?.clientName || 'Client';
  const photoUrl = location.state?.photoUrl;

  useEffect(() => {
    const load = async () => {
      if (analysisId === 'demo') {
        setAnalysis(DEMO_ANALYSIS);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/analyses/${analysisId}`);
        setAnalysis(res.data);
      } catch {
        setAnalysis(DEMO_ANALYSIS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [analysisId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4 bg-beige-50 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="badge-gold mb-2">Planche client</div>
            <h1 className="font-serif text-3xl font-semibold text-dark-900">{clientName}</h1>
            <p className="text-dark-500 text-sm mt-1">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline !py-2 !px-4 text-sm">
              <Share2 className="w-4 h-4" />
              Partager
            </button>
            <button className="btn-primary !py-2 !px-4 text-sm">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile */}
          <div className="space-y-4">
            {/* Photo */}
            <div className="card">
              {photoUrl ? (
                <img src={photoUrl} alt={clientName} className="w-full h-48 object-cover rounded-2xl mb-4" />
              ) : (
                <div className="w-full h-48 bg-beige-100 rounded-2xl flex items-center justify-center mb-4">
                  <User className="w-16 h-16 text-beige-300" />
                </div>
              )}
              <h3 className="font-serif text-lg font-semibold text-dark-900 mb-1">{clientName}</h3>
              <p className="text-sm text-dark-500">Profil morphologique</p>
            </div>

            {/* Profile details */}
            <div className="card space-y-4">
              <h3 className="font-medium text-dark-900 flex items-center gap-2"><Eye className="w-4 h-4 text-gold-500" />Profil détecté</h3>
              <div className="space-y-3">
                {[
                  { label: 'Forme du visage', value: analysis?.faceShape },
                  { label: 'Carnation', value: analysis?.skinTone },
                  { label: 'Cheveux', value: analysis?.hairColor }
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-dark-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-medium text-dark-900 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations summary */}
            <div className="card space-y-3">
              <h3 className="font-medium text-dark-900 flex items-center gap-2"><Palette className="w-4 h-4 text-gold-500" />Conseils</h3>
              <div>
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Formes conseillées</p>
                <p className="text-sm text-dark-900">{analysis?.recommendedShapes}</p>
              </div>
              <div>
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Couleurs conseillées</p>
                <p className="text-sm text-dark-900">{analysis?.recommendedColors}</p>
              </div>
            </div>
          </div>

          {/* Right: Recommendations */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-dark-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-gold-500" />
              Top {analysis?.recommendations?.length || 5} modèles recommandés
            </h2>

            {analysis?.recommendations?.map((rec, i) => {
              const avail = availabilityLabel[rec.product?.availability] || availabilityLabel.SITE_BOUTIQUE;
              return (
                <Link key={i} to={`/produit/${rec.product?.id}`} className="card-hover block group">
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-beige-100 flex items-center justify-center text-sm font-bold text-dark-600">
                      {i + 1}
                    </div>

                    {/* Product image placeholder */}
                    <div className="flex-shrink-0 w-20 h-14 bg-gradient-to-br from-beige-100 to-beige-200 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-beige-400" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-dark-900 group-hover:text-gold-600 transition-colors">{rec.productName || rec.product?.name}</h4>
                          <p className="text-xs text-dark-500 mt-0.5">{rec.product?.shape} · {rec.product?.color}</p>
                        </div>
                        <ScoreRing score={rec.score} />
                      </div>
                      <p className="text-sm text-dark-600 mt-2 leading-relaxed">{rec.reason}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`badge text-xs ${avail.color}`}>{avail.label}</span>
                        <span className="text-sm font-semibold text-dark-900">{rec.product?.price}€</span>
                        <ChevronRight className="w-4 h-4 text-dark-400 ml-auto group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
