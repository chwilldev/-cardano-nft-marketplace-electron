import { ipcRenderer } from 'electron';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './App.css';
import Dashboard from './Dashboard';
import GenerateRandomImage from './GenerateRandomImage';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ipcRenderer.once('ipc-example', () => {
  console.log('ipc-example');
});
ipcRenderer.send('ipc-example', { message: 'ping' });

export default function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        theme="colored"
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
