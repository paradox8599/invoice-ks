import { INFO } from "../../../src/lib/variables";
import { VALUES } from "../values";
import React from "react";

export default function Footer() {
  return (
    <div
      style={{
        WebkitPrintColorAdjust: "exact",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: VALUES.colors.bg,
        height: "16px",
        padding: "0 25px",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
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
        {INFO.phone}
      </div>
      <div
        style={{
          flexBasis: 0,
          flexGrow: 1,
          textAlign: "center",
          marginRight: "20px",
        }}
      >
        {INFO.email}
      </div>
      <div
        style={{
          flexBasis: 0,
          flexGrow: 1,
          textAlign: "end",
          fontSize: "12px",
        }}
      >
        {INFO.address1}
      </div>
    </div>
  );
}
