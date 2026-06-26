import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, User, Phone, Mail, ArrowRight, X, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Upload() {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [step, setStep] = useState(1); // 1: photo, 2: client info
  const [clientData, setClientData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const onDrop = useCallback(files => {
    const file = files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      setStep(2);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const handleAnalyse = async () => {
    setLoading(true);
    try {
      // Convert image to base64
      const toBase64 = file => new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const photoBase64 = photo ? await toBase64(photo) : null;

      // Create client
      const clientRes = await api.post('/clients', { ...clientData });
      const client = clientRes.data;

      // Redirect to analysis page
      navigate(`/analyse/${client.id}`, { state: { photoUrl: photoBase64, clientName: `${clientData.firstName} ${clientData.lastName}` } });
    } catch (err) {
      // If not authenticated, use demo mode
      navigate(`/analyse/demo`, { state: { photoUrl: preview, clientName: clientData.firstName || 'Client démo' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-beige-50 to-white animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-semibold text-dark-900 mb-3">Nouvelle analyse</h1>
          <p className="text-dark-600">Importez une photo pour générer la planche client personnalisée</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {['Photo', 'Informations', 'Analyse'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i ? 'bg-dark-900 text-white' : step === i + 1 ? 'bg-gold-500 text-white' : 'bg-beige-200 text-dark-400'}`}>
                {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-dark-900' : 'text-dark-400'}`}>{s}</span>
              {i < 2 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-dark-900' : 'bg-beige-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          {/* Step 1: Photo */}
          {!preview ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${isDragActive ? 'border-gold-400 bg-gold-400/5' : 'border-beige-300 hover:border-gold-400 hover:bg-beige-50'}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-beige-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UploadIcon className="w-8 h-8 text-dark-400" />
              </div>
              <p className="font-medium text-dark-900 mb-2">
                {isDragActive ? 'Déposez la photo ici' : 'Glissez une photo ou cliquez pour importer'}
              </p>
              <p className="text-sm text-dark-400">JPG, PNG, WEBP — max 10 Mo</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Photo preview */}
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-2xl" />
                <button
                  onClick={() => { setPreview(null); setPhoto(null); setStep(1); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                >
                  <X className="w-4 h-4 text-dark-600" />
                </button>
                <div className="absolute bottom-3 left-3 badge-gold">Photo importée ✓</div>
              </div>

              {/* Client info */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-dark-900 mb-4">Informations client (optionnel)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                      <input className="input pl-9" placeholder="Sophie" value={clientData.firstName} onChange={e => setClientData({...clientData, firstName: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Nom</label>
                    <input className="input" placeholder="Martin" value={clientData.lastName} onChange={e => setClientData({...clientData, lastName: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                      <input className="input pl-9" placeholder="sophie@email.com" type="email" value={clientData.email} onChange={e => setClientData({...clientData, email: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                      <input className="input pl-9" placeholder="06 00 00 00 00" value={clientData.phone} onChange={e => setClientData({...clientData, phone: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handleAnalyse} disabled={loading} className="btn-gold w-full justify-center !py-4 text-base">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Analyser mon visage <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
