import { FaMapMarkedAlt } from "react-icons/fa";

const LoadingSpinner = ({ text = "데이터를 불러오는 중...", minHeight = 140 }) => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight }}
    >
      <div className="mb-3" style={{ position: "relative", width: 100, height: 100 }}>
        <FaMapMarkedAlt
          size={70}
          color="#6cb4f8"
          style={{ filter: "drop-shadow(0 4px 12px #aee7ff77)" }}
        />
        <div
          className="spinner-border"
          style={{
            position: "absolute",
            top: -10,
            left: -15,
            width: 100,
            height: 100,
            borderWidth: "6px",
            opacity: 0.5,
            color: "#6cb4f8",
          }}
          role="status"
        />
      </div>
      <div className="mt-2 fs-5 text-secondary">{text}</div>
    </div>
  );
};

export default LoadingSpinner;
