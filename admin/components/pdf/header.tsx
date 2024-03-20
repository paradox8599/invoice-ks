import { CSSProperties } from "react";
import { INFO } from "../../../src/lib/variables";

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
      {/* LEFT */}
      <div style={{ flex: 1 }}>
        <h2>{INFO.name}</h2>
        <p>
          {INFO.address1}
          <br />
          {INFO.address2}
        </p>
        <p>
          https://my-it.com.au
          <br />
          03 6169 5503
          <br />
          info@my-it.com.au
        </p>
      </div>
      {/* RIGHT */}
      <div style={style}>{children}</div>
    </section>
  );
}
