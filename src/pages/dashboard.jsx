import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GiDiceTwentyFacesTwenty, GiCrossedSwords, GiQuill,
  GiCoins, GiBarbedCoil, GiDungeonGate, GiBeerStein, 
  GiChest, GiCrystalWand, GiDeathSkull, GiStoneTower, 
  GiCandleFlame, GiRank3, GiSparkles, GiOgre, GiShield, 
  GiBroadsword, GiRadarSweep, GiBoltEye,
  GiScrollUnfurled, GiOpenBook, GiBookCover, GiWoodenSign,
  GiChickenLeg, GiGlassShot, GiNinjaHead, GiWizardStaff, GiAxeSwing
} from 'react-icons/gi';

const DndArchitectDashboard = ({ user, onLogout }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false); 
  const [activeTab, setActiveTab] = useState('map');
  const [time, setTime] = useState(new Date());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  // --- LÓGICA DE NEGOCIO: REGISTRAR PAGO ---
  const handleRegisterPayment = (playerId) => {
    setTables(prevTables => prevTables.map(table => {
      if (table.id === activeTableId) {
        return {
          ...table,
          players: table.players.map(player => {
            if (player.id === playerId) {
              return { ...player, coverPaid: true };
            }
            return player;
          })
        };
      }
      return table;
    }));
    // Actualizamos la vista local del modal de detalle
    setSelectedPlayer(prev => ({ ...prev, coverPaid: true }));
  };

  useEffect(() => {
    if (!document.getElementById('dnd-fonts')) {
      const link = document.createElement('link');
      link.id = 'dnd-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Special+Elite&display=swap';
      document.head.appendChild(link);
    }

    const timer = setInterval(() => setTime(new Date()), 60000);
    const loadTimer = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setShowToast(true), 400);
    }, 2000);
    
    const welcomeTimer = setTimeout(() => setShowToast(false), 5500); 
    return () => { clearInterval(timer); clearTimeout(loadTimer); clearTimeout(welcomeTimer); };
  }, []);

  if (isLoading) return <GrimoireLoader />;

  const activeTableData = tables.find(t => t.id === activeTableId);

  return (
    <div className="min-h-screen bg-[#1a110a] text-[#e2d7bf] relative overflow-hidden selection:bg-[#b45309]/30"
         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')`, fontFamily: "'Cormorant Garamond', serif" }}>
      
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

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-28 z-[110] flex flex-col items-center py-10">
        <div className="absolute inset-y-0 left-0 w-24 bg-[#2a1b0c] border-r-4 border-[#8b5e3c] shadow-[10px_0_30_rgba(0,0,0,0.5)]"
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-wood.png')`, clipPath: 'polygon(0 0, 100% 0, 100% 40%, 85% 45%, 85% 55%, 100% 60%, 100% 100%, 0 100%)' }} />
        
        <div className="relative z-10 p-3 bg-[#f3e5ab] rounded-full mb-12 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-[#8b5e3c]">
            <GiDungeonGate className="text-4xl text-[#2a1b0c]" />
        </div>
        
        <nav className="relative z-10 flex flex-col gap-10">
            <SidebarIcon icon={<GiOpenBook />} active={activeTab === 'map'} onClick={() => setActiveTab('map')} label="Grimorio" />
            <SidebarIcon icon={<GiStoneTower />} active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} label="La Torre" />
            <SidebarIcon icon={<GiChest />} active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} label="Tesorería" />
        </nav>
        
        <button onClick={() => setShowLogoutModal(true)} className="mt-auto relative z-10 group p-4 transition-all">
            <GiDeathSkull className="text-3xl text-[#8b5e3c]/60 group-hover:text-[#7f1d1d] transition-all duration-300 scale-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_#7f1d1d]" />
        </button>
      </aside>

      <main className="ml-28 p-10 relative z-10 max-w-[1750px] mx-auto">
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
                    <motion.div 
                        animate={{ y: ['-100%', '200%'] }} 
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-[#b45309]/5 to-transparent pointer-events-none z-20" />
                    
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
               <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#8b5e3c] rounded-tl-sm pointer-events-none"></div>
               <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#8b5e3c] rounded-br-sm pointer-events-none"></div>
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

              <button className="w-full mt-10 py-5 bg-[#2a1b0c] border-2 border-[#8b5e3c] text-[#f3e5ab] font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-[#b45309] transition-all rounded-sm shadow-md"
                      style={{ fontFamily: "'Cinzel', serif" }}>
                Inscribir Nuevo Registro
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODALES */}
      <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
      
      <OrdersModal 
        isOpen={showOrdersModal} 
        table={activeTableData} 
        onClose={() => setShowOrdersModal(false)} 
        onSelectPlayer={(p) => setSelectedPlayer(p)}
      />

      <PlayerDetailModal 
        player={selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
        onPay={handleRegisterPayment}
      />

      <LogoutModal isOpen={showLogoutModal} onLogout={onLogout} onCancel={() => setShowLogoutModal(false)} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(139, 94, 60, 0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8b5e3c; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #b45309; }
      `}</style>
    </div>
  );
};

/* --- COMPONENTES ATÓMICOS --- */

const OrdersModal = ({ isOpen, table, onClose, onSelectPlayer }) => (
  <AnimatePresence>
    {isOpen && table && (
      <div className="fixed inset-0 z-[650] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0" />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-[#f3e5ab] w-full max-w-lg p-1 border-2 border-[#8b5e3c] shadow-2xl"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}
        >
          <div className="border-2 border-[#8b5e3c]/30 p-8 flex flex-col items-center">
            <GiShield className="text-5xl text-[#8b5e3c] mb-4" />
            <h2 className="text-2xl font-black text-[#2a1b0c] uppercase tracking-tighter mb-1" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>
              Aventureros: Nodo {table.id}
            </h2>
            <p className="text-[10px] uppercase font-bold text-[#b45309] tracking-[0.4em] mb-8" style={{ fontFamily: "'Cinzel', serif" }}>Grupo Actualmente en Campaña</p>

            <div className="w-full space-y-3 mb-10">
              {table.players.map((player) => (
                <button 
                    key={player.id} 
                    onClick={() => onSelectPlayer(player)}
                    className="w-full flex justify-between items-center p-4 bg-[#2a1b0c]/5 border border-[#8b5e3c]/20 rounded-sm hover:bg-[#b45309]/5 hover:border-[#b45309] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl text-[#8b5e3c] group-hover:scale-110 transition-transform">{player.icon}</div>
                    <div className="flex flex-col text-left">
                      <span className="text-lg font-bold text-[#2a1b0c] leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>{player.name}</span>
                      <span className={`text-[9px] uppercase font-black tracking-widest ${player.coverPaid ? 'text-green-700' : 'text-red-700'}`}>
                        {player.coverPaid ? '✓ Pagado' : '✗ Pendiente'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-[#8b5e3c] block">Consumo</span>
                    <span className="text-xl font-bold text-[#2a1b0c]" style={{ fontFamily: "'Special Elite', cursive" }}>{player.total} GP</span>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={onClose} className="w-full py-3 border-2 border-[#8b5e3c] text-[#2a1b0c] font-bold uppercase text-[10px] tracking-widest hover:bg-[#8b5e3c]/10 transition-all" style={{ fontFamily: "'Cinzel', serif" }}>
              Volver al Mapa
            </button>
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
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          className="relative bg-[#fdf8e1] w-full max-w-md border-x-[12px] border-[#8b5e3c] shadow-2xl overflow-hidden"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
        >
          {player.coverPaid && (
            <motion.div initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 0.15 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-8 border-green-900 rounded-full p-10 rotate-[-25deg]">
                    <span className="text-6xl font-black text-green-900 uppercase" style={{ fontFamily: "'Cinzel', serif" }}>PAGADO</span>
                </div>
            </motion.div>
          )}

          <div className="p-10 relative z-10 text-[#2a1b0c]">
            <div className="flex items-center gap-4 mb-8 border-b-2 border-[#8b5e3c]/20 pb-6">
                <div className="p-4 bg-[#2a1b0c] text-[#f3e5ab] text-4xl rounded-full border-4 border-[#8b5e3c]">{player.icon}</div>
                <div>
                    <h2 className="text-3xl font-black" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>{player.name}</h2>
                    <p className="text-[#b45309] font-bold uppercase tracking-widest text-xs">{player.class}</p>
                </div>
            </div>

            <div className="space-y-4 mb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8b5e3c] border-b border-[#8b5e3c]/10 pb-2">Desglose de Raciones</h3>
                {player.orders.map((order, idx) => (
                    <div key={idx} className="flex justify-between items-center italic font-medium">
                        <span><GiQuill className="inline mr-2 opacity-30"/>{order.item}</span>
                        <span className="font-bold tabular-nums" style={{ fontFamily: "'Special Elite', cursive" }}>{order.price} GP</span>
                    </div>
                ))}
                <div className="border-t-2 border-[#8b5e3c]/20 pt-4 flex justify-between items-center">
                    <span className="text-lg font-black uppercase" style={{ fontFamily: "'Cinzel', serif" }}>Total</span>
                    <span className="text-3xl font-black" style={{ fontFamily: "'Special Elite', cursive" }}>{player.total} GP</span>
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                  onClick={() => onPay(player.id)}
                  className={`flex-1 py-4 font-black uppercase text-[10px] tracking-widest transition-all shadow-lg
                    ${player.coverPaid ? 'bg-green-800 text-white cursor-default' : 'bg-[#b45309] text-white hover:bg-[#8b5e3c]'}`}
                >
                    {player.coverPaid ? '✓ Pago Registrado' : 'Sellar Pago'}
                </button>
                <button onClick={onClose} className="px-6 py-4 border-2 border-[#8b5e3c] text-[#8b5e3c] hover:bg-[#8b5e3c]/10 transition-colors">
                    <GiDungeonGate className="text-xl" />
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const SidebarIcon = ({ icon, active, onClick, label }) => (
  <motion.button 
    whileHover={{ scale: 1.1 }}
    onClick={onClick}
    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative group
      ${active ? 'text-[#2a1b0c] bg-[#f3e5ab] border-4 border-[#8b5e3c] shadow-lg' : 'text-[#e2d7bf]/50 hover:text-[#f3e5ab]'}`}
  >
    <div className="text-3xl relative z-10 transition-transform group-hover:rotate-6">{icon}</div>
    <div className="absolute left-20 px-3 py-1 bg-[#f3e5ab] border border-[#8b5e3c] text-[#2a1b0c] text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl translate-x-2 group-hover:translate-x-0"
         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')`, fontFamily: "'Cinzel', serif" }}>
        {label}
    </div>
  </motion.button>
);

