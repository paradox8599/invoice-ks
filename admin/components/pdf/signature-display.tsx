import moment from "moment";
import { PdfContractData } from "../../pages/view/contract";
import React from "react";
import { ASSETS } from "../../../src/lib/variables";

function Signature({
  contract,
  isClient = false,
}: {
  contract: PdfContractData;
  isClient?: boolean;
}) {
  const signedAt =
    contract.signedAt !== null ? moment(contract.signedAt) : null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "end",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "min-content",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <p>Signature by {isClient ? "Client" : "My IT Studio"}</p>
          <div
            style={{
              height: "120px",
              width: "320px",
              border: "2px dashed gray",
              display: "flex",
              placeItems: "center",
              placeContent: "center",
            }}
          >
            {((isClient && contract.signature !== "") ||
              (!isClient && ASSETS.signature !== "")) && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Signature"
                    src={isClient ? contract.signature : ASSETS.signature}
                    width="250"
                    height="100"
                  />
                </>
              )}
          </div>
          <p>{isClient ? contract.client.name : "Han Wang; Jessie Hou"}</p>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            background: "lightgray",
            padding: "0.5rem",
            fontSize: "1.2rem",
            height: "2.2rem",
          }}
        >
          {signedAt !== null
            ? signedAt.format("DD MMM YYYY")
            : isClient
              ? ""
              : moment().format("DD MMM YYYY")}
        </p>
        <p>Date</p>
      </div>
    </div>
  );
}

export default function SignatureDisplay({
  contract,
}: {
  contract: PdfContractData;
}) {
  return (
    <div style={{ pageBreakInside: "avoid" }}>
      <Signature contract={contract} />
      <Signature contract={contract} isClient />
    </div>
  );
}
