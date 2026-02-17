import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'

// Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AnalyzeKeyword from './pages/AnalyzeKeyword'
import ContentBacklog from './pages/ContentBacklog'
import CreateBrief from './pages/CreateBrief'
import ProduceContent from './pages/ProduceContent'
import Published from './pages/Published'

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Home />} />

      {/* All routes accessible without auth for testing */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyze" element={<AnalyzeKeyword />} />
        <Route path="/backlog" element={<ContentBacklog />} />
        <Route path="/brief" element={<CreateBrief />} />
        <Route path="/produce" element={<ProduceContent />} />
        <Route path="/published" element={<Published />} />
      </Route>

      {/* Catch all — redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