const StatWidget = ({ label, value, unit, icon, color, isAlert }) => (
    <div className={`relative p-6 bg-[#f3e5ab] border-2 border-[#8b5e3c] rounded-sm shadow-xl overflow-hidden group hover:border-[#b45309] transition-colors`}
         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
        <div className="flex flex-col gap-1 relative z-10">
            <p className="text-[10px] uppercase font-bold text-[#8b5e3c] tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>{label}</p>
            <div className="flex items-baseline justify-between gap-2">
                <span className={`text-5xl font-bold tracking-tight ${isAlert ? 'text-[#7f1d1d]' : 'text-[#2a1b0c]'}`} 
                      style={{ fontFamily: "'Special Elite', cursive" }}>{value}</span>
                <span className="text-xs font-semibold text-[#8b5e3c] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>{unit}</span>
            </div>
        </div>
        <div className={`absolute -right-4 -bottom-4 text-8xl opacity-[0.08] group-hover:opacity-20 transition-all duration-500 group-hover:scale-110`}
             style={{ color: color }}>
            {icon}
        </div>
        {isAlert && <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-[#7f1d1d]/5 pointer-events-none" />}
    </div>
);

const TacticalPlate = ({ id, isOccupied, onClick }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.03 }}
    onClick={onClick}
    className={`relative aspect-square flex flex-col items-center justify-center transition-all duration-500 cursor-pointer rounded-sm border-4 shadow-xl overflow-hidden
      ${isOccupied 
        ? 'border-[#7f1d1d] bg-[#7f1d1d]/10 text-[#7f1d1d]' 
        : 'border-[#8b5e3c]/30 bg-[#2a1b0c]/10 text-[#2a1b0c] hover:border-[#8b5e3c] hover:bg-white/5'}`}
  >
    <div className={`absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center text-9xl ${isOccupied ? 'text-[#7f1d1d]' : 'text-[#8b5e3c]'}`}>
        <GiBarbedCoil />
    </div>
    <span className={`text-6xl font-black relative z-10 ${isOccupied ? 'opacity-30 blur-[1px]' : ''}`} 
          style={{ fontFamily: "'Cinzel Decorative', cursive", textShadow: isOccupied ? 'none' : '1px 1px 0 rgba(0,0,0,0.2)' }}>
      {id}
    </span>
    {isOccupied && (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#7f1d1d]/10 backdrop-blur-[1px]">
        <GiOgre className="text-4xl animate-bounce" />
        <div className="px-3 py-1 bg-[#7f1d1d] text-[#f3e5ab] text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm shadow-md"
             style={{ fontFamily: "'Cinzel', serif" }}>Ocupado</div>
      </div>
    )}
    <div className={`absolute top-1.5 left-2 text-[8px] font-bold uppercase tracking-widest ${isOccupied ? 'text-[#7f1d1d]/50' : 'text-[#8b5e3c]/50'}`}>
        N{id.toString().padStart(2, '0')}
    </div>
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

const NodeDetailModal = ({ node, onClose }) => (
  <AnimatePresence>
    {node && (
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0" />
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          className="relative bg-[#f3e5ab] w-full max-w-md p-1 border-2 border-[#8b5e3c] shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}
        >
          <div className="border-2 border-[#8b5e3c]/30 p-8 flex flex-col items-center">
              <GiWoodenSign className="text-6xl text-[#8b5e3c] mb-4" />
              <h2 className="text-3xl font-black text-[#2a1b0c] uppercase tracking-tighter mb-1" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>
                Nodo {node.id.toString().padStart(2, '0')}
              </h2>
              <span className="text-[10px] uppercase font-bold text-[#b45309] tracking-[0.5em] mb-8" style={{ fontFamily: "'Cinzel', serif" }}>
                Suelo Vacante
              </span>
              <p className="text-sm text-[#5d4037] italic mb-10 text-center">Este cuadrante del mapa no registra actividad de aventureros en este ciclo astral.</p>
              <button onClick={onClose} className="w-full py-4 bg-[#2a1b0c] text-[#f3e5ab] font-bold uppercase text-xs tracking-widest hover:bg-[#b45309] transition-all" style={{ fontFamily: "'Cinzel', serif" }}>
                Cerrar Pergamino
              </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const GrimoireLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a110a]"
       style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }}>
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="relative">
      <GiBarbedCoil className="text-[15rem] text-[#8b5e3c]/10" />
      <GiDiceTwentyFacesTwenty className="text-8xl text-[#b45309] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
    <p className="mt-10 text-[#8b5e3c] font-bold text-xs uppercase tracking-[1em] animate-pulse" style={{ fontFamily: "'Cinzel', serif" }}>Consultando los Tomos</p>
  </div>
);

