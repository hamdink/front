import { faBox, faStore, faTruck, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchClients } from '../../api/clientService';
import { fetchDrivers } from '../../api/driverService';
import { fetchLivraisons } from '../../api/livraisonService';
import { fetchMagasins } from '../../api/marketService';
import { fetchPlans } from '../../api/plansService';
import { fetchProducts } from '../../api/productService';
import { fetchallSectures } from '../../api/sectureService';
import ReadOnlyCalendarComponent from '../Calendar/ReadOnly/ReadOnlyCalendarComponent';
import './AdminDashboard.css';
import Dashboard from './Dashboard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const PERIOD_COLORS = ['#0088FE', '#00C49F'];

const AdminDashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const [magasinCount, setMagasinCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [sectures, setSectures] = useState([]);
  const [livraisons, setLivraisons] = useState([]);
  const [secteurStats, setSecteurStats] = useState([]);
  const [periodStats, setPeriodStats] = useState([]);
  const [orderTrendData, setOrderTrendData] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showAllNotes, setShowAllNotes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await fetchClients();
        const magasins = await fetchMagasins();
        const products = await fetchProducts();
        const drivers = await fetchDrivers();
        const secturesData = await fetchallSectures();
        const orders = await fetchLivraisons();
        const plansData = await fetchPlans();

        setClientCount(clients.total || clients.length || 0);
        setMagasinCount(magasins.total || magasins.length || 0);
        setProductCount(products.total || products.length || 0);
        setDriverCount(drivers.total || drivers.length || 0);
        setOrderCount(orders.total || orders.length || 0);
        setSectures(secturesData || []);
        const livraisonsData = Array.isArray(orders.livraisons) ? orders.livraisons : orders;
        setLivraisons(livraisonsData || []);
        setPlans(plansData);

        const secteurs = calculateSecteurStats(livraisonsData || [], secturesData || []);
        setSecteurStats(secteurs);

        const periods = calculatePeriodStats(livraisonsData || []);
        setPeriodStats(periods);

        const trends = calculateOrderTrends(livraisonsData || []);
        setOrderTrendData(trends);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateSecteurStats = (livraisons, sectures) => {
    const secteurCounts = {};

    if (!Array.isArray(livraisons)) return [];

    livraisons.forEach((livraison) => {
      const secteur = sectures.find(s => s.codesPostaux.includes(parseInt(livraison.client.code_postal)));
      if (secteur) {
        if (secteurCounts[secteur.name]) {
          secteurCounts[secteur.name]++;
        } else {
          secteurCounts[secteur.name] = 1;
        }
      }
    });

    const totalLivraisons = livraisons.length;
    const secteurStats = Object.keys(secteurCounts).map((secteur) => ({
      name: secteur,
      value: (secteurCounts[secteur] / totalLivraisons) * 100,
    }));

    const roundedSecteurStats = secteurStats.map(secteur => ({
      name: secteur.name,
      value: Math.round(secteur.value * 10) / 10 // round to 1 decimal place
    }));

    const sumOfValues = roundedSecteurStats.reduce((acc, curr) => acc + curr.value, 0);
    const adjustment = 100 - sumOfValues;

    if (adjustment !== 0) {
      roundedSecteurStats[0].value += adjustment; // adjust the first value to ensure total is 100%
    }

    return roundedSecteurStats;
  };

  const calculatePeriodStats = (livraisons) => {
    const periodCounts = {
        Matin: 0,
        Midi: 0,
    };

    if (!Array.isArray(livraisons)) return [];

    livraisons.forEach((livraison) => {
        const period = livraison.Periode; // Assuming 'Periode' is the correct field name in your data
        if (periodCounts[period] !== undefined) {
            periodCounts[period]++;
        }
    });

    const totalLivraisons = livraisons.length;
    const periodStats = Object.keys(periodCounts).map((period) => ({
        name: period,
        value: (periodCounts[period] / totalLivraisons) * 100,
        count: periodCounts[period],
    }));

    return periodStats;
};


  const calculateOrderTrends = (livraisons) => {
    if (!Array.isArray(livraisons)) return [];

    const trends = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const ordersByMonth = livraisons.reduce((acc, livraison) => {
      const date = new Date(livraison.Date);
      const month = date.getMonth();
      const year = date.getFullYear();

      if (!acc[year]) acc[year] = new Array(12).fill(0);
      acc[year][month]++;
      return acc;
    }, {});

    for (let i = 0; i < 12; i++) {
      trends.push({
        name: months[i],
        'Last Year': ordersByMonth[previousYear] ? ordersByMonth[previousYear][i] : 0,
        'This Year': ordersByMonth[currentYear] ? ordersByMonth[currentYear][i] : 0,
      });
    }

    return trends;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 22; // Move the label a bit outside the pie chart
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Calculate text anchor and adjust position if necessary
    const textAnchor = x > cx ? 'start' : 'end';

    // Access the period name from the periodStats data
    const periodName = periodStats[index]?.name || ''; 

    return (
        <text
            x={x}
            y={y}
            fill={PERIOD_COLORS[index % PERIOD_COLORS.length]}  // Use the corresponding color
            textAnchor={textAnchor}
            dominantBaseline="central"
            style={{
                fontSize: '0.9rem', 
                whiteSpace: 'nowrap',
                maxWidth: '10px', 
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}
        >
            {`${percent ? `${periodName}: ${(percent * 100).toFixed(1)}%` : ''}`} 
        </text>
    );
};


  const toggleShowAllNotes = () => {
    setShowAllNotes(!showAllNotes);
  };

  const today = format(new Date(), 'yyyy-MM-dd'); // Get today's date in 'yyyy-MM-dd' format
  const todayNotes = plans.filter(plan => plan.Date === today && plan.notes);

  return (
    <div className="dashboard-container">
      <Dashboard title="Dashboard" className="sidebar" />
      <div className="main-content">
        <div className="header-section">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="calendar-and-notes-section flex flex-col md:flex-row">
          <div className="calendar-container w-full md:w-1/2 p-2">
            <ReadOnlyCalendarComponent plans={plans} /> {/* Pass the plans data here */}
          </div>
          <div className="notes-container w-full md:w-1/2 p-2">
            <h2 className="text-xl font-semibold mb-2">Today's Notes</h2>
            {todayNotes.length > 0 ? (
              todayNotes.map(note => (
                <div key={note._id} className="sticky-note mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-sm">
                  <strong>{format(parseISO(note.Date), 'MMM dd, yyyy')}</strong>
                  <p>{note.notes}</p>
                </div>
              ))
            ) : (
              <p>No notes for today</p>
            )}
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition"
              onClick={toggleShowAllNotes}
            >
              {showAllNotes ? 'Hide All Notes' : 'Show All Notes'}
            </button>
            {showAllNotes && (
              <div className="mt-4">
                {plans.filter(plan => plan.notes).map(note => (
                  <div key={note._id} className="note mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-sm">
                    <strong>{format(parseISO(note.Date), 'MMM dd, yyyy')}</strong>
                    <p>{note.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="stats-section">
          <div className="stat-card">
            <h2 className="stat-title">Order Period</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={periodStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#82ca9d"
                  labelLine={true}
                  label={renderCustomizedLabel}
                >
                  {periodStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PERIOD_COLORS[index % PERIOD_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${props.payload.count} orders`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="order-period-legend">
              {periodStats.map((entry, index) => (
                <div key={`legend-${index}`} className="legend-item">
                  <div className="legend-color-box" style={{ backgroundColor: PERIOD_COLORS[index % PERIOD_COLORS.length] }}></div>
                  <span className="legend-text text-xs sm:text-sm md:text-base lg:text-lg">{entry.name} ({entry.count} orders)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="stat-card">
            <h2 className="stat-title">Secteur</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={secteurStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value.toFixed(1)}%`} className="text-xs sm:text-sm md:text-base lg:text-lg">
                  {secteurStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="stat-card">
            <h2 className="stat-title">Order Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Last Year" stroke="#8884d8" />
                <Line type="monotone" dataKey="This Year" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="summary-section">
          <div className="summary-card">
            <div>
              <h2 className="summary-title">Clients</h2>
              <p className="summary-count">{clientCount}</p>
            </div>
            <FontAwesomeIcon icon={faUsers} className="summary-icon"/>
          </div>
          <div className="summary-card">
            <div>
              <h2 className="summary-title">Magasins</h2>
              <p className="summary-count">{magasinCount}</p>
            </div>
            <FontAwesomeIcon icon={faStore} className="summary-icon"/>
          </div>
          <div className="summary-card">
            <div>
              <h2 className="summary-title">Produits</h2>
              <p className="summary-count">{productCount}</p>
            </div>
            <FontAwesomeIcon icon={faBox} className="summary-icon"/>
          </div>
          <div className="summary-card">
            <div>
              <h2 className="summary-title">Chauffeurs</h2>
              <p className="summary-count">{driverCount}</p>
            </div>
            <FontAwesomeIcon icon={faTruck} className="summary-icon"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
