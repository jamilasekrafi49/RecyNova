
export function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatPrice(price) {
  return `${Number(price || 0).toFixed(2)} DT`;
}

export function formatWeight(weight) {
  return `${Number(weight || 0).toFixed(2)} kg`;
}

export function formatDuration(minutes) {
  const value = Number(minutes || 0);

  if (value < 60) return `${value} minutes`;

  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;

  return remainingMinutes
    ? `${hours} h ${remainingMinutes} min`
    : `${hours} h`;
}
