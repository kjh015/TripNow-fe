export const formatDate = (value) => {
  if (!value) return "";

  let date;
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    date = new Date(year, month - 1, day, hour, minute, second);
  } else if (typeof value === "string") {
    const hasTimezone = /[zZ]$|[+-]\d{2}:\d{2}$/.test(value);
    date = new Date(hasTimezone ? value : `${value}+09:00`);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return "";

  return (
    date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0") + " " +
    String(date.getHours()).padStart(2, "0") + ":" +
    String(date.getMinutes()).padStart(2, "0")
  );
};
