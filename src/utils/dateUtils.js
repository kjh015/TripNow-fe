export const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString.includes("+") ? isoString : isoString + "+09:00");
  return (
    date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0") + " " +
    String(date.getHours()).padStart(2, "0") + ":" +
    String(date.getMinutes()).padStart(2, "0")
  );
};
