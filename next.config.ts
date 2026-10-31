import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  output: "export",
  basePath: "/rao",
  images: { unoptimized: true },
};
export default config;
