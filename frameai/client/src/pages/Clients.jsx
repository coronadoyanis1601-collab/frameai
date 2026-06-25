import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Mail, Phone, Scan, Plus } from 'lucide-react';
import api from '../lib/api';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clients').then(r => setClients(r.data)).catch(() => setClients([])).finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-dark-900">Clients</h1>
            <p className="text-dark-500 mt-1">{clients.length} client{clients.length > 1 ? 's' : ''} enregistré{clients.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input className="input pl-9 w-60" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Link to="/upload" className="btn-gold"><Plus className="w-4 h-4" />Nouvelle analyse</Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 card">
            <User className="w-16 h-16 mx-auto mb-4 text-beige-300" />
            <h3 className="font-serif text-xl font-semibold text-dark-900 mb-2">Aucun client</h3>
            <p className="text-dark-500 mb-6">Lancez une première analyse pour enregistrer un client</p>
            <Link to="/upload" className="btn-gold inline-flex">Lancer une analyse</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => (
              <div key={c.id} className="card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-dark-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gold-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark-900 truncate">{c.firstName} {c.lastName}</h3>
                    {c.email && <div className="flex items-center gap-1.5 mt-1"><Mail className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" /><span className="text-xs text-dark-500 truncate">{c.email}</span></div>}
                    {c.phone && <div className="flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" /><span className="text-xs text-dark-500">{c.phone}</span></div>}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-beige-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Scan className="w-4 h-4 text-dark-400" />
                    <span className="text-xs text-dark-500">{c.analyses?.length || 0} analyse{(c.analyses?.length || 0) > 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-xs text-dark-400">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
