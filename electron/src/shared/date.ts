// eslint-disable-next-line import/prefer-default-export
export const currentTime = () => {
  const d = new Date();

  const padZero = (number: number, count = 2) =>
    String(number).padStart(count, '0');

  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(
    d.getDate(),
    2
  )}-${padZero(d.getHours(), 2)}-${padZero(d.getMinutes(), 2)}-${padZero(
    d.getSeconds(),
    2
  )}`;
};
