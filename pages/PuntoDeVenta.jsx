import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiShop, GiCoins, GiHealthPotion, GiMagnifyingGlass,
  GiScrollUnfurled, GiBroadsword, GiBackpack,
  GiSparkles, GiHammerBreak, GiCrystalWand, GiExplosiveMaterials
} from 'react-icons/gi';
import { FaPlus, FaMinus, FaTimes, FaCaretLeft, FaCaretRight } from 'react-icons/fa';

const PuntoDeVenta = () => {
  // --- ESTADOS ---
  const [productosData, setProductosData] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [filtro, setFiltro] = useState('todo');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [errorVenta, setErrorVenta] = useState(null);

  // --- ESTADOS DE PAGINACIÓN ---
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8; // Ajustable según el tamaño de pantalla

  const GET_URL = 'https://proyectodnd.gymnast.com.mx/backend/api/get_productos.php';
  const VENTA_URL = 'https://proyectodnd.gymnast.com.mx/backend/api/registrar_venta.php';

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${GET_URL}?t=${new Date().getTime()}`);
      const data = await res.json();
      setProductosData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProductos(); }, []);
  useEffect(() => { setPaginaActual(1); }, [busqueda, filtro]);

  const normalizar = (texto) => {
    if (!texto) return "";
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id_producto === producto.id_producto);
      if (existe && existe.cantidad >= producto.stock) {
        setErrorVenta("La bóveda no posee más unidades de este artefacto.");
        return prev;
      }
      if (!existe && producto.stock <= 0) {
        setErrorVenta("Este objeto se ha agotado en nuestras existencias.");
        return prev;
      }
      if (existe) {
        return prev.map(item => item.id_producto === producto.id_producto ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id_producto === id);
      if (existe.cantidad === 1) return prev.filter(item => item.id_producto !== id);
      return prev.map(item => item.id_producto === id ? { ...item, cantidad: item.cantidad - 1 } : item);
    });
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);

  const sellarVenta = async () => {
    if (carrito.length === 0) return;
    const payload = {
      total: totalCarrito,
      id_cliente: 1, id_empleado: 1,
      carrito: carrito.map(item => ({
        id_producto: item.id_producto,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };
    try {
      const res = await fetch(VENTA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        setVentaExitosa(true);
        fetchProductos(); 
      } else {
        setErrorVenta(result.message);
      }
    } catch (error) {
      setErrorVenta("La conexión con el escriba real ha fallado.");
    }
  };

  // --- LÓGICA DE FILTRADO Y PAGINACIÓN ---
  const productosFiltrados = productosData.filter(p => {
    const matchTexto = normalizar(p.nombre || "").includes(normalizar(busqueda));
    const matchCat = filtro === 'todo' || p.categoria.toLowerCase() === filtro;
    return matchTexto && matchCat;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indicePrimero, indiceUltimo);

  const getIcon = (cat) => {
    const c = cat?.toLowerCase() || '';
    if (c.includes('arma')) return <GiBroadsword />;
    if (c.includes('magia')) return <GiCrystalWand />;
    if (c.includes('consumible')) return <GiExplosiveMaterials />;
    return <GiBackpack />;
  };

  return (
    <div className="p-6 md:p-10 max-w-[1800px] mx-auto min-h-screen flex flex-col lg:flex-row gap-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      
      {/* SECCIÓN CATÁLOGO */}
      <div className="flex-1 flex flex-col">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#8b5e3c]/20 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 opacity-70">
              <GiShop className="text-[#8b5e3c] text-3xl" />
              <span className="text-[10px] uppercase font-bold text-[#e2d7bf] tracking-[0.5em]" style={{ fontFamily: "'Cinzel', serif" }}>Mercado Real</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#f3e5ab]" style={{ fontFamily: "'Cinzel Decorative', cursive", textShadow: '2px 2px 0 #8b5e3c' }}>PUNTO DE VENTA</h1>
          </div>

          <div className="relative w-full md:w-80">
            <GiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b5e3c]" />
            <input type="text" placeholder="Buscar artefacto..." className="w-full bg-[#1a110a] border border-[#8b5e3c]/40 rounded-md p-3 pl-10 text-[#f3e5ab] focus:border-[#b45309] outline-none italic" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </header>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 custom-scrollbar">
          {['todo', 'armas', 'magia', 'consumibles', 'equipo'].map(cat => (
            <button key={cat} onClick={() => setFiltro(cat)} className={`px-5 py-2 font-bold uppercase text-[10px] tracking-widest transition-all border border-[#8b5e3c] ${filtro === cat ? 'bg-[#b45309] text-[#f3e5ab]' : 'bg-[#2a1b0c] text-[#8b5e3c] hover:bg-[#8b5e3c]/20'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {productosPaginados.map((prod) => (
              <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={prod.id_producto}>
                <button onClick={() => agregarAlCarrito(prod)} className={`w-full border-2 p-6 flex flex-col items-center text-center group transition-all shadow-lg active:scale-95 h-full ${prod.stock <= 0 ? 'bg-gray-900/50 grayscale cursor-not-allowed opacity-40' : 'bg-[#f3e5ab] border-[#8b5e3c] hover:border-[#b45309]'}`} style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
                  <div className="text-5xl text-[#2a1b0c] mb-4 group-hover:scale-110 transition-transform">{getIcon(prod.categoria)}</div>
                  <h3 className="text-xs font-black text-[#2a1b0c] uppercase leading-tight mb-2" style={{ fontFamily: "'Cinzel', serif" }}>{prod.nombre}</h3>
                  <div className="text-xl font-bold text-[#b45309]" style={{ fontFamily: "'Special Elite', cursive" }}>{prod.precio} GP</div>
                  <div className={`mt-2 text-[9px] font-bold uppercase px-2 py-1 ${prod.stock < 5 ? 'bg-red-900 text-white' : 'text-[#8b5e3c]'}`}>Stock: {prod.stock}</div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- PAGINACIÓN --- */}
        <div className="mt-10 flex justify-center items-center gap-6 border-t border-[#8b5e3c]/20 pt-6">
          <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1} className="p-2 border-2 border-[#8b5e3c] text-[#f3e5ab] hover:bg-[#b45309] disabled:opacity-20"><FaCaretLeft /></button>
          <span className="text-[#f3e5ab] font-bold uppercase tracking-widest text-xs" style={{ fontFamily: "'Cinzel', serif" }}>Página {paginaActual} de {totalPaginas || 1}</span>
          <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas} className="p-2 border-2 border-[#8b5e3c] text-[#f3e5ab] hover:bg-[#b45309] disabled:opacity-20"><FaCaretRight /></button>
        </div>
      </div>

      {/* PANEL PERGAMINO (CARRITO) */}
      <div className="w-full lg:w-[450px] flex flex-col h-[calc(100vh-80px)] lg:sticky lg:top-10">
        <div className="bg-[#f3e5ab] border-x-[12px] border-[#8b5e3c] p-1 flex-1 flex flex-col shadow-2xl relative" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}>
          <div className="border-2 border-[#8b5e3c]/30 flex-1 flex flex-col p-6 overflow-hidden relative z-10">
            <h2 className="text-2xl font-black text-[#2a1b0c] uppercase text-center border-b border-[#8b5e3c]/40 pb-4 mb-4" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>Edicto de Venta</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {carrito.map(item => (
                <div key={item.id_producto} className="flex justify-between items-center border-b border-[#8b5e3c]/20 pb-3">
                  <div className="flex-1"><p className="text-sm font-black text-[#2a1b0c] uppercase">{item.nombre}</p><p className="text-[10px] font-bold text-[#8b5e3c]">{item.precio} GP</p></div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => quitarDelCarrito(item.id_producto)} className="p-1 bg-[#7f1d1d] text-white rounded-sm"><FaMinus size={10} /></button>
                    <span className="font-bold text-lg">{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item)} className="p-1 bg-[#2a1b0c] text-white rounded-sm"><FaPlus size={10} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-[#8b5e3c]/40">
              <div className="flex justify-between items-end mb-6">
                <span className="text-sm font-black text-[#8b5e3c] uppercase tracking-widest">Total Oro</span>
                <div className="flex items-center gap-2"><GiCoins className="text-3xl text-[#b45309]" /><span className="text-4xl font-bold text-[#2a1b0c]" style={{ fontFamily: "'Special Elite', cursive" }}>{totalCarrito.toFixed(2)}</span></div>
              </div>
              <button onClick={sellarVenta} disabled={carrito.length === 0} className={`w-full py-4 font-bold uppercase text-sm ${carrito.length === 0 ? 'bg-gray-300 opacity-50 cursor-not-allowed' : 'bg-[#2a1b0c] text-[#f3e5ab] hover:bg-[#b45309]'}`}>Sellar Venta</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALES (ÉXITO Y ERROR) - Se mantienen igual que el diseño del Maestre */}
      <AnimatePresence>
        {ventaExitosa && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-[#f3e5ab] p-10 border-2 border-[#8b5e3c] text-center shadow-2xl" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
              <GiCoins className="text-7xl text-yellow-500 mb-4 mx-auto" />
              <h2 className="text-3xl font-black uppercase mb-2">¡Trato Hecho!</h2>
              <button onClick={() => {setVentaExitosa(false); setCarrito([]);}} className="w-full py-3 bg-[#2a1b0c] text-[#f3e5ab] font-bold uppercase text-[10px]">Cerrar</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errorVenta && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-[#1a110a]/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.8, x: [0,-10,10,0] }} animate={{ scale: 1 }} className="bg-[#f3e5ab] border-x-[15px] border-red-900 p-10 text-center max-w-md shadow-2xl">
              <GiHammerBreak className="text-7xl text-red-900 mb-6 mx-auto" />
              <h2 className="text-2xl font-black text-red-900 uppercase mb-4">Interrupción de Venta</h2>
              <p className="italic mb-10 text-xl text-[#2a1b0c]">"{errorVenta}"</p>
              <button onClick={() => setErrorVenta(null)} className="w-full py-4 bg-red-900 text-white font-bold uppercase text-xs">Acatar Orden</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PuntoDeVenta;