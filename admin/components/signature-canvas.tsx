import React from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@keystone-ui/button";

export default function ContractSignatureCard({
  onSubmit,
}: {
  onSubmit: (ref: React.RefObject<SignatureCanvas>) => void;
}) {
  const theref = React.useRef<SignatureCanvas>(null);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "500",
          border: "2px solid black",
          borderRadius: "10px",
        }}
      >
        <SignatureCanvas
          canvasProps={{ width: 500, height: 200 }}
          ref={theref}
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button onClick={() => theref.current?.clear()}>Clear</Button>
        <Button onClick={() => onSubmit(theref)}>Submit</Button>
      </div>
    </div>
  );
}
