import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Package, Eye } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth.jsx';

const availabilityConfig = {
  SITE_BOUTIQUE: { label: 'Site + Boutique', color: 'bg-green-100 text-green-700' },
  BOUTIQUE_ONLY: { label: 'Boutique', color: 'bg-blue-100 text-blue-700' },
  SITE_ONLY: { label: 'Site internet', color: 'bg-purple-100 text-purple-700' },
  RUPTURE: { label: 'Rupture', color: 'bg-red-100 text-red-700' }
};

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', shape: '', color: '', material: '', weight: '', price: '', score: '', style: '', availability: 'SITE_BOUTIQUE', stock: 0, reason: '' });
  const { isAdmin } = useAuth();

  const load = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.shape.toLowerCase().includes(search.toLowerCase()) ||
    p.color.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    try {
      const data = { ...form, price: parseFloat(form.price), score: parseInt(form.score), stock: parseInt(form.stock) };
      if (editing) {
        await api.put(`/products/${editing.id}`, data);
      } else {
        await api.post('/products', data);
      }
      setShowModal(false);
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, price: p.price.toString(), score: p.score.toString(), stock: p.stock.toString() });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen py-10 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-dark-900">Boutique</h1>
            <p className="text-dark-500 mt-1">{products.length} modèles disponibles</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input className="input pl-9 w-60" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {isAdmin && (
              <button onClick={() => { setEditing(null); setForm({ name: '', shape: '', color: '', material: '', weight: '', price: '', score: '', style: '', availability: 'SITE_BOUTIQUE', stock: 0, reason: '' }); setShowModal(true); }} className="btn-gold">
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige-200 bg-beige-50">
                  {['Modèle', 'Forme', 'Couleur', 'Matière', 'Poids', 'Prix', 'Stock', 'Score', 'Statut', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {filtered.map(p => {
                  const avail = availabilityConfig[p.availability] || availabilityConfig.SITE_BOUTIQUE;
                  return (
                    <tr key={p.id} className="hover:bg-beige-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-8 bg-beige-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Eye className="w-4 h-4 text-beige-400" />
                          </div>
                          <span className="font-medium text-dark-900 text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-dark-600">{p.shape}</td>
                      <td className="px-4 py-3 text-sm text-dark-600">{p.color}</td>
                      <td className="px-4 py-3 text-sm text-dark-600">{p.material}</td>
                      <td className="px-4 py-3 text-sm text-dark-600 whitespace-nowrap">{p.weight}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-dark-900">{p.price}€</td>
                      <td className="px-4 py-3 text-sm text-dark-600">{p.stock}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-gold-600">{p.score}</span>
                          <span className="text-xs text-dark-400">/100</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`badge text-xs ${avail.color}`}>{avail.label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/produit/${p.id}`} className="p-1.5 rounded-lg hover:bg-beige-100 transition-colors"><Eye className="w-4 h-4 text-dark-500" /></Link>
                          {isAdmin && <>
                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-beige-100 transition-colors"><Edit2 className="w-4 h-4 text-dark-500" /></button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="font-serif text-xl font-semibold text-dark-900 mb-6">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Nom', full: true },
                  { key: 'shape', label: 'Forme' },
                  { key: 'color', label: 'Couleur' },
                  { key: 'material', label: 'Matière' },
                  { key: 'weight', label: 'Poids' },
                  { key: 'style', label: 'Style' },
                  { key: 'price', label: 'Prix (€)', type: 'number' },
                  { key: 'score', label: 'Score /100', type: 'number' },
                  { key: 'stock', label: 'Stock', type: 'number' }
                ].map(({ key, label, full, type }) => (
                  <div key={key} className={full ? 'col-span-2' : ''}>
                    <label className="label">{label}</label>
                    <input className="input" type={type || 'text'} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label className="label">Disponibilité</label>
                  <select className="input" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })}>
                    <option value="SITE_BOUTIQUE">Site + Boutique</option>
                    <option value="BOUTIQUE_ONLY">Boutique seulement</option>
                    <option value="SITE_ONLY">Site seulement</option>
                    <option value="RUPTURE">Rupture</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Raison (recommandation)</label>
                  <textarea className="input !h-24 resize-none" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="btn-gold flex-1 justify-center">Enregistrer</button>
                <button onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
