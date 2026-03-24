import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/login'; 
import DashboardDND from './pages/dashboard'; 
import Sidebar from './components/Sidebar'; // Asegúrate de haberlo creado

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('spider_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Estado para controlar qué sección del grimorio estamos viendo
  const [activeTab, setActiveTab] = useState('map');

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('spider_session', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('spider_session');
    setUser(null);
  };

  // Función para renderizar la página correspondiente
  const renderPage = () => {
    switch (activeTab) {
      case 'map': return <DashboardDND user={user} onLogout={handleLogout} />;
      case 'stats': return <div className="p-20 text-white">Próximamente: La Torre de Marfil</div>;
      case 'vault': return <div className="p-20 text-white">Próximamente: La Tesorería Real</div>;
      default: return <DashboardDND user={user} onLogout={handleLogout} />;
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
          <Login onLoginSuccess={handleLoginSuccess} />
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
            onLogoutClick={handleLogout} 
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

export default App;