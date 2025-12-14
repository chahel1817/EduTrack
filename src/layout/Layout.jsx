import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 160px)" }}>
        {children || <Outlet />}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
