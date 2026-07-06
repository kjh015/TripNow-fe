import Navbar from "../../common/Navbar";
import Footers from "../../common/Footers";
import GlobalNavigator from "../../common/GlobalNavigator";

const RootLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <GlobalNavigator />
      <Navbar />
      <div style={{ paddingTop: 25 }} />
      <main className="app-main">{children}</main>
      <Footers />
    </div>
  );
};

export default RootLayout;
