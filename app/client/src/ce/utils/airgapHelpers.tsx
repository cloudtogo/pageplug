export const getAssetUrl = (src = "") => {
  if (src.toLowerCase() === "/oracle.svg") {
    return "/logo/Oracle.svg";
  }
  return src;
};

export const isAirgapped = () => {
  return false;
};
