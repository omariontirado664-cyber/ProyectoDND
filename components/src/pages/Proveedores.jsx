import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiScrollUnfurled, GiHandTruck, GiEnvelope, 
  GiPhone, GiQuill, GiCrystalBall, GiCardExchange, GiTrashCan
} from 'react-icons/gi';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState({ nombre: '', telefono: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const API_URL = 'https://proyectodnd.gymnast.com.mx/backend/api/get_proveedores.php';
  const CRUD_URL = 'https://proyectodnd.gymnast.com.mx/backend/api/crud_proveedores.php';

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL); 
      if (!response.ok) throw new Error('El pergamino de datos no pudo ser entregado.');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setProveedores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };







  useEffect(() => { fetchProveedores(); }, []);

  // --- FUNCIONES CRUD ---
const handleSubmit = async (e) => {
  e.preventDefault();
  const action = isEditing ? 'update' : 'create';
  
  if (isSubmitting) return; 
  setIsSubmitting(true); 

  try {
    const response = await fetch(CRUD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...currentProveedor })
    });

    // 1. Convertimos la respuesta a JSON (independientemente de si fue error o éxito)
    const res = await response.json();

    // 2. Si la respuesta no fue "ok" (el Trigger falló), lanzamos el error manualmente
    if (!response.ok) {
      throw new Error(res.error || "Falla en el sello místico");
    }

    // 3. Si todo salió bien
    if (res.success) {
      alert("¡Gremio registrado en el Censo!"); // Un pequeño mensaje de éxito no cae mal
      setIsModalOpen(false);
      setCurrentProveedor({ nombre: '', telefono: '', email: '' });
      fetchProveedores();
    }
  } catch (err) { 
    // Aquí es donde aparecerá: "Error en el ritual: Error: El número de teléfono..."
    alert("Error en el ritual: " + err.message); 
  } finally {
    setIsSubmitting(false); 
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas desterrar a este gremio?")) return;
    try {
      await fetch(CRUD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id_proveedor: id })
      });
      fetchProveedores();
    } catch (err) { console.error(err); }
  };

  const openModal = (prov = { nombre: '', telefono: '', email: '' }) => {
    setCurrentProveedor(prov);
    setIsEditing(!!prov.id_proveedor);
    setIsModalOpen(true);
  };





  return (
    <div className="p-10 max-w-[1600px] mx-auto min-h-screen relative">
      <header className="mb-12 border-b-2 border-[#8b5e3c]/20 pb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2 opacity-60">
            <GiHandTruck className="text-[#8b5e3c]" />
            <span className="text-[10px] uppercase font-bold text-[#e2d7bf] tracking-[0.5em]" style={{ fontFamily: "'Cinzel', serif" }}>
              Logística del Reino
            </span>
          </div>
          <h1 className="text-6xl font-black text-[#f3e5ab] tracking-tighter"
              style={{ fontFamily: "'Cinzel Decorative', cursive", textShadow: '2px 2px 0 #8b5e3c' }}>
            PROVEEDORES
          </h1>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="bg-[#b45309] text-[#f3e5ab] px-8 py-4 rounded-sm shadow-xl font-bold uppercase text-xs tracking-widest border-2 border-[#f3e5ab]/20"
        >
          Inscribir Nuevo Gremio
        </motion.button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 uppercase tracking-widest text-[#f3e5ab]">
          <GiCrystalBall className="text-6xl animate-spin mb-4" /> Consultando registros...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proveedores.map((prov) => (
            <ProveedorCard 
              key={prov.id_proveedor} 
              proveedor={prov} 
              onEdit={() => openModal(prov)} 
              onDelete={() => handleDelete(prov.id_proveedor)}
            />
          ))}
        </div>
      )}

      {/* --- MODAL ESTILO PERGAMINO --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#f3e5ab] p-8 border-4 border-[#8b5e3c] shadow-2xl max-w-md w-full relative overflow-hidden"
              style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}
            >
              <h2 className="text-3xl font-bold text-[#2a1b0c] mb-6 border-b border-[#8b5e3c]/30 pb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                {isEditing ? 'Editar Gremio' : 'Nuevo Registro'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  className="w-full p-3 bg-white/50 border border-[#8b5e3c]/50 focus:outline-none focus:border-[#b45309]" 
                  placeholder="Nombre del Gremio"
                  value={currentProveedor.nombre}
                  onChange={(e) => setCurrentProveedor({...currentProveedor, nombre: e.target.value})}
                  required 
                />
                <input 
                  className="w-full p-3 bg-white/50 border border-[#8b5e3c]/50 focus:outline-none focus:border-[#b45309]" 
                  placeholder="Teléfono (Cuervo)"
                  value={currentProveedor.telefono}
                  onChange={(e) => setCurrentProveedor({...currentProveedor, telefono: e.target.value})}
                />
                <input 
                  className="w-full p-3 bg-white/50 border border-[#8b5e3c]/50 focus:outline-none focus:border-[#b45309]" 
                  placeholder="Email (Dirección Postal)"
                  value={currentProveedor.email}
                  onChange={(e) => setCurrentProveedor({...currentProveedor, email: e.target.value})}
                />
                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#b45309] text-[#f3e5ab] py-3 font-bold uppercase text-xs">{isSubmitting ? 'Inscribiendo...' : 'Sellar Pergamino'}</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-[#8b5e3c] text-[#8b5e3c] font-bold uppercase text-xs">Cancelar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProveedorCard = ({ proveedor, onEdit, onDelete }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-[#f3e5ab] border-2 border-[#8b5e3c] p-6 shadow-lg relative group"
    style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}
  >
    <div className="flex justify-between items-start mb-4">
      <GiScrollUnfurled className="text-4xl text-[#8b5e3c]/30" />
      <div className="flex gap-2">
        <button onClick={onEdit} className="text-[#8b5e3c] hover:text-[#b45309]"><GiQuill className="text-2xl" /></button>
        <button onClick={onDelete} className="text-[#8b5e3c] hover:text-red-700"><GiTrashCan className="text-2xl" /></button>
      </div>
    </div>
    <h2 className="text-xl font-bold text-[#2a1b0c] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>{proveedor.nombre}</h2>
    <div className="text-sm space-y-2 text-[#5d4037]">
      <div className="flex items-center gap-2"><GiPhone className="text-[#b45309]" /> {proveedor.telefono || 'N/A'}</div>
      <div className="flex items-center gap-2"><GiEnvelope className="text-[#b45309]" /> {proveedor.email || 'N/A'}</div>
    </div>
  </motion.div>
);

export default Proveedores;
