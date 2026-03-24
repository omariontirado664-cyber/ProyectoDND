import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiChest, GiCoins, GiSandsOfTime, GiMagnifyingGlass, 
  GiBroadsword, GiCrystalWand, GiExplosiveMaterials,
  GiBookCover, GiScrollUnfurled, GiHammerBreak, GiBackpack, GiQuill 
} from 'react-icons/gi';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa'; // Iconos seguros para paginación

const Inventario = () => {
  // --- ESTADOS DE DATOS Y CARGA ---
  const [productosData, setProductosData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- ESTADOS DE FILTRADO AVANZADO ---
  const [filtros, setFiltros] = useState({
    texto: '',
    categoria: 'Todos',
    soloBajoStock: false,
    precioMax: 5000
  });

  // --- ESTADOS DE PAGINACIÓN ---
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // --- ESTADOS DEL CRUD ---
  const [showModal, setShowModal] = useState(false);
  const [selectedProd, setSelectedProd] = useState(null);

  const API_URL = 'http://proyectodnd.gymnast.com.mx/backend/api/get_productos.php';
  const CRUD_URL = 'http://proyectodnd.gymnast.com.mx/backend/api/crud_productos.php';

  // --- FUNCIÓN DE NORMALIZACIÓN (IGNORA ACENTOS) ---
  const normalizar = (texto) => {
    if (!texto) return "";
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const fetchInventory = () => {
    setLoading(true);
    fetch(API_URL) 
      .then(res => res.json())
      .then(data => {
        setProductosData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Reiniciar a la página 1 cuando el usuario filtra para evitar tablas vacías
  useEffect(() => {
    setPaginaActual(1);
  }, [filtros]);

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = productosData.filter(p => {
    const busquedaLimpia = normalizar(filtros.texto);
    const nombreLimpio = normalizar(p.nombre);
    const idLimpio = p.id_producto.toString();

    const matchTexto = nombreLimpio.includes(busquedaLimpia) || idLimpio.includes(busquedaLimpia);
    const matchCat = filtros.categoria === 'Todos' || p.categoria === filtros.categoria;
    const matchPrecio = parseFloat(p.precio) <= filtros.precioMax;
    const matchStock = filtros.soloBajoStock ? parseInt(p.stock) < 5 : true;
    
    return matchTexto && matchCat && matchPrecio && matchStock;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const ultimoIndice = paginaActual * registrosPorPagina;
  const primerIndice = ultimoIndice - registrosPorPagina;
  const productosPaginados = productosFiltrados.slice(primerIndice, ultimoIndice);
  const totalPaginas = Math.ceil(productosFiltrados.length / registrosPorPagina);

  // --- LÓGICA CRUD ---
  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      action: selectedProd ? 'UPDATE' : 'INSERT',
      id_producto: selectedProd?.id_producto,
      nombre: formData.get('nombre'),
      categoria: formData.get('categoria'),
      precio: parseFloat(formData.get('precio')),
      stock: parseInt(formData.get('stock'))
    };

    try {
      const res = await fetch(CRUD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if(result.success) {
        setShowModal(false);
        setSelectedProd(null);
        fetchInventory();
      }
    } catch (err) { alert("Error de conexión con la torre de datos"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("¿Deseas desvanecer este objeto del plano existencial?")) return;
    try {
      await fetch(CRUD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', id_producto: id })
      });
      fetchInventory();
    } catch (err) { console.error(err); }
  };

  const getCategoryIcon = (cat) => {
    const c = cat?.toLowerCase() || '';
    if (c.includes('arma')) return <GiBroadsword />;
    if (c.includes('magia')) return <GiCrystalWand />;
    if (c.includes('consumible')) return <GiExplosiveMaterials />;
    return <GiBackpack />;
  };

  if (loading && productosData.length === 0) return <GrimoireLoaderMini />;

  return (
    <div className="p-10 relative z-10 max-w-[1750px] mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      
      {/* HEADER & FILTROS */}
      <header className="mb-10 px-6 pb-6 border-b-2 border-[#8b5e3c]/20">
        <div className="flex justify-between items-end mb-8">
            <div>
                <div className="flex items-center gap-3 mb-1 opacity-60">
                    <GiBookCover className="text-[#8b5e3c]" />
                    <span className="text-[10px] uppercase font-bold text-[#e2d7bf] tracking-[0.5em]" style={{ fontFamily: "'Cinzel', serif" }}>Sección: Arsenal & Pertrechos</span>
                </div>
                <h1 className="text-7xl font-black tracking-tighter text-[#f3e5ab]"
                    style={{ fontFamily: "'Cinzel Decorative', cursive", textShadow: '2px 2px 0 #8b5e3c' }}>
                    INVENTARIO
                </h1>
            </div>
            <button 
                onClick={() => { setSelectedProd(null); setShowModal(true); }}
                className="bg-[#b45309] text-[#f3e5ab] px-8 py-4 rounded-md border-2 border-[#f3e5ab]/20 font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(180,83,9,0.3)] flex items-center gap-3"
                style={{ fontFamily: "'Cinzel', serif" }}
            >
                <GiQuill className="text-2xl" /> SELLAR ARTEFACTO
            </button>
        </div>

        <div className="bg-[#2a1b0c]/60 border border-[#8b5e3c]/40 p-6 rounded-lg backdrop-blur-md grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-[#8b5e3c] flex items-center gap-2 tracking-widest">
                    <GiMagnifyingGlass /> Identificador / Nombre
                </label>
                <input 
                    type="text"
                    placeholder="Ej: Pocion, Espada..."
                    className="w-full bg-[#1a110a] border border-[#8b5e3c]/40 rounded p-3 text-[#f3e5ab] focus:border-[#b45309] outline-none italic transition-all"
                    onChange={(e) => setFiltros({...filtros, texto: e.target.value})}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-[#8b5e3c] tracking-widest">Esencia</label>
                <select 
                    className="w-full bg-[#1a110a] border border-[#8b5e3c]/40 rounded p-3 text-[#f3e5ab] focus:border-[#b45309] outline-none cursor-pointer font-bold"
                    onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                >
                    <option value="Todos">Todos los tipos</option>
                    <option value="Armas">Armas</option>
                    <option value="Magia">Magia</option>
                    <option value="Consumibles">Consumibles</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-[#8b5e3c] tracking-widest">
                    <span>Valor Máx.</span>
                    <span className="text-[#b45309] font-black">{filtros.precioMax} GP</span>
                </div>
                <input 
                    type="range" min="0" max="5000" step="50"
                    value={filtros.precioMax}
                    className="w-full accent-[#b45309] cursor-pointer"
                    onChange={(e) => setFiltros({...filtros, precioMax: parseInt(e.target.value)})}
                />
            </div>

            <button 
                onClick={() => setFiltros({...filtros, soloBajoStock: !filtros.soloBajoStock})}
                className={`p-3 rounded-md border-2 transition-all flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest ${
                    filtros.soloBajoStock 
                    ? 'bg-[#7f1d1d] border-white text-white shadow-[0_0_15px_rgba(127,29,29,0.5)]' 
                    : 'bg-[#1a110a] border-[#8b5e3c]/40 text-[#8b5e3c]'
                }`}
            >
                <GiSandsOfTime className={filtros.soloBajoStock ? 'animate-spin' : ''} />
                {filtros.soloBajoStock ? 'Stock Crítico' : 'Todo el Stock'}
            </button>
        </div>
      </header>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatWidget label="Valor en Bóveda" value={productosData.reduce((a,b) => a + (parseFloat(b.precio)*parseInt(b.stock)), 0).toLocaleString()} unit="GP" icon={<GiCoins />} color="#b45309" />
          <StatWidget label="Carga Total" value={productosData.reduce((a,b) => a + parseInt(b.stock), 0)} unit="Items" icon={<GiChest />} color="#b45309" />
          <StatWidget label="Alertas de Stock" value={productosData.filter(p => p.stock < 5).length} unit="Alertas" icon={<GiSandsOfTime />} color="#7f1d1d" isAlert={productosData.filter(p => p.stock < 5).length > 0} />
      </section>

      {/* TABLA CON PAGINACIÓN */}
      <div className="bg-[#f3e5ab] border-2 border-[#8b5e3c] p-1 rounded-sm shadow-2xl overflow-hidden"
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
        <div className="p-8 border border-[#8b5e3c]/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#8b5e3c]/30 text-[#2a1b0c]">
                <th className="p-4 uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Cod.</th>
                <th className="p-4 uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Descripción</th>
                <th className="p-4 uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Esencia</th>
                <th className="p-4 text-center uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Cant.</th>
                <th className="p-4 text-right uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Valor</th>
                <th className="p-4 text-center uppercase text-[10px] font-black tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[#4a3a2a]">
              <AnimatePresence mode='wait'>
                {productosPaginados.map((prod, index) => (
                  <motion.tr 
                    key={prod.id_producto}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-[#8b5e3c]/10 hover:bg-[#8b5e3c]/5 transition-colors group italic font-medium"
                  >
                    <td className="p-4 text-[11px] font-bold text-[#8b5e3c]" style={{ fontFamily: "'Special Elite', cursive" }}>#{prod.id_producto}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl text-[#8b5e3c] group-hover:text-[#b45309] transition-colors">
                          {getCategoryIcon(prod.categoria)}
                        </div>
                        <span className="text-lg font-bold text-[#2a1b0c] not-italic tracking-tight">{prod.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold uppercase text-[9px] tracking-widest">{prod.categoria}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-sm font-bold text-sm ${
                        parseInt(prod.stock) < 5 ? 'bg-[#7f1d1d] text-white animate-pulse' : 'bg-[#2a1b0c] text-[#f3e5ab]'
                      }`} style={{ fontFamily: "'Special Elite', cursive" }}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-xl text-[#2a1b0c]" style={{ fontFamily: "'Special Elite', cursive" }}>
                      {prod.precio} <span className="text-[10px] text-[#8b5e3c]">GP</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setSelectedProd(prod); setShowModal(true); }} className="p-2 border border-[#8b5e3c] text-[#8b5e3c] hover:bg-[#2a1b0c] hover:text-[#f3e5ab] transition-all"><GiScrollUnfurled /></button>
                        <button onClick={() => handleDelete(prod.id_producto)} className="p-2 border border-red-900/30 text-red-900 hover:bg-red-900 hover:text-white transition-all"><GiHammerBreak /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {/* CONTROLES DE PAGINACIÓN ACTUALIZADOS */}
          <div className="mt-10 flex items-center justify-between border-t border-[#8b5e3c]/20 pt-8">
            <div className="text-[10px] uppercase font-bold text-[#8b5e3c] tracking-widest italic" style={{ fontFamily: "'Cinzel', serif" }}>
              Manuscrito {primerIndice + 1} - {Math.min(ultimoIndice, productosFiltrados.length)} de {productosFiltrados.length}
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
                disabled={paginaActual === 1}
                className={`p-2 border-2 border-[#8b5e3c] rounded-sm transition-all ${paginaActual === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#2a1b0c] hover:text-[#f3e5ab]'}`}
              >
                <FaCaretLeft size={24} />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPaginaActual(i + 1)}
                    className={`w-8 h-8 rounded-sm font-bold text-xs transition-all border ${
                        paginaActual === i + 1 
                        ? 'bg-[#2a1b0c] text-[#f3e5ab] border-[#2a1b0c]' 
                        : 'border-[#8b5e3c]/30 text-[#8b5e3c] hover:bg-[#8b5e3c]/10'
                    }`}
                    style={{ fontFamily: "'Special Elite', cursive" }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className={`p-2 border-2 border-[#8b5e3c] rounded-sm transition-all ${paginaActual === totalPaginas ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#2a1b0c] hover:text-[#f3e5ab]'}`}
              >
                <FaCaretRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CRUD */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#1a110a]/95 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="relative bg-[#f3e5ab] w-full max-w-xl border-x-[15px] border-[#8b5e3c] p-10 shadow-2xl"
              style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}>
              <h2 className="text-3xl font-black text-[#2a1b0c] uppercase mb-8" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>
                {selectedProd ? 'Modificar Manuscrito' : 'Sellar Nuevo Artefacto'}
              </h2>
              <form onSubmit={handleSave} className="space-y-6 font-serif">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-[#8b5e3c]">Nombre del Ítem</label>
                    <input name="nombre" defaultValue={selectedProd?.nombre} placeholder="Ej. Pocion de Curacion" className="w-full bg-transparent border-b-2 border-[#8b5e3c]/30 p-2 italic text-xl focus:outline-none focus:border-[#b45309]" required />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-[#8b5e3c]">Categoría</label>
                    <select name="categoria" defaultValue={selectedProd?.categoria} className="w-full bg-transparent border-b-2 border-[#8b5e3c]/30 p-2 font-bold focus:outline-none">
                        <option value="Armas">Armas</option>
                        <option value="Magia">Magia</option>
                        <option value="Consumibles">Consumibles</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-[#8b5e3c]">Precio (GP)</label>
                    <input name="precio" type="number" step="0.01" defaultValue={selectedProd?.precio} className="bg-transparent border-b-2 border-[#8b5e3c]/30 p-2 text-2xl font-bold" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-[#8b5e3c]">Stock</label>
                    <input name="stock" type="number" defaultValue={selectedProd?.stock} className="bg-transparent border-b-2 border-[#8b5e3c]/30 p-2 text-2xl font-bold" required />
                  </div>
                </div>
                <div className="flex gap-4 pt-10">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 border-2 border-[#8b5e3c] text-[#8b5e3c] font-bold uppercase text-[10px]">Cerrar</button>
                  <button type="submit" className="flex-1 py-4 bg-[#2a1b0c] text-[#f3e5ab] font-bold uppercase text-[10px] hover:bg-[#b45309]">Sellar Cambios</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---
const StatWidget = ({ label, value, unit, icon, color, isAlert }) => (
    <div className="relative p-6 bg-[#f3e5ab] border-2 border-[#8b5e3c] rounded-sm shadow-xl overflow-hidden group hover:border-[#b45309] transition-all"
         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
        <div className="flex flex-col gap-1 relative z-10">
            <p className="text-[10px] uppercase font-bold text-[#8b5e3c] tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>{label}</p>
            <div className="flex items-baseline justify-between gap-2">
                <span className={`text-5xl font-bold tracking-tight ${isAlert ? 'text-[#7f1d1d]' : 'text-[#2a1b0c]'}`} style={{ fontFamily: "'Special Elite', cursive" }}>{value}</span>
                <span className="text-xs font-semibold text-[#8b5e3c] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>{unit}</span>
            </div>
        </div>
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-[0.08] group-hover:opacity-20 transition-all duration-500 group-hover:scale-110" style={{ color: color }}>{icon}</div>
        {isAlert && <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-[#7f1d1d]/5 pointer-events-none" />}
    </div>
);

const GrimoireLoaderMini = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a110a]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
        <GiScrollUnfurled className="text-7xl text-[#b45309]" />
      </motion.div>
      <p className="mt-6 text-[#8b5e3c] font-bold text-xs uppercase tracking-[0.5em] animate-pulse">Consultando Manuscritos...</p>
    </div>
);

export default Inventario;