import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { GISMapPage } from './pages/GISMapPage';
import { VerifyTransactionPage } from './pages/VerifyTransactionPage';
import { GovernmentDashboard } from './pages/GovernmentDashboard';
import { DepartmentDashboard } from './pages/DepartmentDashboard';
import { ContractorDashboard } from './pages/ContractorDashboard';
import { AuditorDashboard } from './pages/AuditorDashboard';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FBFBFD] text-slate-900 font-sans selection:bg-cyan-500/20 selection:text-cyan-900">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<CitizenDashboard />} />
              <Route path="/projects" element={<CitizenDashboard />} />
              <Route path="/project/:id" element={<ProjectDetailsPage />} />
              <Route path="/gis" element={<GISMapPage />} />
              <Route path="/verify" element={<VerifyTransactionPage />} />
              <Route path="/follow-the-money" element={<CitizenDashboard />} />
              <Route path="/government" element={<GovernmentDashboard />} />
              <Route path="/department" element={<DepartmentDashboard />} />
              <Route path="/contractor" element={<ContractorDashboard />} />
              <Route path="/auditor" element={<AuditorDashboard />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
