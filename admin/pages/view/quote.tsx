import { useRouter } from "next/router";
import Footer from "../../components/pdf/footer";
import PdfPage from "../../components/pdf/page";
import InfoHeader from "../../components/pdf/header";
import { useGraphql } from "../../../src/lib/api/base";
import React from "react";
import moment from "moment";
import { VALUES } from "../../components/values";
import Items, { ItemData } from "../../components/pdf/items";
import SubTotal from "../../components/pdf/subtotal";

export default function QuoteView() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data } = useGraphql<{
    quote: {
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
  }>({
    query: /* GraphQL */ `
      query ($where: QuoteWhereUniqueInput!) {
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
  const quote = React.useMemo(() => data?.data.quote, [data]);
  if (!quote) {
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
      <section style={{ pageBreakInside: "avoid" }}>
        <InfoHeader style={{ minWidth: "300px" }}>
          <h2>Quote</h2>
          <p>Quote #: {quote.fullNumber}</p>
          <p>
            {quote.client.businessNumberType}: {quote.client.businessNumber}
          </p>
          <p>Date: {moment(quote.createdAt).format("dddd, DD MMM YYYY")}</p>
        </InfoHeader>
      </section>

      {/* QUOTE TO */}
      <section style={{ pageBreakInside: "avoid" }}>
        <h2
          style={{
            textTransform: "uppercase",
            background: VALUES.colors.bg,
            color: "white",
            padding: "0.5rem 1rem",
          }}
        >
          Quote to
        </h2>
        <div style={{ padding: "0rem 2rem" }}>
          <p style={{ fontWeight: "bold" }}>
            {quote.client.name}
            <br />
            {quote.client.email}
          </p>
          <p>{quote.service.description}</p>
        </div>
      </section>

      {/* ITEMS */}
      <section>
        <Items service={quote.service} />
      </section>

      {/* TOTAL */}
      <section style={{ pageBreakInside: "avoid" }}>
        <SubTotal service={quote.service} />
      </section>

      {/* TERMS */}
      <section style={{ pageBreakInside: "avoid" }}>
        <p>Terms & Conditions</p>
        <p style={{ borderTop: "1px solid black", paddingTop: "1rem" }}>
          *Above quotation is valid within 3 months
          <br />
          *The minimum subscription period is 6 months if applicable.
        </p>
      </section>
    </PdfPage>
  );
}
