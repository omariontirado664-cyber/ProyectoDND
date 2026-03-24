import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/login'; 
import DashboardDND from './pages/dashboard'; 
import Sidebar from './components/Sidebar'; 
import { AuthProvider, useAuth } from './components/AuthContext'; // Importas ambos

// 1. Creamos un componente interno para poder usar el Hook useAuth
function AppContent() {
  const { user, login, logout } = useAuth(); // Sacamos lo que antes tenías manual
  const [activeTab, setActiveTab] = useState('map');

  // Función para renderizar la página correspondiente (Tal cual la tenías)
  const renderPage = () => {
    switch (activeTab) {
      case 'map': return <DashboardDND user={user} onLogout={logout} />;
      case 'stats': return <div className="p-20 text-white font-serif italic text-2xl">Próximamente: La Torre de Marfil</div>;
      case 'vault': return <div className="p-20 text-white font-serif italic text-2xl">Próximamente: La Tesorería Real</div>;
      default: return <DashboardDND user={user} onLogout={logout} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="login-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
          transition={{ duration: 0.8 }}
        >
          {/* Usamos el login del contexto en vez del handleLoginSuccess manual */}
          <Login onLoginSuccess={login} />
        </motion.div>
      ) : (
        <motion.div
          key="main-app-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-screen bg-[#1a110a]"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }}
        >
          {/* SIDEBAR INDEPENDIENTE */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogoutClick={logout} 
          />

          {/* ÁREA DE CONTENIDO DINÁMICO */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 2. El componente principal solo envuelve al contenido con el Provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
