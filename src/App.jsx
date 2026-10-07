import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import LabLayout from './layouts/LabLayout.jsx'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Achievements from './pages/Achievements.jsx'
import AddressingTool from './pages/lab/AddressingTool.jsx'
import NumberSystems from './pages/lab/NumberSystems.jsx'
import Assignments from './pages/lab/Assignments.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/lab" element={<LabLayout />}>
          <Route index element={<Navigate to="/lab/addressing" replace />} />
          <Route path="addressing" element={<AddressingTool />} />
          <Route path="number-systems" element={<NumberSystems />} />
          <Route path="assignments" element={<Assignments />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
