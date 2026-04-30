import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './pages/Navbar/Navbar';
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';
import IssueDetails from './pages/IssueDetails/IssueDetails';
import Subscription from './pages/Subscription/Subscription';
import Auth from './pages/Auth/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUser } from './Redux/Auth/Action';
import { fetchProjects } from './Redux/Project/Action';
import UpdateProject from './pages/ProjectDetails/UpdateProject';
import UpgradeSuccessPage from './pages/Subscription/UpgradeSuccess';
import AcceptInvitation from './pages/Project/AcceptInvitation';
import LandingPage from './pages/Home/LandingPage';

// Wrapper component for authenticated routes
const AuthenticatedLayout = ({ children }) => (
  <div>
    <Navbar />
    {children}
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(getUser());
      dispatch(fetchProjects());
    }
  }, [auth.jwt]);

  return (
    <>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Auth />} />
        <Route path='/signup' element={<Auth />} />
        <Route path='/accept_invitation' element={<AcceptInvitation />} />
        
        {/* Authenticated routes */}
        {auth.user ? (
          <>
            <Route path='/home' element={<AuthenticatedLayout><Home /></AuthenticatedLayout>} />
            <Route path='/project/:id' element={<AuthenticatedLayout><ProjectDetails /></AuthenticatedLayout>} />
            <Route path='/project/:projectId/issue/:issueId' element={<AuthenticatedLayout><IssueDetails /></AuthenticatedLayout>} />
            <Route path='/upgrade_plan' element={<AuthenticatedLayout><Subscription /></AuthenticatedLayout>} />
            <Route path='/project/:projectId/edit' element={<AuthenticatedLayout><UpdateProject /></AuthenticatedLayout>} />
            <Route path='/upgrade_plan/success' element={<AuthenticatedLayout><UpgradeSuccessPage /></AuthenticatedLayout>} />
          </>
        ) : null}
      </Routes>
    </>
  );
};

export default App;