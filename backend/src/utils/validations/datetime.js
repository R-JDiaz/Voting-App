export const validateDateRange = (data) => {
  if (!data.start_date || !data.end_date) return true;

  return new Date(data.start_date) < new Date(data.end_date);
};