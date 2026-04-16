import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/login'; 
import DashboardDND from './pages/dashboard'; 
import Inventario from './pages/Inventario'; 
import Usuarios from './pages/Usuarios'; // 1. Importación del nuevo componente
import Sidebar from './components/Sidebar'; 
import Proveedores from './pages/Proveedores';
import { AuthProvider, useAuth } from './components/AuthContext'; 

function AppContent() {
  const { user, login, logout } = useAuth(); 
  const [activeTab, setActiveTab] = useState('map');

  // 2. Actualizamos la función de renderizado para incluir 'users'
  const renderPage = () => {
    switch (activeTab) {
      case 'map': 
        return <DashboardDND user={user} onLogout={logout} />;
      case 'stats': 
        return (
          <div className="flex items-center justify-center h-screen text-[#f3e5ab] font-serif">
            <h2 className="text-4xl uppercase tracking-widest opacity-50 italic">La Torre de Marfil (Próximamente)</h2>
          </div>
        );
      case 'vault': 
        return <Inventario />; 
      case 'users': // 3. Caso para el Censo Real
        return <Usuarios />;
      case 'providers':
        return <Proveedores></Proveedores>;
      default: 
        return <DashboardDND user={user} onLogout={logout} />;
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
          <Login onLoginSuccess={login} />
        </motion.div>
      ) : (
        <motion.div
          key="main-app-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-screen bg-[#1a110a] overflow-x-hidden"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }}
        >
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogoutClick={logout} 
          />

          <div className="flex-1 h-screen overflow-y-auto custom-scrollbar">
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
