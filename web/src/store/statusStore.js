export const setStatus = (status) => {
  localStorage.setItem("status", status);
};

export const getStatus = () => {
  return localStorage.getItem("status");
};
