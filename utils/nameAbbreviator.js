export const abbreviateName = (text) => {
  const splitedStr = text.trim().split(/\s+/);
  return `${splitedStr[0].charAt(0)}.${splitedStr[1].charAt(0)}`;
};
