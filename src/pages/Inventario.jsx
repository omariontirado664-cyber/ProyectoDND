import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiChest, GiCoins, GiSandsOfTime, GiMagnifyingGlass, 
  GiClick, GiBroadsword, GiCrystalWand, GiExplosiveMaterials,
  GiBookCover, GiScrollUnfurled, GiHammerBreak, GiBackpack
} from 'react-icons/gi';

const Inventario = () => {
  const [busqueda, setBusqueda] = useState('');
  const [productosData, setProductosData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cambia esta URL por la de tu get_productos.php
    fetch('http://proyectodnd.gymnast.com.mx/backend/api/get_productos.php') 
      .then(res => res.json())
      .then(data => {
        setProductosData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getCategoryIcon = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('arma')) return <GiBroadsword />;
    if (c.includes('magia')) return <GiCrystalWand />;
    if (c.includes('consumible')) return <GiExplosiveMaterials />;
    return <GiBackpack />;
  };

  if (loading) return <GrimoireLoaderMini />;

  return (
    <div className="p-10 relative z-10 max-w-[1750px] mx-auto overflow-hidden" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      
      {/* HEADER AL ESTILO VANGUARD */}
      <header className="flex justify-between items-start mb-12 px-6 pb-6 border-b-2 border-[#8b5e3c]/20">
        <div>
          <div className="flex items-center gap-3 mb-1 opacity-60">
              <GiBookCover className="text-[#8b5e3c]" />
              <span className="text-[10px] uppercase font-bold text-[#e2d7bf] tracking-[0.5em]" style={{ fontFamily: "'Cinzel', serif" }}>Sección: Arsenal & Pertrechos</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter text-[#f3e5ab]"
              style={{ fontFamily: "'Cinzel Decorative', cursive", textShadow: '2px 2px 0 #8b5e3c, 4px 4px 10px rgba(0,0,0,0.5)' }}>
            INVENTARIO
          </h1>
        </div>

        {/* BUSCADOR ESTILO DASHBOARD */}
        <div className="relative w-full md:w-96 group">
            <GiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b5e3c] z-10" />
            <input 
              type="text"
              placeholder="Rastrear objeto..."
              className="w-full bg-[#2a1b0c] border-2 border-[#8b5e3c] rounded-md py-4 pl-12 pr-6 text-[#f3e5ab] focus:outline-none focus:border-[#b45309] transition-all"
              onChange={(e) => setBusqueda(e.target.value)}
            />
        </div>
      </header>

      {/* STATS WIDGETS (Los mismos del Dashboard) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatWidget label="Valor en Bóveda" value={productosData.reduce((a,b) => a + (b.precio*b.stock), 0).toLocaleString()} unit="GP" icon={<GiCoins />} color="#b45309" />
          <StatWidget label="Carga de Inventario" value={productosData.reduce((a,b) => a + b.stock, 0)} unit="Items" icon={<GiChest />} color="#b45309" />
          <StatWidget label="Suministros Bajos" value={productosData.filter(p => p.stock < 5).length} unit="Alertas" icon={<GiSandsOfTime />} color="#7f1d1d" isAlert={productosData.filter(p => p.stock < 5).length > 0} />
      </section>

      {/* TABLA ESTILO "ANALES DE TRANSACCIONES" */}
      <div className="bg-[#f3e5ab] border-2 border-[#8b5e3c] p-1 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
        <div className="p-8 border border-[#8b5e3c]/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#8b5e3c]/30 text-[#2a1b0c]">
                <th className="p-4 uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Cód.</th>
                <th className="p-4 uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Descripción</th>
                <th className="p-4 uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Tipo</th>
                <th className="p-4 text-center uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Stock</th>
                <th className="p-4 text-right uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Precio</th>
                <th className="p-4 text-center uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Acción</th>
              </tr>
            </thead>
            <tbody className="text-[#4a3a2a]">
              <AnimatePresence>
                {productosData
                  .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
                  .map((prod, index) => (
                  <motion.tr 
                    key={prod.id_producto}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-[#8b5e3c]/10 hover:bg-[#8b5e3c]/5 transition-colors group italic font-medium"
                  >
                    <td className="p-4 text-[11px] font-bold text-[#8b5e3c]" style={{ fontFamily: "'Special Elite', cursive" }}>#{prod.id_producto}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl text-[#8b5e3c] group-hover:text-[#b45309] transition-colors">
                          {getCategoryIcon(prod.categoria)}
                        </div>
                        <span className="text-lg font-bold text-[#2a1b0c] not-italic">{prod.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold uppercase text-[9px] tracking-widest">{prod.categoria}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-sm font-bold text-sm ${
                        prod.stock < 5 ? 'bg-[#7f1d1d] text-white animate-pulse' : 'bg-[#2a1b0c] text-[#f3e5ab]'
                      }`} style={{ fontFamily: "'Special Elite', cursive" }}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-xl text-[#2a1b0c]" style={{ fontFamily: "'Special Elite', cursive" }}>
                      {prod.precio} <span className="text-[10px] text-[#8b5e3c]">GP</span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 border border-[#8b5e3c] text-[#8b5e3c] hover:bg-[#2a1b0c] hover:text-[#f3e5ab] transition-all">
                        <GiScrollUnfurled />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// COMPONENTES REUTILIZADOS DEL DASHBOARD (Para mantener coherencia)

const StatWidget = ({ label, value, unit, icon, color, isAlert }) => (
    <div className="relative p-6 bg-[#f3e5ab] border-2 border-[#8b5e3c] rounded-sm shadow-xl overflow-hidden group hover:border-[#b45309] transition-colors"
         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
        <div className="flex flex-col gap-1 relative z-10">
            <p className="text-[10px] uppercase font-bold text-[#8b5e3c] tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>{label}</p>
            <div className="flex items-baseline justify-between gap-2">
                <span className={`text-5xl font-bold tracking-tight ${isAlert ? 'text-[#7f1d1d]' : 'text-[#2a1b0c]'}`} style={{ fontFamily: "'Special Elite', cursive" }}>{value}</span>
                <span className="text-xs font-semibold text-[#8b5e3c] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>{unit}</span>
            </div>
        </div>
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-[0.08] group-hover:opacity-20 transition-all duration-500 group-hover:scale-110" style={{ color: color }}>{icon}</div>
        {isAlert && <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-[#7f1d1d]/5 pointer-events-none" />}
    </div>
);

const GrimoireLoaderMini = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a110a]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
        <GiScrollUnfurled className="text-7xl text-[#b45309]" />
      </motion.div>
      <p className="mt-6 text-[#8b5e3c] font-bold text-xs uppercase tracking-[0.5em] animate-pulse">Desenrollando Pergaminos</p>
    </div>
);

export default Inventario;