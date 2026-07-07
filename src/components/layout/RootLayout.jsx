import Navbar from "../../common/Navbar";
import Footer from "../../common/Footer";
import GlobalNavigator from "../../common/GlobalNavigator";

const RootLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <GlobalNavigator />
      <Navbar />
      <div style={{ paddingTop: 25 }} />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
