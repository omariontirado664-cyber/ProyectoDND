import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GiDiceTwentyFacesTwenty, GiQuill, GiCoins, GiBarbedCoil, 
  GiDungeonGate, GiBeerStein, GiChest, GiShield, 
  GiBroadsword, GiRadarSweep, GiBoltEye, GiScrollUnfurled, 
  GiBookCover, GiCandleFlame, GiRank3, GiSparkles, GiOgre, 
  GiWizardStaff, GiNinjaHead, GiAxeSwing, GiWoodenSign
} from 'react-icons/gi';

const DndArchitectDashboard = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false); 
  const [time, setTime] = useState(new Date());
  const [selectedNode, setSelectedNode] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [activeTableId, setActiveTableId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // --- ESTADO TÁCTICO DE TABLAS Y AVENTUREROS ---
  const [tables, setTables] = useState([
    {
      id: 1,
      isOccupied: true,
      players: [
        { id: "p1", name: "Grog el Fuerte", class: "Bárbaro", total: 1250, coverPaid: true, icon: <GiAxeSwing />, orders: [{ item: "Hidromiel", price: 450 }, { item: "Pavo", price: 800 }] },
        { id: "p2", name: "Lirael", class: "Maga", total: 850, coverPaid: false, icon: <GiWizardStaff />, orders: [{ item: "Vino Elfico", price: 600 }, { item: "Pan Lembas", price: 250 }] },
        { id: "p3", name: "Shadow", class: "Pícaro", total: 400, coverPaid: true, icon: <GiNinjaHead />, orders: [{ item: "Daga Queso", price: 400 }] }
      ]
    },
    ...Array.from({ length: 11 }, (_, i) => ({ id: i + 2, isOccupied: i % 3 === 0, players: i % 3 === 0 ? [
        { id: `p${i}-1`, name: "Aventurero Errante", class: "Guerrero", total: 500, coverPaid: false, icon: <GiBroadsword />, orders: [{ item: "Ración de Viaje", price: 500 }] }
    ] : [] }))
  ]);

  const handleRegisterPayment = (playerId) => {
    setTables(prevTables => prevTables.map(table => {
      if (table.id === activeTableId) {
        return {
          ...table,
          players: table.players.map(player => {
            if (player.id === playerId) return { ...player, coverPaid: true };
            return player;
          })
        };
      }
      return table;
    }));
    setSelectedPlayer(prev => ({ ...prev, coverPaid: true }));
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    const loadTimer = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setShowToast(true), 400);
    }, 1500);
    
    const welcomeTimer = setTimeout(() => setShowToast(false), 5500); 
    return () => { clearInterval(timer); clearTimeout(loadTimer); clearTimeout(welcomeTimer); };
  }, []);

  if (isLoading) return <GrimoireLoader />;

  const activeTableData = tables.find(t => t.id === activeTableId);

  return (
    <div className="p-10 relative z-10 max-w-[1750px] mx-auto overflow-hidden" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      
      {/* NOTIFICACIÓN DE BIENVENIDA */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0, filter: "blur(5px)" }}
            className="fixed top-6 right-6 z-[200] flex items-center bg-[#f3e5ab] border-2 border-[#8b5e3c] p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-sm pr-10"
            style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}
          >
            <div className="p-2 border-r border-[#8b5e3c]/30 mr-4">
                <GiScrollUnfurled className="text-[#8b5e3c] text-3xl" />
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-[#8b5e3c] tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>Decreto de Llegada</span>
                <h1 className="text-xl font-bold text-[#2a1b0c] uppercase tracking-tight" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>
                  Saludos, {user?.nombre?.split(' ')[0] || 'Maestre'}
                </h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex justify-between items-start mb-12 px-6 pb-6 border-b-2 border-[#8b5e3c]/20">
        <div>
          <div className="flex items-center gap-3 mb-1 opacity-60">
              <GiBookCover className="text-[#8b5e3c]" />
              <span className="text-[10px] uppercase font-bold text-[#e2d7bf] tracking-[0.5em]" style={{ fontFamily: "'Cinzel', serif" }}>Codex Architectus v2.1</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter text-[#f3e5ab]"
              style={{ fontFamily: "'Cinzel Decorative', cursive", textShadow: '2px 2px 0 #8b5e3c, 4px 4px 10px rgba(0,0,0,0.5)' }}>
            VANGUARD
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden xl:flex items-center gap-5 px-6 py-4 bg-[#2a1b0c] border-2 border-[#8b5e3c] rounded-md shadow-lg"
               style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-wood.png')` }}>
              <GiCandleFlame className="text-3xl text-[#b45309] animate-pulse" />
              <div className="text-right">
                  <p className="text-[10px] font-bold text-[#f3e5ab] uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>Sincronía con el Plano</p>
                  <span className="text-green-400 font-semibold italic text-sm">Estable</span>
              </div>
          </div>

          <div className="px-8 py-5 bg-[#3a2a1a] border-2 border-[#8b5e3c]/50 rounded-sm shadow-2xl flex flex-col items-center min-w-[160px]">
              <p className="text-4xl font-bold text-[#f3e5ab] tracking-[0.1em] leading-none" style={{ fontFamily: "'Special Elite', cursive" }}>
                {time.toLocaleTimeString('es-MX', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="w-full h-[1px] bg-[#8b5e3c]/30 my-2" />
              <span className="text-[8px] uppercase font-bold text-[#b45309] tracking-[0.4em]" style={{ fontFamily: "'Cinzel', serif" }}>Tiempo del Reino</span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
          <StatWidget label="Arca de Oro" value="34,209" unit="GP" icon={<GiCoins />} color="#b45309" />
          <StatWidget label="Héroes Activos" value="12" unit="Almas" icon={<GiShield />} color="#b45309" />
          <StatWidget label="Alertas de Torre" value="2" unit="Ecos" icon={<GiBoltEye />} color="#7f1d1d" isAlert />
          <StatWidget label="Reputación" value="98%" unit="Favor" icon={<GiRank3 />} color="#b45309" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 relative group">
          <div className="relative bg-[#f3e5ab] border-2 border-[#8b5e3c] p-2 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
               style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
             <div className="p-10 relative z-10 border border-[#8b5e3c]/20 shadow-inner overflow-hidden">
                  <div className="flex justify-between items-center mb-10 border-b border-[#8b5e3c]/20 pb-6">
                      <h3 className="text-[#2a1b0c] font-bold uppercase tracking-[0.4em] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>Ocupación de Tabernas y Nodos</h3>
                      <GiRadarSweep className="text-3xl text-[#b45309]/40" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 relative z-10">
                    {tables.map((table) => (
                      <TacticalPlate 
                        key={table.id} 
                        id={table.id} 
                        isOccupied={table.isOccupied} 
                        onClick={() => {
                          if (table.isOccupied) {
                            setActiveTableId(table.id);
                            setShowOrdersModal(true);
                          } else {
                            setSelectedNode({ id: table.id, occupied: false });
                          }
                        }}
                      />
                    ))}
                  </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col group">
          <div className="bg-[#f3e5ab] border-2 border-[#8b5e3c] p-10 shadow-2xl flex-1 flex flex-col relative overflow-hidden"
               style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')`, clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)' }}>
            <div className="flex items-center justify-between mb-10 border-b border-[#8b5e3c]/20 pb-6 opacity-80 group-hover:opacity-100 transition-opacity">
              <div>
                  <h3 className="text-[#2a1b0c] font-black uppercase text-[11px] tracking-[0.5em]" style={{ fontFamily: "'Cinzel', serif" }}>Anales de Transacciones</h3>
                  <p className="text-[9px] text-[#8b5e3c] uppercase font-bold mt-1 tracking-widest">Registros Escritos a Mano</p>
              </div>
              <GiQuill className="text-3xl text-[#8b5e3c]/60 group-hover:text-[#b45309] transition-colors" />
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-3 custom-scrollbar max-h-[450px] font-medium text-[#4a3a2a] italic">
              <LogEntry title="Mazo 'Luz Sagrada'" price="+2,400 GP" icon={<GiSparkles />} />
              <LogEntry title="Inscripción Torneo Local" price="+150 GP" icon={<GiDiceTwentyFacesTwenty />} />
              <LogEntry title="Pociones de Sanación" price="-320 GP" icon={<GiBeerStein />} />
              <LogEntry title="Set Dados Ópalo" price="+850 GP" icon={<GiDiceTwentyFacesTwenty />} />
            </div>
          </div>
        </div>
      </div>

      {/* MODALES TÁCTICOS */}
      <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
      <OrdersModal isOpen={showOrdersModal} table={activeTableData} onClose={() => setShowOrdersModal(false)} onSelectPlayer={(p) => setSelectedPlayer(p)} />
      <PlayerDetailModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} onPay={handleRegisterPayment} />
    </div>
  );
};

/* --- COMPONENTES ATÓMICOS --- */

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

const TacticalPlate = ({ id, isOccupied, onClick }) => (
  <motion.div whileHover={{ y: -5, scale: 1.03 }} onClick={onClick}
    className={`relative aspect-square flex flex-col items-center justify-center transition-all duration-500 cursor-pointer rounded-sm border-4 shadow-xl overflow-hidden
      ${isOccupied ? 'border-[#7f1d1d] bg-[#7f1d1d]/10 text-[#7f1d1d]' : 'border-[#8b5e3c]/30 bg-[#2a1b0c]/10 text-[#2a1b0c] hover:border-[#8b5e3c] hover:bg-white/5'}`}>
    <span className={`text-6xl font-black relative z-10 ${isOccupied ? 'opacity-30 blur-[1px]' : ''}`} style={{ fontFamily: "'Cinzel Decorative', cursive" }}>{id}</span>
    {isOccupied && (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#7f1d1d]/10 backdrop-blur-[1px]">
        <GiOgre className="text-4xl animate-bounce" />
        <div className="px-3 py-1 bg-[#7f1d1d] text-[#f3e5ab] text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm shadow-md" style={{ fontFamily: "'Cinzel', serif" }}>Ocupado</div>
      </div>
    )}
  </motion.div>
);

const LogEntry = ({ title, price, icon }) => (
  <div className="flex justify-between items-center p-4 bg-white/5 border border-[#8b5e3c]/10 hover:border-[#8b5e3c]/30 hover:bg-white/10 transition-all group rounded-sm">
    <div className="flex items-center gap-3">
        <div className="text-2xl text-[#8b5e3c] group-hover:text-[#b45309] transition-colors">{icon}</div>
        <div>
            <h4 className="text-base font-semibold tracking-tight text-[#2a1b0c] group-hover:text-black transition-colors">{title}</h4>
            <p className="text-[10px] text-[#8b5e3c] font-bold uppercase tracking-wider mt-0.5">Asentado</p>
        </div>
    </div>
    <span className="text-xl font-bold text-[#2a1b0c] tabular-nums" style={{ fontFamily: "'Special Elite', cursive" }}>{price}</span>
  </div>
);

const OrdersModal = ({ isOpen, table, onClose, onSelectPlayer }) => (
  <AnimatePresence>
    {isOpen && table && (
      <div className="fixed inset-0 z-[650] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-[#f3e5ab] w-full max-w-lg p-1 border-2 border-[#8b5e3c] shadow-2xl" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
          <div className="border-2 border-[#8b5e3c]/30 p-8 flex flex-col items-center">
            <GiShield className="text-5xl text-[#8b5e3c] mb-4" />
            <h2 className="text-2xl font-black text-[#2a1b0c] uppercase tracking-tighter mb-1" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>Aventureros: Nodo {table.id}</h2>
            <div className="w-full space-y-3 mb-10">
              {table.players.map((player) => (
                <button key={player.id} onClick={() => onSelectPlayer(player)}
                    className="w-full flex justify-between items-center p-4 bg-[#2a1b0c]/5 border border-[#8b5e3c]/20 rounded-sm hover:bg-[#b45309]/5 hover:border-[#b45309] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl text-[#8b5e3c]">{player.icon}</div>
                    <div className="flex flex-col text-left">
                      <span className="text-lg font-bold text-[#2a1b0c]" style={{ fontFamily: "'Cinzel', serif" }}>{player.name}</span>
                      <span className={`text-[9px] uppercase font-black ${player.coverPaid ? 'text-green-700' : 'text-red-700'}`}>{player.coverPaid ? '✓ Pagado' : '✗ Pendiente'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#2a1b0c]" style={{ fontFamily: "'Special Elite', cursive" }}>{player.total} GP</span>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={onClose} className="w-full py-3 border-2 border-[#8b5e3c] text-[#2a1b0c] font-bold uppercase text-[10px] tracking-widest hover:bg-[#8b5e3c]/10 transition-all">Volver al Mapa</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const PlayerDetailModal = ({ player, onClose, onPay }) => (
  <AnimatePresence>
    {player && (
      <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-[#1a110a]/90 backdrop-blur-md">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0" />
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          className="relative bg-[#fdf8e1] w-full max-w-md border-x-[12px] border-[#8b5e3c] shadow-2xl p-10 text-[#2a1b0c]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}>
            <div className="flex items-center gap-4 mb-8 border-b-2 border-[#8b5e3c]/20 pb-6">
                <div className="p-4 bg-[#2a1b0c] text-[#f3e5ab] text-4xl rounded-full border-4 border-[#8b5e3c]">{player.icon}</div>
                <div><h2 className="text-3xl font-black" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>{player.name}</h2><p className="text-[#b45309] font-bold uppercase text-xs">{player.class}</p></div>
            </div>
            <div className="space-y-4 mb-10">
                {player.orders.map((order, idx) => (
                    <div key={idx} className="flex justify-between items-center italic"><span>{order.item}</span><span className="font-bold">{order.price} GP</span></div>
                ))}
                <div className="border-t-2 border-[#8b5e3c]/20 pt-4 flex justify-between items-center"><span className="text-lg font-black uppercase">Total</span><span className="text-3xl font-black">{player.total} GP</span></div>
            </div>
            <div className="flex gap-4">
                <button onClick={() => onPay(player.id)} className={`flex-1 py-4 font-black uppercase text-[10px] transition-all ${player.coverPaid ? 'bg-green-800 text-white' : 'bg-[#b45309] text-white'}`}>{player.coverPaid ? '✓ Pago Registrado' : 'Sellar Pago'}</button>
                <button onClick={onClose} className="px-6 py-4 border-2 border-[#8b5e3c] text-[#8b5e3c]"><GiDungeonGate className="text-xl" /></button>
            </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const NodeDetailModal = ({ node, onClose }) => (
  <AnimatePresence>
    {node && (
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0" />
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          className="relative bg-[#f3e5ab] w-full max-w-md p-8 border-2 border-[#8b5e3c] text-center" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
              <GiWoodenSign className="text-6xl text-[#8b5e3c] mx-auto mb-4" />
              <h2 className="text-3xl font-black text-[#2a1b0c] uppercase">Nodo {node.id.toString().padStart(2, '0')}</h2>
              <p className="text-sm text-[#5d4037] italic mb-10">Este cuadrante está libre de aventureros.</p>
              <button onClick={onClose} className="w-full py-4 bg-[#2a1b0c] text-[#f3e5ab] font-bold uppercase text-xs">Cerrar Pergamino</button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const GrimoireLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a110a]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }}>
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="relative">
      <GiBarbedCoil className="text-[15rem] text-[#8b5e3c]/10" />
      <GiDiceTwentyFacesTwenty className="text-8xl text-[#b45309] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
    <p className="mt-10 text-[#8b5e3c] font-bold text-xs uppercase tracking-[1em] animate-pulse">Consultando los Tomos</p>
  </div>
);

export default DndArchitectDashboard;