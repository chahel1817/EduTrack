import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-bg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      <main style={{
        flex: 1,
        paddingTop: '80px', // Account for fixed navbar
        background: 'var(--surface-bg)'
      }}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
