import { Routes, Route } from 'react-router-dom';
import Login from '../login/Login';
import Dashboard from '../dashboard/Dashboard';
import Clients from '../clients/Clients';
import Magasins from '../magasins/Magasins';
import Produits from '../Produit/Produit';
import Chauffeurs from '../chauffeurs/Gérer les chauffeurs/Chauffeurs';
import Utilisateurs from '../utilisateurs/Utilisateurs';
import Secteurs from '../Plans/Secteurs/Secteurs';
import Settings from '../settings/Settings';
import ProtectedRoute from '../../ProtectedRoute';
import PublicRoute from '../../publicroute';
import Livraison from '../livraison/Livraison';
import InvoicePDF from '../livraison/pdf/Invoice';
import Plans from '../Plans/Plans';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import DemandesLivraison from '../DemandesLivraison/DemandesLivraison';
import Demandes from '../livraison/DemandeslivraisonsAdmin/Demande';
import AdminDashboard from '../dashboard/AdminDashboard';
import FicheDeRoute from '../FicheDeRoute/FicheDeRoute';
import Profile from '../Profile/Profile';
import MarketDashboard from '../dashboard/MarketDashboard';
import RouteSheetPDF from '../livraison/pdf/RouteSheetPDF';
import MarketList from '../ListeLivraisonMarket/MarketList';
import TwoAuth from '../Two-auth/TwoAuth';

function Routing() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<PublicRoute element={<Login />} />} />
        <Route path="/two-auth" element={<PublicRoute element={<TwoAuth />} />} />
        {/* <Route path="/admin/dashboard" element={<PublicRoute element={<AdminDashboard />}  />} /> */}
        {/* <Route path="/market/dashboard" element={<PublicRoute element={<MarketDashboard />} />} /> */}
        <Route path="/reservations/listes" element={<PublicRoute element={<Livraison />} />} />
        <Route path="/reservations/pending" element={<PublicRoute element={<Demandes />} />} />
        
        <Route path="/clients" element={<PublicRoute element={<Clients />}  />} />
        {/*<Route path="/magasins" element={<PublicRoute element={<Magasins />}  />} /> */}
        <Route path="/Reviews" element={<PublicRoute element={<Produits />}  />} />
        {/* <Route path="/chauffeurs/Gérer" element={<PublicRoute element={<Chauffeurs />} />} />
        <Route path="/utilisateurs" element={<PublicRoute element={<Utilisateurs />} />} />
        <Route path="/plans/secteurs" element={<PublicRoute element={<Secteurs />} />} />
        <Route path="/settings" element={<PublicRoute element={<Settings />} />} />
        <Route path="/invoice/:NumeroCommande" element={<InvoicePDF />} />
        <Route path="/route/:reference" element={<RouteSheetPDF />} />
        <Route path="/commands/propositions" element={<DemandesLivraison />} />
        <Route path="/plans" element={<Plans />} /> */}
        {/* <Route path="/route" element={<PublicRoute element={<FicheDeRoute />}  />} /> */}
        <Route path="/profile" element={<PublicRoute element={<Profile />} />} />
        {/* <Route path="/route-sheet/driver/:driverId/date/:date" element={<PublicRoute element={<RouteSheetPDF />} />} />
        <Route path="/livraison/demandes" element={<PublicRoute element={<MarketList />} />} /> */}

      </Routes>
    </Provider>
  );
}

export default Routing;
