import { useRouter } from "next/router";
import Footer from "../../components/pdf/footer";
import PdfPage from "../../components/pdf/page";
import InfoHeader from "../../components/pdf/header";
import { keystoneContext } from "../../../src/keystone/context";
import { graphql, useGraphql } from "../../../src/lib/api/base";
import React from "react";
import moment from "moment";
import { VALUES } from "../../components/values";

export default function QuoteView() {
  const router = useRouter();
  const id = router.query.id as string;
  // const quote = (await keystoneContext.sudo().query.Quote.findOne({
  //   where: { id },
  //   query: "client { businessNumberType businessNumber }",
  // })) as unknown as {
  //   client: {
  //     businessNumberType: string;
  //     businessNumber: string;
  //   };
  // };
  const { data, isLoading } = useGraphql<{
    data: {
      quote: {
        client: {
          name: string;
          email: string;
          businessNumber: string;
          businessNumberType: string;
        };
        createdAt: string;
        quoteNumber: string;
      };
    };
  }>({
    query: /* GraphQL */ `
      query ($where: QuoteWhereUniqueInput!) {
        quote(where: $where) {
          client {
            businessNumberType
            businessNumber
            name
            email
          }
          createdAt
          quoteNumber
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
  console.log(quote);

  return (
    <PdfPage>
      <InfoHeader style={{ minWidth: "300px" }}>
        <h2>Quote</h2>
        <p>Quote #: {quote.quoteNumber}</p>
        <p>
          {quote.client.businessNumberType}: {quote.client.businessNumber}
        </p>
        <p>Date: {moment(quote.createdAt).format("dddd, DD MMM YYYY")}</p>
      </InfoHeader>

      <section>
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
        <p style={{ padding: "0rem 2rem" }}>
          {quote.client.name}
          <br />
          {quote.client.email}
        </p>
      </section>

      <Footer />
    </PdfPage>
  );
}
