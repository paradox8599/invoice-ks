import { useRouter } from "next/router";
import React from "react";
import { useGraphql } from "../../src/lib/api/base";
import ContractSignatureCard from "../components/signature-canvas";
import { Button } from "@keystone-ui/button";
import { SignatureRequest } from "../routes/signature";
import _ from "lodash";
import { SERVER_URL } from "../../src/lib/variables";

export default function SignaturePage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, isLoading } = useGraphql<{
    contract: { id: string; signedAt: string | null };
  }>({
    query: /* GraphQL */ `
      query ($id: ID!) {
        contract(where: { id: $id }) {
          id
          signedAt
        }
      }
    `,
    variables: { id },
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data?.data.contract) return <div>No data</div>;

  const contract = data.data.contract;

  return (
    <main style={{ textAlign: "center" }}>
      {!contract.signedAt && (
        <>
          <h2>Signing Contract</h2>
          {navigator.pdfViewerEnabled && (
            <p>Scroll down to the bottom for signing</p>
          )}
        </>
      )}

      <object
        data={`/pdf?path=contract&id=${contract.id}`}
        type="application/pdf"
        style={{ height: "100vh", width: "100%" }}
      >
        <p>Your browser does not support PDFs.</p>
        <a
          style={{ marginBottom: "1rem" }}
          href={`/pdf?path=contract&id=${contract.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button size="small">Download PDF</Button>
        </a>
      </object>

      {!contract.signedAt && (
        <div style={{ margin: "4rem 0" }}>
          <h2>Sign here</h2>
          <ContractSignatureCard
            onSubmit={async (ref) => {
              if (ref.current?.isEmpty()) {
                return alert("Please sign before submitting");
              }
              const res = await fetch(`/api/signature?id=${contract.id}`, {
                method: "POST",
                body: JSON.stringify({
                  signature: ref.current?.toDataURL(),
                } as SignatureRequest),
              });
              if (!res.ok) alert("Something went wrong");
              window.location.reload();
            }}
          />
        </div>
      )}
    </main>
  );
}
