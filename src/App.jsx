import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/login'; 
import DashboardDND from './pages/dashboard'; 

function App() {
  // Intentamos recuperar la sesión guardada al cargar la app
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('spider_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Función que se ejecuta cuando el login en IONOS es exitoso
  const handleLoginSuccess = (userData) => {
    localStorage.setItem('spider_session', JSON.stringify(userData));
    setUser(userData);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('spider_session');
    setUser(null);
  };

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        /* Pantalla 1: El Sello de Acceso */
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
        /* Pantalla 2: El Centro de Comando (Dashboard) */
        <motion.div
          key="dashboard-screen"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Pasamos los datos del usuario al Dashboard para personalización */}
          <DashboardDND user={user} onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;