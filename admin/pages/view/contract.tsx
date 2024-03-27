import { useRouter } from "next/router";
import Footer from "../../components/pdf/footer";
import PdfPage from "../../components/pdf/page";
import InfoHeader from "../../components/pdf/header";
import { useGraphql } from "../../../src/lib/api/base";
import React from "react";
import moment from "moment";
import Items, { ItemData } from "../../components/pdf/items";
import SubTotal from "../../components/pdf/subtotal";
import SignatureDisplay from "../../components/pdf/signature-display";

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
        <InfoHeader style={{ minWidth: "300px" }}>
          <h2>Contract</h2>
          <p>Contract #: {contract.fullNumber}</p>
          <p>
            {contract.client.businessNumberType}:{" "}
            {contract.client.businessNumber}
          </p>
          <p>Date: {moment(contract.createdAt).format("dddd, DD MMM YYYY")}</p>
        </InfoHeader>
      </section>

      {/* TODO: client info */}

      {/* ITEMS */}
      <section>
        <Items service={contract.service} />
      </section>

      {/* TOTAL */}
      <section>
        <SubTotal service={contract.service} />
      </section>

      {/* SIGNATURE */}
      <section>
        <SignatureDisplay contract={contract} />
      </section>
    </PdfPage>
  );
}
