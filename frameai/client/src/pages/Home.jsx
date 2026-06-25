import { Link } from 'react-router-dom';
import { Eye, Upload, Scan, Star, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const steps = [
  { icon: Upload, label: 'Import photo', desc: 'Importez une photo du visage du client en quelques secondes.' },
  { icon: Scan, label: 'Analyse visage', desc: 'Notre IA analyse la morphologie, la carnation et le style.' },
  { icon: Star, label: 'Recommandation', desc: 'Recevez une planche personnalisée avec les meilleures montures.' },
  { icon: Calendar, label: 'Réservation', desc: 'Réservez en boutique ou achetez en ligne directement.' }
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-beige-50 via-beige-100 to-white" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-olive-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span className="text-sm font-medium text-gold-700">Analyse morphologique IA</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-semibold text-dark-900 leading-tight mb-6">
              Frame<span className="text-gold-500">AI</span>
            </h1>

            <p className="text-xl sm:text-2xl text-dark-600 font-light leading-relaxed mb-4">
              La planche client qui trouve les lunettes
            </p>
            <p className="text-xl sm:text-2xl text-dark-900 font-medium leading-relaxed mb-10">
              qui vont vraiment au visage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/upload" className="btn-primary text-base !px-8 !py-4">
                Lancer une analyse
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-outline text-base !px-8 !py-4">
                Voir une planche démo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-dark-900 mb-4">Comment ça marche</h2>
            <p className="text-dark-600 text-lg max-w-xl mx-auto">Un processus simple, rapide et professionnel pour chaque client.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="card-hover group text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 bg-dark-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500 transition-colors">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Étape {i + 1}</div>
                <h3 className="font-serif text-lg font-semibold text-dark-900 mb-2">{step.label}</h3>
                <p className="text-sm text-dark-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-white mb-6">
            Prêt à transformer l'expérience de vos clients ?
          </h2>
          <p className="text-beige-200 text-lg mb-10">
            Rejoignez les opticiens qui utilisent FrameAI pour offrir un conseil personnalisé et premium.
          </p>
          <Link to="/upload" className="btn-gold text-base !px-10 !py-4">
            Lancer ma première analyse
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
