import React from "react";
import type { TagSizes } from "design-system";
import { Tag } from "design-system";
import { BUSINESS_TAG, createMessage } from "@appsmith/constants/messages";

const BusinessTag = ({
  classes = "",
  size,
}: {
  classes?: string;
  size?: TagSizes;
}) => {
  return (
    <Tag
      className={`business-tag ${classes}`}
      data-testid="t--business-tag"
      isClosable={false}
      kind="neutral"
      {...(size && { size })}
      style={{
        backgroundColor: "transparent",
        borderColor: "#27b7b7",
        color: "#27b7b7",
        fontWeight: 700,
      }}
    >
      {createMessage(BUSINESS_TAG)}
    </Tag>
  );
};

export default BusinessTag;
