import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModulePage from './pages/ModulePage';
import ValidateCertificate from './pages/ValidateCertificate';
import Profile from './pages/Profile';
import CertificateEmission from './pages/CertificateEmission';
import GeneralExam from './pages/GeneralExam';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="/exam" element={<GeneralExam />} />
        <Route path="/validate" element={<ValidateCertificate />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/certificate" element={<CertificateEmission />} />
      </Routes>
    </BrowserRouter>
  );
}
