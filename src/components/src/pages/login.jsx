import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiDungeonGate, GiBarbedCoil, GiKey, GiQuill, GiDeathSkull, GiShield 
} from 'react-icons/gi';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ usuario: '', password: '' });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState({ show: false, message: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError({ show: false, message: '' });

    try {
      // CONEXIÓN REAL A IONOS
      const response = await fetch("https://proyectodnd.gymnast.com.mx/backend/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: String(credentials.usuario).trim(),
          password: String(credentials.password).trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 1. GUARDAR SESIÓN: Esto es clave para que el logout funcione después
        localStorage.setItem('spider_session', JSON.stringify(data.user));
        
        // 2. ÉXITO: Pasamos los datos al componente padre (App.js)
        onLoginSuccess(data.user); 
      } else {
        setError({ show: true, message: data.message || "Acceso Denegado" });
        setIsAuthenticating(false);
      }
    } catch (err) {
      setError({ show: true, message: "Error de conexión con la Runa de Datos" });
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0604] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Textura de fondo */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-wood.png')` }} />
      
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md relative z-10">
        
        {/* Logo y Animación de Escudo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            animate={isAuthenticating ? { rotate: 360 } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="relative mb-6"
          >
            <GiBarbedCoil className={`text-[120px] ${error.show ? 'text-red-900' : 'text-amber-900/30'}`} />
            <GiShield className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl ${error.show ? 'text-red-600' : 'text-amber-600'}`} />
          </motion.div>
          <h1 className="text-5xl font-black text-amber-50 tracking-tighter" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>
            SPIDER <span className="text-amber-700 font-light">OS</span>
          </h1>
        </div>

        {/* Formulario Estilo Grim-Dark */}
        <div className="bg-[#140d0a] border border-amber-900/20 p-10 rounded-sm shadow-2xl relative">
          <form onSubmit={handleLogin} className="space-y-8">
            
            {/* Campo Identificador */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black text-amber-700 tracking-[0.4em] flex items-center gap-3">
                <GiQuill /> Identificador
              </label>
              <input 
                type="text" required
                className="w-full bg-black/50 border border-amber-900/30 p-4 text-amber-100 font-mono text-sm focus:border-amber-500 outline-none transition-all"
                value={credentials.usuario}
                onChange={(e) => setCredentials({...credentials, usuario: e.target.value})}
                placeholder="000"
              />
            </div>

            {/* Campo Password */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black text-amber-700 tracking-[0.4em] flex items-center gap-3">
                <GiKey /> Runa de Acceso
              </label>
              <input 
                type="password" required
                className="w-full bg-black/50 border border-amber-900/30 p-4 text-amber-100 font-mono text-sm focus:border-amber-500 outline-none transition-all"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="••••"
              />
            </div>

            {/* Alerta de Error Animada */}
            <AnimatePresence>
              {error.show && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-950/20 border border-red-900/50 p-3 flex items-center gap-3 justify-center overflow-hidden"
                >
                  <GiDeathSkull className="text-red-600" />
                  <span className="text-red-500 text-[9px] font-black uppercase tracking-widest">{error.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón de Invocación */}
            <motion.button 
              whileHover={{ scale: 1.01, backgroundColor: "rgba(120, 53, 15, 0.8)" }}
              whileTap={{ scale: 0.98 }}
              disabled={isAuthenticating}
              className="w-full py-5 bg-amber-900/60 text-amber-100 font-black uppercase tracking-[0.5em] text-[11px] border border-amber-600/30 hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? 'Sincronizando...' : 'Iniciar Sesión'}
            </motion.button>
          </form>
        </div>

        {/* Decoración Inferior Infernal */}
        <div className="mt-6 flex justify-center gap-6 text-amber-900/20 text-2xl">
           <GiDungeonGate />
           <GiBarbedCoil />
           <GiDungeonGate />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;