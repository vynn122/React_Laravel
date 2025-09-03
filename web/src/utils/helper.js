import dayjs from "dayjs";

export const FormatDateClientSide = (date, format = "DD/MM/YYYY h:m a") => {
  if (date) {
    return dayjs(date).format(format);
  }
  return null;
};
