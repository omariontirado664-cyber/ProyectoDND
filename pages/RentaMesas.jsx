import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiTabletopPlayers, GiDiceTwentyFacesTwenty, GiSandsOfTime, 
  GiShield, // CORREGIDO: Cambiado de GiCrenelatedShield a GiShield
  GiDragonHead, GiCardDraw, GiMeeple,
  GiGoblinHead, GiWizardStaff, GiCoins, GiScrollUnfurled
} from 'react-icons/gi';

const RentaMesas = () => {
  // --- MOCKS DE CONFIGURACIÓN ---
  const TIPOS_JUEGO = [
    { id: 'rpg', label: 'Rol de Mesa (D&D)', icon: <GiDragonHead />, basePrice: 150 },
    { id: 'board', label: 'Juegos de Tablero', icon: <GiMeeple />, basePrice: 80 },
    { id: 'tcg', label: 'Cartas (Magic/TCG)', icon: <GiCardDraw />, basePrice: 50 },
    { id: 'wargame', label: 'Wargames / Miniaturas', icon: <GiShield />, basePrice: 200 }
  ];

  const MESAS = [
    { id: 1, name: "La Guarida del Dragón", cap: 8, color: "bg-red-900/20" },
    { id: 2, name: "Taberna de Moria", cap: 6, color: "bg-stone-800/20" },
    { id: 3, name: "Claro de los Elfos", cap: 4, color: "bg-green-900/20" },
    { id: 4, name: "Bóveda de Isengard", cap: 10, color: "bg-slate-900/20" }
  ];

  // --- ESTADO DE LA RENTA ---
  const [renta, setRenta] = useState({
    mesaId: 1,
    tipoJuego: 'rpg',
    jugadores: 4,
    horas: 2
  });

  const [confirmado, setConfirmado] = useState(false);

  // --- CÁLCULO DE ORO ---
  const calcularTotal = () => {
    const juegoEncontrado = TIPOS_JUEGO.find(j => j.id === renta.tipoJuego);
    const base = juegoEncontrado ? juegoEncontrado.basePrice : 0;
    const multiplicadorJugadores = 1 + (renta.jugadores * 0.1); // +10% por jugador extra
    return Math.round(base * renta.horas * multiplicadorJugadores);
  };

  return (
    <div className="p-10 relative z-10 max-w-[1600px] mx-auto min-h-screen" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      
      <header className="mb-12 border-b-2 border-[#8b5e3c]/20 pb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2 opacity-60">
            <GiTabletopPlayers className="text-[#8b5e3c]" />
            <span className="text-[10px] uppercase font-bold text-[#e2d7bf] tracking-[0.5em]" style={{ fontFamily: "'Cinzel', serif" }}>
              Asignación de Dominios
            </span>
          </div>
          <h1 className="text-6xl font-black text-[#f3e5ab] tracking-tighter"
              style={{ fontFamily: "'Cinzel Decorative', cursive", textShadow: '2px 2px 0 #8b5e3c' }}>
            RENTA DE MESAS
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* PANEL DE CONFIGURACIÓN */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-[#f3e5ab] p-8 border-2 border-[#8b5e3c] shadow-xl" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
            <h3 className="text-2xl font-bold text-[#2a1b0c] mb-6 flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif" }}>
              <GiDiceTwentyFacesTwenty /> Tipo de Campaña
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TIPOS_JUEGO.map(juego => (
                <button 
                  key={juego.id}
                  onClick={() => setRenta({...renta, tipoJuego: juego.id})}
                  className={`p-4 border-2 flex flex-col items-center gap-3 transition-all ${
                    renta.tipoJuego === juego.id 
                    ? 'bg-[#2a1b0c] text-[#f3e5ab] border-[#b45309]' 
                    : 'bg-white/30 border-[#8b5e3c]/20 text-[#2a1b0c] hover:border-[#8b5e3c]'
                  }`}
                >
                  <span className="text-4xl">{juego.icon}</span>
                  <span className="text-[10px] font-bold uppercase text-center">{juego.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f3e5ab] p-8 border-2 border-[#8b5e3c] shadow-xl" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
              <h3 className="text-xl font-bold text-[#2a1b0c] mb-4 flex items-center gap-2"><GiGoblinHead /> Aventureros</h3>
              <input 
                type="range" min="1" max="12" value={renta.jugadores}
                onChange={(e) => setRenta({...renta, jugadores: parseInt(e.target.value)})}
                className="w-full accent-[#b45309] cursor-pointer"
              />
              <p className="text-center mt-4 text-3xl font-black text-[#b45309]" style={{ fontFamily: "'Special Elite', cursive" }}>{renta.jugadores} Almas</p>
            </div>

            <div className="bg-[#f3e5ab] p-8 border-2 border-[#8b5e3c] shadow-xl" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
              <h3 className="text-xl font-bold text-[#2a1b0c] mb-4 flex items-center gap-2"><GiSandsOfTime /> Tiempo de Estancia</h3>
              <div className="flex justify-center items-center gap-6">
                <button onClick={() => setRenta({...renta, horas: Math.max(1, renta.horas - 1)})} className="text-4xl text-[#8b5e3c] hover:text-[#b45309] transition-colors">-</button>
                <span className="text-4xl font-black text-[#2a1b0c]" style={{ fontFamily: "'Special Elite', cursive" }}>{renta.horas} hrs</span>
                <button onClick={() => setRenta({...renta, horas: renta.horas + 1})} className="text-4xl text-[#8b5e3c] hover:text-[#b45309] transition-colors">+</button>
              </div>
            </div>
          </div>

          <div className="bg-[#f3e5ab] p-8 border-2 border-[#8b5e3c] shadow-xl" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}>
            <h3 className="text-xl font-bold text-[#2a1b0c] mb-6 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>Seleccionar Dominio</h3>
            <div className="grid grid-cols-2 gap-4">
              {MESAS.map(mesa => (
                <button 
                  key={mesa.id}
                  onClick={() => setRenta({...renta, mesaId: mesa.id})}
                  className={`relative p-6 border-2 transition-all text-left overflow-hidden ${
                    renta.mesaId === mesa.id 
                    ? 'border-[#b45309] shadow-[0_0_15px_rgba(180,83,9,0.3)]' 
                    : 'border-[#8b5e3c]/20 grayscale hover:grayscale-0'
                  } ${mesa.color}`}
                >
                  <h4 className="font-black text-[#2a1b0c] uppercase text-sm">{mesa.name}</h4>
                  <p className="text-[10px] text-[#8b5e3c] font-bold italic">Capacidad Máx: {mesa.cap} aventureros</p>
                  {renta.mesaId === mesa.id && <GiWizardStaff className="absolute right-2 bottom-2 text-4xl text-[#b45309]/30" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL DE TICKET */}
        <div className="lg:col-span-5">
          <div className="bg-[#fdf8e1] border-x-[12px] border-[#8b5e3c] p-10 shadow-2xl sticky top-10"
               style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')`, minHeight: '600px' }}>
            <div className="text-center border-b-2 border-[#8b5e3c]/20 pb-6 mb-8">
              <GiScrollUnfurled className="text-6xl text-[#8b5e3c] mx-auto mb-2" />
              <h2 className="text-3xl font-black text-[#2a1b0c]" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>CONTRATO DE RENTA</h2>
              <p className="text-[10px] uppercase font-bold text-[#8b5e3c] tracking-widest">Gremio de Vanguard Nogales</p>
            </div>

            <div className="space-y-6 text-xl italic text-[#4a3a2a]">
              <div className="flex justify-between border-b border-[#8b5e3c]/10 pb-2">
                <span>Dominio Elegido:</span>
                <span className="font-bold not-italic text-[#2a1b0c]">{MESAS.find(m => m.id === renta.mesaId).name}</span>
              </div>
              <div className="flex justify-between border-b border-[#8b5e3c]/10 pb-2">
                <span>Tipo de Gesta:</span>
                <span className="font-bold not-italic text-[#2a1b0c]">{TIPOS_JUEGO.find(j => j.id === renta.tipoJuego).label}</span>
              </div>
              <div className="flex justify-between border-b border-[#8b5e3c]/10 pb-2">
                <span>Compañía de:</span>
                <span className="font-bold not-italic text-[#2a1b0c]">{renta.jugadores} Aventureros</span>
              </div>
              <div className="flex justify-between border-b border-[#8b5e3c]/10 pb-2">
                <span>Duración:</span>
                <span className="font-bold not-italic text-[#2a1b0c]">{renta.horas} Horas Marciales</span>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-[10px] font-bold text-[#8b5e3c] uppercase mb-1">Tributo Total al Gremio</p>
              <div className="text-7xl font-black text-[#2a1b0c] flex items-center justify-center gap-3" style={{ fontFamily: "'Special Elite', cursive" }}>
                <GiCoins className="text-[#b45309]" /> {calcularTotal()}
              </div>
              <p className="text-xs font-bold text-[#b45309] mt-2">PIEZAS DE ORO (GP)</p>
            </div>

            <button 
              onClick={() => setConfirmado(true)}
              className="w-full mt-12 py-5 bg-[#2a1b0c] text-[#f3e5ab] font-bold uppercase tracking-[0.3em] text-sm hover:bg-[#b45309] transition-all shadow-xl"
            >
              Sellar y Reservar Mesa
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE ÉXITO */}
      <AnimatePresence>
        {confirmado && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-[#f3e5ab] border-4 border-[#b45309] p-12 text-center max-w-lg shadow-[0_0_50px_rgba(180,83,9,0.5)]"
              style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}
            >
              <GiTabletopPlayers className="text-8xl text-[#b45309] mx-auto mb-6" />
              <h2 className="text-4xl font-black text-[#2a1b0c] mb-4" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>¡DOMINIO ASEGURADO!</h2>
              <p className="text-xl italic text-[#5d4037] mb-10">"El Maestre ha reservado el espacio. Preparen sus dados, la aventura comienza pronto."</p>
              <button 
                onClick={() => setConfirmado(false)}
                className="w-full py-4 bg-[#b45309] text-white font-bold uppercase tracking-widest text-xs"
              >
                Volver al Cuartel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RentaMesas;