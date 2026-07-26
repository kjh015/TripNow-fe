
//페이지 하단 공통 푸터
const APP_NAME = process.env.REACT_APP_APP_NAME || "TripNow";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer border-top">
      <div className="container text-center text-muted app-footer-copy">
        © {year} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
