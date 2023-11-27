import React from "react";

// 自定义 SVG 图标组件
const EmailSVGIcon = ({ className }: any) => (
  <div className={className}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.66675 16.25H18.3334V10V3.75H10.0001H1.66675V10V16.25Z"
        stroke="#8A9997"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M1.66675 3.75L10.0001 10L18.3334 3.75"
        stroke="#8A9997"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0001 3.75H1.66675V10"
        stroke="#8A9997"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 10V3.75H10"
        stroke="#8A9997"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default EmailSVGIcon;
