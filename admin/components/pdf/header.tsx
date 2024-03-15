import { CSSProperties } from "react";

export default function InfoHeader({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        color: "black",
      }}
    >
      <div style={{ flex: 1 }}>
        <h2>My IT Studio Pty Ltd.</h2>
        <p>
          Room 5, Bank Arcade, 64-68 Liverpool Street
          <br />
          Hobart, TAS 7000
        </p>
        <p>
          https://my-it.com.au
          <br />
          03 6169 5503
          <br />
          info@my-it.com.au
        </p>
      </div>
      <div style={style}>{children}</div>
    </section>
  );
}
