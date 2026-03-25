import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiDungeonGate, GiOpenBook, GiStoneTower, 
  GiChest, GiDeathSkull, GiHandTruck, GiScrollUnfurled,
  GiDiceTwentyFacesTwenty,
  GiShop
} from 'react-icons/gi';
import { FaUsers } from 'react-icons/fa';

const SidebarIcon = ({ icon, active, onClick, label }) => (
  <motion.button 
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    /* CORREGIDO: rounded-full y border-4 para círculos perfectos */
    className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 relative group
      ${active ? 'text-[#2a1b0c] bg-[#f3e5ab] border-4 border-[#8b5e3c] shadow-lg' : 'text-[#e2d7bf]/50 hover:text-[#f3e5ab]'}`}
  >
    <div className="text-2xl md:text-3xl relative z-10 transition-transform group-hover:rotate-6">{icon}</div>
    
    <div className="absolute left-20 px-3 py-1 bg-[#f3e5ab] border border-[#8b5e3c] text-[#2a1b0c] text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl translate-x-2 group-hover:translate-x-0 z-[120]"
         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')`, fontFamily: "'Cinzel', serif" }}>
        {label}
    </div>
  </motion.button>
);

const Sidebar = ({ activeTab, setActiveTab, onLogoutClick }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <aside className="h-screen w-24 md:w-28 flex-shrink-0 flex flex-col items-center py-6 z-[110] relative">
        <div className="absolute inset-y-0 left-0 w-full bg-[#2a1b0c] border-r-4 border-[#8b5e3c] shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-wood.png')` }} />
        
        {/* CORREGIDO: Logo también con rounded-full y border-4 */}
        <div className="relative z-10 p-2 md:p-3 bg-[#f3e5ab] rounded-full mb-6 shadow-lg border-4 border-[#8b5e3c] flex-shrink-0">
            <GiDungeonGate className="text-3xl md:text-4xl text-[#2a1b0c]" />
        </div>
        
        <nav className="relative z-10 flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center gap-6 md:gap-8 py-4">
            <SidebarIcon icon={<GiOpenBook />} active={activeTab === 'map'} onClick={() => setActiveTab('map')} label="Grimorio" />
            
            {/* Ícono de Punto de Venta */}
            <SidebarIcon icon={<GiShop />} active={activeTab === 'pos'} onClick={() => setActiveTab('pos')} label="Punto de Venta" />
            
            <SidebarIcon icon={<GiChest />} active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} label="Tesorería" />
            <SidebarIcon icon={<FaUsers />} active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="Censo Real" />
            <SidebarIcon icon={<GiHandTruck />} active={activeTab === 'providers'} onClick={() => setActiveTab('providers')} label="Proveedores" />
        </nav>
        
        <div className="mt-auto relative z-10 pt-4 flex-shrink-0">
          <button 
            onClick={() => setShowConfirm(true)} 
            className="group p-2 md:p-4 transition-all flex flex-col items-center gap-1"
          >
            <GiDeathSkull className="text-3xl md:text-4xl text-[#8b5e3c]/60 group-hover:text-[#7f1d1d] transition-all duration-300 scale-100 group-hover:scale-110" />
            <span className="text-[7px] text-[#8b5e3c] opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest text-center">Abandonar</span>
          </button>
        </div>
      </aside>

      {/* MODAL DE ADVERTENCIA */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0" />
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 50, opacity: 0 }}
              className="relative bg-[#f3e5ab] w-full max-w-md p-1 border-2 border-[#8b5e3c] shadow-2xl overflow-hidden" 
              style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}
            >
              <GiDiceTwentyFacesTwenty className="absolute text-[16rem] text-[#8b5e3c]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

              <div className="border-2 border-[#8b5e3c]/30 p-8 flex flex-col items-center text-center relative z-10">
                
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#8b5e3c]/40 border border-[#8b5e3c]/60"></div>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8b5e3c]/40 border border-[#8b5e3c]/60"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#8b5e3c]/40 border border-[#8b5e3c]/60"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#8b5e3c]/40 border border-[#8b5e3c]/60"></div>

                <GiScrollUnfurled className="text-5xl text-[#8b5e3c]" />
                
                <h2 className="text-2xl font-black text-[#2a1b0c] uppercase tracking-tighter mt-3" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>
                  ¿Finalizar la Partida?
                </h2>

                <div className="flex items-center w-3/4 justify-center gap-2 my-4 opacity-70">
                  <div className="h-[1px] w-full bg-[#8b5e3c]" />
                  <GiDiceTwentyFacesTwenty className="text-[#8b5e3c] text-xl" />
                  <div className="h-[1px] w-full bg-[#8b5e3c]" />
                </div>
                
                <p className="text-[#5d4037] italic mb-8 font-medium px-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                  La campaña se detiene aquí. Los registros del gremio han sido sellados de forma segura. ¿Deseas cerrar el portal?
                </p>

                <div className="w-full space-y-3">
                  <button 
                    onClick={onLogoutClick}
                    className="w-full py-3 bg-[#7f1d1d] text-[#f3e5ab] font-bold uppercase text-[10px] tracking-widest hover:bg-[#991b1b] transition-all"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Cerrar Sesión
                  </button>
                  
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className="w-full py-3 border-2 border-[#8b5e3c] text-[#2a1b0c] font-bold uppercase text-[10px] tracking-widest hover:bg-[#8b5e3c]/10 transition-all"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Permanecer en el Gremio
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default Sidebar;