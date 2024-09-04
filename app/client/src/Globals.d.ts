declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "*.txt" {
  const filePath: string;
  export default filePath;
}

declare let CDN_URL: string;
declare module "echarts-gl";
