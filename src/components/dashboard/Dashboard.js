import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../Header/Header';
import { FaHome, FaUserAlt, FaStore, FaBox, FaTruck, FaUsers, FaRegChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { pendingCount } from '../../api/livraisonService';
import { getById as getAdminById } from '../../api/adminService';
import { fetchMarketById } from '../../api/marketService';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001');

function Dashboard({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const [pendingDeliveriesCount, setPendingDeliveriesCount] = useState(() => {
    return localStorage.getItem('pendingDeliveriesCount') || 0;
  });
  const [openIndexes, setOpenIndexes] = useState(() => {
    const savedOpenIndexes = localStorage.getItem('openIndexes');
    return savedOpenIndexes ? JSON.parse(savedOpenIndexes) : {};
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    return savedSidebarState === 'true';
  });
  const [isHovering, setIsHovering] = useState(false);
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('profileImage') || '';
  });

  // const fetchPendingDeliveries = useCallback(async () => {
  //   try {
  //     const data = await pendingCount();
  //     setPendingDeliveriesCount(data.count);
  //     localStorage.setItem('pendingDeliveriesCount', data.count);  // Save to localStorage
  //   } catch (error) {
  //     console.error('Error fetching pending deliveries count', error);
  //   }
  // }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      let data;
      if (role === 'admin') {
        data = await getAdminById(userId);
      } else if (role === 'market') {
        data = await fetchMarketById(userId);
      }

      if (data && data.image) {
        const imageSrc = `data:image/jpeg;base64,${data.image}`;
        setProfileImage(imageSrc);
        localStorage.setItem('profileImage', imageSrc);  // Save to localStorage
      }
    } catch (error) {
      console.error('Error fetching user profile', error);
    }
  }, [role, userId]);

  // useEffect(() => {
  //   fetchPendingDeliveries();
  //   fetchUserProfile();

  //   // Listen to all relevant socket events
  //   socket.on('updatePendingCount', fetchPendingDeliveries);
  //   socket.on('statusChange', fetchPendingDeliveries);
  //   socket.on('addLivraison', fetchPendingDeliveries);

  //   return () => {
  //     socket.off('updatePendingCount', fetchPendingDeliveries);
  //     socket.off('statusChange', fetchPendingDeliveries);
  //     socket.off('addLivraison', fetchPendingDeliveries);
  //   };
  // }, [fetchPendingDeliveries, fetchUserProfile]);

  const handleLogout = () => {
    console.log('handleLogout function called');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('openIndexes');
    localStorage.removeItem('pendingDeliveriesCount');
    localStorage.removeItem('profileImage');
    navigate('/');
  };

  const toggleDropdown = useCallback((index) => {
    setOpenIndexes((prevState) => {
      const newOpenIndexes = { ...prevState, [index]: !prevState[index] };
      localStorage.setItem('openIndexes', JSON.stringify(newOpenIndexes));
      return newOpenIndexes;
    });
  }, []);

  const sidebarItems = [
    // { title: 'Dashboard', icon: FaHome, path: `/admin/dashboard`, roles: ['admin', 'market'] },
    {
      title: 'Reservations', icon: FaTruck, roles: ['admin'], subItems: [
        { title: 'Listes des Reservations', path: '/reservations/listes' },
        { 
          title: 'Demandes des Reservations', 
          path: '/reservations/pending', 
          counter: pendingDeliveriesCount 
        }
      ]
    },
    { title: 'Clients', icon: FaUserAlt, path: '/clients', roles: ['admin'] },
    // { title: 'Magasins', icon: FaStore, path: '/magasins', roles: ['admin'] },
    { title: 'Review', icon: FaBox, path: '/Reviews', roles: ['admin', 'market'] },
    // {
    //   title: 'Demande Livraison', icon: FaTruck, roles: ['market'], subItems: [
    //     { title: 'Liste des livraisons', path: '/livraison/demandes' },
    //     { title: 'Proposer une livraison', path: '/commands/propositions' }
    //   ]
    // },
    // {
    //   title: 'Chauffeurs', icon: FaTruck, roles: ['admin', 'driver'], subItems: [
    //     { title: 'Gérer les chauffeurs', path: '/chauffeurs/Gérer' },
    //     { title: 'Fiche de route', path: '/route' }
    //   ]
    // },
    // { title: 'Utilisateurs', icon: FaUsers, path: '/utilisateurs', roles: ['admin'] },
    // {
    //   title: 'Plans', icon: FaRegChartBar, roles: ['admin'], subItems: [
    //     { title: 'Gérer le plans', path: '/plans' },
    //     { title: 'Secture', path: '/plans/secteurs' }
    //   ]
    // },
    { title: 'Logout', icon: FaSignOutAlt, onClick: handleLogout, roles: ['admin', 'market', 'driver', 'user'] },
  ];

  const filteredItems = sidebarItems.filter(item => item.roles.includes(role));

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', newState);
  };

  const shouldShowHeader = location.pathname !== '/profile';

  return (
    <div>
      <Sidebar 
        items={sidebarItems} 
        openIndexes={openIndexes} 
        toggleDropdown={toggleDropdown} 
        isOpen={sidebarOpen || isHovering}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onLogout={handleLogout} 
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen || isHovering ? 'ml-64' : 'ml-16'} sm:ml-0`}>
        {shouldShowHeader && <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen || isHovering} profileImage={profileImage} />}
      </div>
    </div>
  );
}

export default Dashboard;
