import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Test from "./components/Test";
function App() {
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnFocusLoss={false}
      />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
