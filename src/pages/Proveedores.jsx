import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GiScrollUnfurled, GiHandTruck, GiEnvelope, 
  GiPhone, GiQuill, GiCrystalBall, GiCardExchange 
} from 'react-icons/gi';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FUNCIÓN MÍSTICA PARA TRAER LOS DATOS ---
  const fetchProveedores = async () => {
    try {
      setLoading(true);
      // Reemplaza con la ruta real de tu servidor en IONOS
      const response = await fetch('https://proyectodnd.gymnast.com.mx/backend/api/get_proveedores.php'); 
      
      if (!response.ok) {
        throw new Error('El pergamino de datos no pudo ser entregado.');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setProveedores(data);
    } catch (err) {
      setError(err.message);
      console.error("Error en el Censo de Proveedores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return (
    <div className="p-10 max-w-[1600px] mx-auto min-h-screen">
      {/* Cabecera */}
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
          className="bg-[#b45309] text-[#f3e5ab] px-8 py-4 rounded-sm shadow-xl font-bold uppercase text-xs tracking-widest border-2 border-[#f3e5ab]/20"
        >
          Inscribir Nuevo Gremio
        </motion.button>
      </header>

      {/* Manejo de Estados Visuales */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <GiCrystalBall className="text-6xl text-[#8b5e3c] animate-spin mb-4" />
          <p className="text-[#f3e5ab] font-serif italic text-xl">Consultando los registros de comercio...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border-2 border-red-500/50 p-6 text-red-200 font-mono text-center">
          <p>⚠️ ERROR CRÍTICO: {error}</p>
          <button onClick={fetchProveedores} className="mt-4 underline hover:text-white">Reintentar ritual de carga</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proveedores.length > 0 ? (
            proveedores.map((prov) => (
              <ProveedorCard key={prov.id_proveedor} proveedor={prov} />
            ))
          ) : (
            <p className="text-[#8b5e3c] italic col-span-full text-center">No se han encontrado gremios registrados en este reino.</p>
          )}
        </div>
      )}
      
      {/* Decoración de fondo */}
      <div className="fixed bottom-10 right-10 opacity-10 pointer-events-none">
        <GiCrystalBall className="text-[20rem] text-[#8b5e3c]" />
      </div>
    </div>
  );
};

// Componente de Tarjeta (Se mantiene igual, solo asegúrate que las keys coincidan con la BD)
const ProveedorCard = ({ proveedor }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-[#f3e5ab] border-2 border-[#8b5e3c] p-1 shadow-[0_10px_20px_rgba(0,0,0,0.3)] relative overflow-hidden"
    style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}
  >
    <div className="border border-[#8b5e3c]/30 p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <GiScrollUnfurled className="text-4xl text-[#8b5e3c]/40" />
          <span className="text-[10px] font-bold text-[#8b5e3c] uppercase tracking-widest bg-white/30 px-2 py-1">
            ID: {String(proveedor.id_proveedor).padStart(3, '0')}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-[#2a1b0c] mb-6 leading-none" style={{ fontFamily: "'Cinzel', serif" }}>
          {proveedor.nombre}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[#5d4037]">
            <GiPhone className="text-[#b45309]" />
            <span className="font-mono text-sm">{proveedor.telefono || 'Sin cuervo de contacto'}</span>
          </div>
          <div className="flex items-center gap-3 text-[#5d4037]">
            <GiEnvelope className="text-[#b45309]" />
            <span className="font-mono text-sm italic">{proveedor.email || 'Sin dirección postal'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[#8b5e3c]/20 flex justify-end gap-4">
        <button title="Ver Suministros" className="text-[#8b5e3c] hover:text-[#b45309] transition-colors">
          <GiCardExchange className="text-2xl" />
        </button>
        <button title="Editar Pergamino" className="text-[#8b5e3c] hover:text-[#b45309] transition-colors">
          <GiQuill className="text-2xl" />
        </button>
      </div>
    </div>
    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8b5e3c] rotate-45" />
  </motion.div>
);

export default Proveedores;