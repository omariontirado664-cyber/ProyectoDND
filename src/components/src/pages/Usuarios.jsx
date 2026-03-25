import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiPerson, GiScrollQuill, 
  GiExtractionOrb, GiCrystalBall, GiWalkingBoot 
} from 'react-icons/gi';
import { FaShieldAlt, FaUserShield } from 'react-icons/fa';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('empleados');

  // URL de tu API en MariaDB
  const API_URL = 'http://proyectodnd.gymnast.com.mx/backend/api/get_usuarios.php';

  const fetchUsuarios = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        // Si el PHP devuelve un error, imprimimos el mensaje detallado de MariaDB
        if (data.error) {
          console.error("DETALLE DEL ERROR DESDE EL SERVIDOR:", data.mensaje);
          setUsuarios([]);
        } else {
          // Si data es un array, lo guardamos; si no, ponemos array vacío
          setUsuarios(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error de conexión o formato JSON inválido:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrado por el campo 'tipo_sistema' generado en el UNION del PHP
  const empleados = usuarios.filter(u => u.tipo_sistema === 'empleado');
  const clientes = usuarios.filter(u => u.tipo_sistema === 'cliente');

  const dataAMostrar = activeTab === 'empleados' ? empleados : clientes;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a110a]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
        <GiCrystalBall className="text-7xl text-[#b45309]" />
      </motion.div>
      <p className="mt-6 text-[#8b5e3c] font-bold text-xs uppercase tracking-[0.5em] animate-pulse">
        Consultando el Censo Real...
      </p>
    </div>
  );

  return (
    <div className="p-10 max-w-[1600px] mx-auto min-h-screen" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2 opacity-70">
          <GiScrollQuill className="text-[#8b5e3c] text-2xl" />
          <span className="text-[10px] uppercase font-bold text-[#e2d7bf] tracking-[0.5em]" style={{ fontFamily: "'Cinzel', serif" }}>
            Registros de la Corona
          </span>
        </div>
        <h1 className="text-6xl font-black text-[#f3e5ab] mb-8" 
            style={{ fontFamily: "'Cinzel Decorative', cursive", textShadow: '2px 2px 0 #8b5e3c' }}>
          GREMIO & AVENTUREROS
        </h1>

        <div className="flex gap-4 border-b border-[#8b5e3c]/30 pb-4">
          <TabButton 
            active={activeTab === 'empleados'} 
            onClick={() => setActiveTab('empleados')}
            icon={<FaShieldAlt />} 
            label="El Gremio"
            count={empleados.length}
          />
          <TabButton 
            active={activeTab === 'clientes'} 
            onClick={() => setActiveTab('clientes')}
            icon={<GiWalkingBoot />} 
            label="Aventureros"
            count={clientes.length}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode='wait'>
          {dataAMostrar.map((user, idx) => (
            <motion.div
              key={user.id_usuario || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <UserCard user={user} isEmpleado={activeTab === 'empleados'} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {dataAMostrar.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-[#8b5e3c]/30 rounded-lg">
          <p className="text-[#8b5e3c] italic text-xl">Este pergamino está en blanco por ahora.</p>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 transition-all relative ${
      active ? 'text-[#f3e5ab]' : 'text-[#8b5e3c] hover:text-[#e2d7bf]'
    }`}
    style={{ fontFamily: "'Cinzel', serif" }}
  >
    <span className="text-2xl">{icon}</span>
    <div className="text-left">
      <p className="text-sm font-bold tracking-tighter uppercase">{label}</p>
      <p className="text-[9px] opacity-60">{count} Almas</p>
    </div>
    {active && (
      <motion.div 
        layoutId="activeTabUnderline" 
        className="absolute bottom-[-17px] left-0 right-0 h-1 bg-[#b45309] shadow-[0_0_10px_#b45309]" 
      />
    )}
  </button>
);

const UserCard = ({ user, isEmpleado }) => (
  <div className="bg-[#f3e5ab] p-6 border-2 border-[#8b5e3c] shadow-xl relative overflow-hidden group hover:border-[#b45309] transition-all"
       style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
    
    <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#8b5e3c] rotate-45 group-hover:bg-[#b45309] transition-colors" />
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#2a1b0c] text-[#f3e5ab] rounded-sm shadow-lg">
          {isEmpleado ? <FaUserShield size={24} /> : <GiPerson size={24} />}
        </div>
        <span className="text-[10px] font-bold text-[#8b5e3c] uppercase tracking-widest" style={{ fontFamily: "'Special Elite', cursive" }}>
          ID: #{user.id_usuario}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-[#2a1b0c] leading-tight mb-1">
        {user.nombre}
      </h3>
      
      <p className="text-[#8b5e3c] text-xs font-bold uppercase mb-4 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
        {isEmpleado ? <span className="text-[#b45309]">Miembro del Gremio</span> : <span>Aventurero Errante</span>}
      </p>

      <div className="space-y-2 border-t border-[#8b5e3c]/20 pt-4">
        <div className="flex justify-between text-[11px]">
          <span className="text-[#8b5e3c] uppercase font-bold">Oficio / Rol:</span>
          <span className="text-[#2a1b0c] font-black uppercase tracking-tighter">{user.rol || 'Sin Rango'}</span>
        </div>
        {user.email && user.email !== 'No registrado' && (
          <div className="flex justify-between text-[11px]">
            <span className="text-[#8b5e3c] uppercase font-bold">Mensajería:</span>
            <span className="text-[#2a1b0c] italic">{user.email}</span>
          </div>
        )}
      </div>

      <button className="w-full mt-6 py-2 border border-[#8b5e3c] text-[#8b5e3c] text-[10px] uppercase font-bold hover:bg-[#2a1b0c] hover:text-[#f3e5ab] transition-all tracking-widest">
        Consultar Expediente
      </button>
    </div>

    <GiExtractionOrb className="absolute -right-4 -bottom-4 text-7xl opacity-[0.05] group-hover:scale-110 transition-transform duration-700" />
  </div>
);

export default Usuarios;