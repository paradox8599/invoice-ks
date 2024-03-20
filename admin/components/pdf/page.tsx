import { CSSProperties } from "react";

export default function PdfPage({
  children,
  pageMargin = "1rem",
  style = { padding: "1rem" },
}: {
  pageMargin?: string;
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <main>
      <style>{`@page { size: A4 portrait; margin: ${pageMargin}; }`}</style>
      <div style={style}>{children}</div>
    </main>
  );
}
