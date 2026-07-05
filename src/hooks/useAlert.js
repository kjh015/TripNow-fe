import { useState, useEffect } from "react";

const useAlert = (autoCloseDuration = 500) => {
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(
        () => setAlert((prev) => ({ ...prev, show: false })),
        autoCloseDuration
      );
      return () => clearTimeout(timer);
    }
  }, [alert.show, autoCloseDuration]);

  const showAlert = (message, type = "success") =>
    setAlert({ show: true, message, type });

  return { alert, showAlert };
};

export default useAlert;
