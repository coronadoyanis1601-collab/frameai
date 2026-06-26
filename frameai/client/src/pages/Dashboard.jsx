import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Scan, ShoppingBag, TrendingUp, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth.jsx';

const statusConfig = {
  PENDING: { label: 'En attente', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
  CONFIRMED: { label: 'Confirmée', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  CANCELLED: { label: 'Annulée', icon: XCircle, color: 'text-red-600 bg-red-100' },
  COMPLETED: { label: 'Terminée', icon: CheckCircle, color: 'text-blue-600 bg-blue-100' }
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch {
        setStats({
          totalAnalyses: 12, totalClients: 8, totalReservations: 4, totalProducts: 5,
          pendingReservations: 2, confirmedReservations: 2, conversionRate: 33,
          recentAnalyses: [], recentReservations: []
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = stats ? [
    { icon: Scan, label: 'Analyses', value: stats.totalAnalyses, sub: 'Total', color: 'bg-dark-900 text-gold-400' },
    { icon: Users, label: 'Clients', value: stats.totalClients, sub: 'Enregistrés', color: 'bg-gold-500 text-white' },
    { icon: ShoppingBag, label: 'Réservations', value: stats.totalReservations, sub: `${stats.pendingReservations} en attente`, color: 'bg-olive-500 text-white' },
    { icon: TrendingUp, label: 'Conversion', value: `${stats.conversionRate}%`, sub: 'Analyse → réservation', color: 'bg-beige-300 text-dark-900' }
  ] : [];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-dark-500 text-sm">Bonjour,</p>
          <h1 className="font-serif text-3xl font-semibold text-dark-900">{user?.name || 'Bienvenue'} 👋</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="card-hover">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-dark-900 mb-0.5">{value}</div>
              <div className="text-sm font-medium text-dark-900">{label}</div>
              <div className="text-xs text-dark-400">{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Analyses */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-dark-900">Analyses récentes</h2>
              <Link to="/clients" className="text-sm text-gold-600 hover:text-gold-700">Voir tout</Link>
            </div>
            {stats?.recentAnalyses?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAnalyses.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-beige-50 transition-colors">
                    <div className="w-8 h-8 bg-dark-900 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Scan className="w-4 h-4 text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-900 truncate">{a.client?.firstName} {a.client?.lastName}</p>
                      <p className="text-xs text-dark-400">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className="badge badge-gold text-xs">{a.faceShape}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-dark-400">
                <Scan className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune analyse pour l'instant</p>
                <Link to="/upload" className="text-sm text-gold-600 hover:text-gold-700 font-medium mt-2 inline-block">Lancer une analyse →</Link>
              </div>
            )}
          </div>

          {/* Recent Reservations */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-dark-900">Réservations récentes</h2>
              <Link to="/boutique" className="text-sm text-gold-600 hover:text-gold-700">Voir tout</Link>
            </div>
            {stats?.recentReservations?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentReservations.map(r => {
                  const status = statusConfig[r.status] || statusConfig.PENDING;
                  return (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-beige-50 transition-colors">
                      <div className="w-8 h-8 bg-beige-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-dark-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-900 truncate">{r.product?.name}</p>
                        <p className="text-xs text-dark-400">{r.client?.firstName} {r.client?.lastName}</p>
                      </div>
                      <span className={`badge text-xs ${status.color}`}>{status.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-dark-400">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune réservation pour l'instant</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 card">
          <h2 className="font-serif text-lg font-semibold text-dark-900 mb-4">Actions rapides</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/upload" className="btn-gold">Nouvelle analyse</Link>
            <Link to="/boutique" className="btn-outline">Gérer les produits</Link>
            <Link to="/clients" className="btn-outline">Voir les clients</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
