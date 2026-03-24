import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/login'; 
import DashboardDND from './pages/dashboard'; 
import Inventario from './pages/Inventario'; // Importación real del inventario
import Sidebar from './components/Sidebar'; 
import { AuthProvider, useAuth } from './components/AuthContext'; 

function AppContent() {
  // Utilizamos el contexto para el manejo de usuario y logout
  const { user, login, logout } = useAuth(); 
  const [activeTab, setActiveTab] = useState('map');

  // Función de renderizado que combina la lógica de ambos archivos
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
        // Conectamos el componente de Inventario real
        return <Inventario />; 
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
          {/* Usamos el login del contexto */}
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
          {/* SIDEBAR INDEPENDIENTE */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogoutClick={logout} 
          />

          {/* ÁREA DE CONTENIDO DINÁMICO con scroll independiente */}
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

// El componente principal que envuelve todo con el proveedor de autenticación
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}