export default (num: number, length: number): string => {
  return (Array(length).join("0") + num).slice(-length);
};
