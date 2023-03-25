export const shortenText = (text) => {
  const length = 20;
  return text?.length > length ? `${text.substring(0, length)}...` : text;
};
