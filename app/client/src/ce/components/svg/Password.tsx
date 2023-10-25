import React from 'react';

// 自定义 SVG 图标组件
const PasswordSVGIcon = ({ className, showPassword, isShowPassword }: any) => {
  const handleIconClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡，以避免父元素的点击事件被触发
    e.stopPropagation();

    if (showPassword) {
      showPassword();
    }
  };
  const nullDiv = (<div className={className} onClick={handleIconClick}>·</div>)
  return isShowPassword ? nullDiv : (
    <div className={className} onClick={handleIconClick}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 6.6665C2.76447 7.17455 3.16519 7.64584 3.67615 8.06459C5.10875 9.23871 7.40792 9.99984 10
      9.99984C12.5921 9.99984 14.8912 9.23871 16.3238 8.06459C16.8348 7.64584 17.2355 7.17455 17.5 6.6665" stroke="#8A9997" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.074 10L12.9367 13.2197" stroke="#8A9997" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.564 8.89746L17.921 11.2545" stroke="#8A9997" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.08334 11.2545L4.44037 8.89746" stroke="#8A9997" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.05325 13.2198L7.91596 10" stroke="#8A9997" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
};

export default PasswordSVGIcon;