const LogoutModal = ({ isOpen, onLogout, onCancel }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} className="absolute inset-0 bg-black/85 backdrop-blur-md" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, rotateX: 20 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#f3e5ab] p-1 border-2 border-[#8b5e3c] max-w-sm w-full shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
            style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}
          >
            <div className="p-10 flex flex-col items-center text-center border-2 border-[#8b5e3c]/30">
                <GiDeathSkull className="text-6xl text-[#7f1d1d] mb-6 animate-pulse" />
                <h2 className="text-2xl font-bold text-[#2a1b0c] uppercase tracking-widest mb-4" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>¿Finalizar Guardia?</h2>
                <p className="text-sm text-[#5d4037] font-medium italic mb-10 leading-relaxed">
                  El grimorio se cerrará y la conexión rúnica con el nodo Vanguard se interrumpirá. ¿Deseas retirarte?
                </p>
                <div className="flex gap-4 w-full">
                    <button onClick={onCancel} className="flex-1 py-3 border-2 border-[#8b5e3c] text-[#2a1b0c] text-[10px] font-bold uppercase tracking-widest hover:bg-[#8b5e3c]/20 transition-all" style={{ fontFamily: "'Cinzel', serif" }}>
                      Quedarse
                    </button>
                    <button onClick={onLogout} className="flex-1 py-3 bg-[#7f1d1d] text-[#f3e5ab] text-[10px] font-bold uppercase tracking-widest hover:bg-[#a12323] transition-all shadow-lg" style={{ fontFamily: "'Cinzel', serif" }}>
                      Retirarse
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
);

export default DndArchitectDashboard;