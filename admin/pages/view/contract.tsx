import { useRouter } from "next/router";
import Footer from "../../components/pdf/footer";
import PdfPage from "../../components/pdf/page";
import { ASSETS, INFO } from "../../../src/lib/variables";
import { useGraphql } from "../../../src/lib/api/base";
import React from "react";
import Items, { ItemData } from "../../components/pdf/items";
import SubTotal from "../../components/pdf/subtotal";
import SignatureDisplay from "../../components/pdf/signature-display";
import { Paragraph, Title } from "../../components/tags";
import ContractTerms from "../../components/pdf/contract-terms";

export type PdfContractData = {
  createdAt: string;
  fullNumber: string;
  signature: string;
  signedAt: string | null;
  client: {
    name: string;
    email: string;
    contactPerson: string;
    businessNumber: string;
    businessNumberType: string;
  };
  service: {
    description: string;
    items: ItemData[];
    totalCents: number;
    excludeGST: boolean;
  };
};

export default function ContractView() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data } = useGraphql<{ contract: PdfContractData }>({
    query: /* GraphQL */ `
      query ($where: ContractWhereUniqueInput!) {
        contract(where: $where) {
          createdAt
          fullNumber
          signature
          signedAt
          client {
            contactPerson
            businessNumberType
            businessNumber
            name
            email
          }
          service {
            excludeGST
            description
            totalCents
            items {
              name
              description
              qty
              unitPrice
              totalCents
            }
          }
        }
      }
    `,
    variables: { where: { id } },
  });
  const contract = React.useMemo(() => data?.data.contract, [data]);

  if (!contract) {
    return (
      <PdfPage>
        <div>not found</div>
        <Footer />
      </PdfPage>
    );
  }

  return (
    <PdfPage>
      {/* HEADER */}
      <section>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.logo} style={{ width: "80px" }} alt="logo" />
        </div>
      </section>
      <section>
        <div
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "10px",
          }}
        >
          Client Information
        </div>

        <div
          style={{
            borderTop: "2px solid",
            borderBottom: "2px solid",
            marginBottom: "20px",
          }}
        >
          <p>Business Name: {contract.client.name}</p>
          <p>
            {contract.client.businessNumberType}:{" "}
            {contract.client.businessNumber}
          </p>
          <p>Email: {contract.client.email}</p>
        </div>
        <div>
          <p>
            Please send us your Gmail address by email or WeChat below, if you
            have not already. We will send the list of the required information
            to you on Google Drive.
          </p>
          <p
            style={{
              textAlign: "center",
              margin: "10px,0,30px,0",
            }}
          >
            Email: {INFO.email}
          </p>
          <div style={{ textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ASSETS.qrcode} style={{ width: "120px" }} alt="barcode" />
          </div>
          <p style={{ fontWeight: "bold" }}>This is the agreement between:</p>
          <div style={{ flex: 1 }}>
            <p>
              {INFO.name}(ABN:{INFO.abn})
            </p>
            <p>{INFO.address1}</p>
            <p>{INFO.address2}</p>
          </div>
          <p style={{ fontWeight: "bold" }}>And</p>
          <p>
            {contract.client.name}( {contract.client.businessNumberType}:{" "}
            {contract.client.businessNumber})
          </p>
        </div>
      </section>
      {/* ITEMS */}
      <section>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "10px",
          }}
        >
          Service Provide
        </div>
        <Items service={contract.service} />
      </section>
      {/* TOTAL */}
      <section>
        <SubTotal service={contract.service} />
      </section>
      {/* FEES & CHARGES */}
      <section>
        <Title>Fees & Charges</Title>
        {/* TODO: use template  */}
        <Paragraph>From input</Paragraph>
      </section>
      {/* Notice */}
      <section>
        <Title>Important information for clients:</Title>
        <Paragraph>
          The terms and conditions of this agreement are set out below. Make
          sure you have read and understood the conditions before entering into
          the agreement. If you wish to seek independent legal advice about this
          agreement, you should do so before signing this agreement. By
          initialling the bottom of each page, you are indicating that:
        </Paragraph>
        <Paragraph>
          1. You have read and understood the terms in this agreement.
        </Paragraph>
        <Paragraph>
          2. All the documents you provided are authentic and effective.
        </Paragraph>
      </section>
      {/* Signature */}
      <section>
        <SignatureDisplay contract={contract} />
      </section>
      <section>
        <ContractTerms />
      </section>
      );
    </PdfPage>
  );
}
