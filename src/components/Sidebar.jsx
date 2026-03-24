import React from 'react';
import { motion } from 'framer-motion';
import { 
  GiDungeonGate, GiOpenBook, GiStoneTower, 
  GiChest, GiDeathSkull 
} from 'react-icons/gi';
import { FaUsers } from 'react-icons/fa'; // Importamos un icono seguro para el censo

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

const Sidebar = ({ activeTab, setActiveTab, onLogoutClick }) => {
  return (
    <aside className="sticky top-0 h-screen w-28 flex-shrink-0 flex flex-col items-center py-10 z-[110]">
      
      {/* Fondo de madera tallada */}
      <div className="absolute inset-y-0 left-0 w-full bg-[#2a1b0c] border-r-4 border-[#8b5e3c] shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
           style={{ 
             backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-wood.png')`, 
             clipPath: 'polygon(0 0, 100% 0, 100% 40%, 85% 45%, 85% 55%, 100% 60%, 100% 100%, 0 100%)' 
           }} />
      
      {/* Logo / Puerta de la Taberna */}
      <div className="relative z-10 p-3 bg-[#f3e5ab] rounded-full mb-12 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-[#8b5e3c]">
          <GiDungeonGate className="text-4xl text-[#2a1b0c]" />
      </div>
      
      {/* Navegación Mística */}
      <nav className="relative z-10 flex flex-col gap-10">
          <SidebarIcon 
            icon={<GiOpenBook />} 
            active={activeTab === 'map'} 
            onClick={() => setActiveTab('map')} 
            label="Grimorio" 
          />
          <SidebarIcon 
            icon={<GiStoneTower />} 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            label="La Torre" 
          />
          <SidebarIcon 
            icon={<GiChest />} 
            active={activeTab === 'vault'} 
            onClick={() => setActiveTab('vault')} 
            label="Tesorería" 
          />
          {/* SECCIÓN CORREGIDA: Censo Real */}
          <SidebarIcon 
            icon={<FaUsers />} 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
            label="Censo Real" 
          />
      </nav>
      
      {/* Botón de Salida (Cráneo) */}
      <button onClick={onLogoutClick} className="mt-auto relative z-10 group p-4 transition-all">
          <GiDeathSkull className="text-3xl text-[#8b5e3c]/60 group-hover:text-[#7f1d1d] transition-all duration-300 scale-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_#7f1d1d]" />
      </button>
    </aside>
  );
};

export default Sidebar;