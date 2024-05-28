export const getAssetUrl = (src = "") => {
  if (typeof src === "string" && src.toLowerCase() === "/oracle.svg") {
    return "/logo/oracle.svg";
  }
  if (src.includes("smtp-icon.svg")) {
    return "/logo/smtp-icon.svg";
  }
  return src;
};

export const isAirgapped = () => {
  return false;
};
