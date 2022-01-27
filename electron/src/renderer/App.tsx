import { ipcRenderer } from 'electron';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import GenerateRandomImage from './GenerateRandomImage';

import 'bootstrap/dist/css/bootstrap.min.css';

ipcRenderer.once('ipc-example', () => {
  console.log('ipc-example');
});
ipcRenderer.send('ipc-example', { message: 'ping' });

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/generate-random-image"
          element={<GenerateRandomImage />}
        />
      </Routes>
    </Router>
  );
}
