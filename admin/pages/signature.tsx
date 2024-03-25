import { useRouter } from "next/router";
import React from "react";
import { useGraphql } from "../../src/lib/api/base";
import ContractSignatureCard from "../components/signature-canvas";
import { Button } from "@keystone-ui/button";
import { SignatureRequest } from "../routes/signature";

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
        <div>
          <div>
            <h2>Signing Contract</h2>
          </div>

          <div style={{ padding: "4rem" }}>
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
        </div>
      )}

      <Button
        onClick={() => window.open(`/pdf?path=contract&id=${contract.id}`)}
        size="small"
        style={{
          margin: "1rem",
          position: "fixed",
          right: "1rem",
          bottom: "0.2rem",
        }}
      >
        View PDF in new tab
      </Button>

      <iframe
        src={`/pdf?path=contract&id=${contract.id}&navpanes=0`}
        title={contract.id}
        style={{
          height: "100vh",
          width: "100%",
        }}
      />
    </main>
  );
}
