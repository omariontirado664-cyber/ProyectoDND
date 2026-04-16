import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/login'; 
import DashboardDND from './pages/dashboard'; 
import Inventario from './pages/Inventario'; 
import Usuarios from './pages/Usuarios';
import Sidebar from './components/Sidebar'; 
import Proveedores from './pages/Proveedores';
import PuntoDeVenta from './pages/PuntoDeVenta'; 
import RentaMesas from './pages/RentaMesas'; // <--- 1. NUEVO IMPORT
import { AuthProvider, useAuth } from './components/AuthContext'; 

function AppContent() {
  const { user, login, logout } = useAuth(); 
  const [activeTab, setActiveTab] = useState('map');
  
  // --- CONTROL DE CARGA ---
  const [isDashboardReady, setIsDashboardReady] = useState(false);

  // Función que llama el DashboardDND al terminar su carga interna
  const handleDashboardLoaded = () => {
    setIsDashboardReady(true);
  };

  // Resetear estados al cerrar sesión
  useEffect(() => {
    if (!user) {
      setIsDashboardReady(false);
      setActiveTab('map');
    }
  }, [user]);

  // Decidimos si mostrar el Sidebar:
  // Si estamos en el mapa, esperamos a que esté listo.
  // Si estamos en cualquier otra pestaña (como pos, vault o tables), lo mostramos siempre.
  const showSidebar = user && (activeTab !== 'map' || isDashboardReady);

  const renderPage = () => {
    switch (activeTab) {
      case 'map': 
        return <DashboardDND user={user} onLogout={logout} onLoaded={handleDashboardLoaded} />;
      case 'pos': 
        return <PuntoDeVenta />;
      case 'vault': 
        return <Inventario />; 
      case 'users': 
        return <Usuarios />;
      case 'providers': 
        return <Proveedores />;
      case 'tables': // <--- 2. NUEVO CASO PARA RENTA DE MESAS
        return <RentaMesas />;
      default: 
        return <DashboardDND user={user} onLogout={logout} onLoaded={handleDashboardLoaded} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="login-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.5 }}
        >
          <Login onLoginSuccess={login} />
        </motion.div>
      ) : (
        <motion.div
          key="main-app-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-screen w-screen bg-[#1a110a] overflow-hidden"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }}
        >
          {/* SIDEBAR SINCRONIZADO CON LA CARGA */}
          <AnimatePresence>
            {showSidebar && (
              <motion.div
                key="sidebar-anim"
                initial={{ x: -110, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -110, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-shrink-0 z-[100]"
              >
                <Sidebar 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  onLogoutClick={logout} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONTENEDOR DE CONTENIDO */}
          <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full min-h-full"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
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