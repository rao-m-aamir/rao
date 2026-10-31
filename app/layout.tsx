import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/pixelify-sans/500.css";
import "@fontsource/pixelify-sans/600.css";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Rao’s Wandering Log · Muhammad Aamir Saifi",
    template: "%s · Rao’s Wandering Log",
  },
  description:
    "A computer science student, curious builder and habitual side-quest taker. Explore the projects and paths of Muhammad Aamir Saifi.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
