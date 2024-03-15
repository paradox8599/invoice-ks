import { VALUES } from "../values";

export default function Footer() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: VALUES.colors.bg,
        padding: "0.1rem 1rem",
        color: "white",
        fontWeight: "bold",
        fontSize: "0.65rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          flexBasis: 0,
          flexGrow: 1,
          textAlign: "start",
        }}
      >
        03 6169 5503
      </div>
      <div
        style={{
          flexBasis: 0,
          flexGrow: 1,
          textAlign: "center",
        }}
      >
        info@my-it.com.au
      </div>
      <div
        style={{
          flexBasis: 0,
          flexGrow: 1,
          textAlign: "end",
        }}
      >
        Room 5, Bank Arcade, 64-68 Liverpool St
      </div>
    </div>
  );
}
