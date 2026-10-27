import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/empleos" element={<JobsPage />} />
        <Route path="/empleos/:id" element={<JobDetailPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
