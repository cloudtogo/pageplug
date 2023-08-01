export const getAssetUrl = (src = "") => {
  if (typeof src === "string" && src.toLowerCase() === "/oracle.svg") {
    return "/logo/oracle.svg";
  }
  return src;
};

export const isAirgapped = () => {
  return false;
};
