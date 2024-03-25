import { useRouter } from "next/router";
import Footer from "../../components/pdf/footer";
import PdfPage from "../../components/pdf/page";
import InfoHeader from "../../components/pdf/header";
import { useGraphql } from "../../../src/lib/api/base";
import React from "react";
import moment from "moment";
import Items, { ItemData } from "../../components/pdf/items";
import SubTotal from "../../components/pdf/subtotal";

export default function QuoteView() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data } = useGraphql<{
    data: {
      contract: {
        createdAt: string;
        fullNumber: string;
        client: {
          name: string;
          email: string;
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
    };
  }>({
    query: /* GraphQL */ `
      contract ($where: ContractWhereUniqueInput!) {
        quote(where: $where) {
          createdAt
          fullNumber
          client {
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
      <section className="items">
        <Items service={contract.service} />
      </section>

      {/* TOTAL */}
      <section>
        <SubTotal service={contract.service} />
      </section>
    </PdfPage>
  );
}
