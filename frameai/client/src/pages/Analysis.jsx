import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Scan, Eye, Palette, Scissors, Ruler, Sparkles } from 'lucide-react';
import api from '../lib/api';

const criteria = [
  { icon: Scan, label: 'Forme du visage', delay: 0 },
  { icon: Ruler, label: 'Largeur & proportions', delay: 600 },
  { icon: Palette, label: 'Carnation', delay: 1200 },
  { icon: Scissors, label: 'Couleur des cheveux', delay: 1800 },
  { icon: Eye, label: 'Style général', delay: 2400 },
  { icon: Sparkles, label: 'Taille de monture', delay: 3000 }
];

export default function Analysis() {
  const { clientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState([]);
  const [done, setDone] = useState(false);

  const { photoUrl, clientName } = location.state || {};

  useEffect(() => {
    criteria.forEach((c, i) => {
      setTimeout(() => {
        setCompleted(prev => [...prev, i]);
      }, c.delay + 400);
    });

    // After all criteria, create analysis and redirect
    const totalTime = 3000 + 400 + 1200;
    setTimeout(async () => {
      setDone(true);
      try {
        if (clientId !== 'demo') {
          const res = await api.post('/analyses', { clientId, photoUrl });
          navigate(`/resultats/${res.data.id}`, { state: { analysis: res.data, clientName } });
        } else {
          // Demo mode — redirect with mock data
          navigate('/resultats/demo', { state: { clientName: clientName || 'Client démo', photoUrl } });
        }
      } catch (err) {
        navigate('/resultats/demo', { state: { clientName: clientName || 'Client démo', photoUrl } });
      }
    }, totalTime);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-beige-50 to-white animate-fade-in">
      <div className="max-w-lg w-full text-center">
        {/* Animated eye */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full bg-gold-400/20 animate-ping" />
          <div className="absolute inset-4 rounded-full bg-gold-400/30 animate-pulse" />
          <div className="relative w-32 h-32 bg-dark-900 rounded-full flex items-center justify-center">
            <Eye className="w-12 h-12 text-gold-400" />
          </div>
        </div>

        <h1 className="font-serif text-3xl font-semibold text-dark-900 mb-2">Analyse en cours</h1>
        {clientName && <p className="text-dark-500 mb-10">Analyse morphologique de <strong>{clientName}</strong></p>}

        {/* Criteria list */}
        <div className="card text-left space-y-4">
          {criteria.map((c, i) => (
            <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${completed.includes(i) ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${completed.includes(i) ? 'bg-dark-900' : 'bg-beige-200'}`}>
                <c.icon className={`w-4 h-4 ${completed.includes(i) ? 'text-gold-400' : 'text-dark-400'}`} />
              </div>
              <span className="text-sm font-medium text-dark-900">{c.label}</span>
              {completed.includes(i) && (
                <span className="ml-auto text-xs text-green-600 font-medium animate-fade-in">Analysé ✓</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-sm text-dark-400 mt-6 animate-pulse">Génération de votre planche personnalisée...</p>
      </div>
    </div>
  );
}
