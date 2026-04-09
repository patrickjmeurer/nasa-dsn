import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { AboutPage } from "./pages/AboutPage";
import { AntennasPage } from "./pages/AntennasPage";
import { MetricsPage } from "./pages/MetricsPage";
import { MissionsPage } from "./pages/MissionsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { StationsPage } from "./pages/StationsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/antennas" element={<AntennasPage />} />
          <Route path="/stations" element={<StationsPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
