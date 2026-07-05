import Navbar from "../../common/Navbar";
import Footers from "../../common/Footers";
import GlobalNavigator from "../../common/GlobalNavigator";

const RootLayout = ({ children }) => {
  return (
    <>
      <GlobalNavigator />
      <Navbar />
      <div style={{ paddingTop: 25 }} />
      <main>{children}</main>
      <Footers />
    </>
  );
};

export default RootLayout;
