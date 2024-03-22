import { Resend } from "resend";
import { RESEND_API } from "../../src/lib/variables";
import { graphql } from "../../src/lib/api/base";

export const resend = new Resend(RESEND_API);

type Data = {
  quote?: {
    quoteNumber: string;
    service: {
      description: string;
      totalAmount: string;
      finalAmount: string;
      itemsCount: number;
    };
    client: {
      businessNumberType: string;
      businessNumber: string;
      contactPerson: string;
      email: string;
      name: string;
      phone: string;
    };
  };
};

export async function getTemplateData({
  quote,
  contract,
  invoice,
}: {
  quote?: string;
  contract?: string;
  invoice?: string;
}) {
  const quoteQuery = `
        quote(where: $quoteWhere) {
          quoteNumber
          service {
            description
            totalAmount
            finalAmount
            itemsCount
          }
          client {
            businessNumberType
            businessNumber
            contactPerson
            email
            name
            phone
          }
        }`;
  // TODO: Contract
  // TODO: Invoice
  const { data } = (await graphql({
    query: /* GraphQL */ `
      query ExampleQuery(
        ${quote ? "$quoteWhere: QuoteWhereUniqueInput!" : ""}
      ) {
        ${quote ? quoteQuery : ""}
      }
    `,
    variables: {
      quoteWhere: { id: quote },
      contractWhere: { id: contract },
      invoiceWhere: { id: invoice },
    },
  })) as { data: Data };
  return data;
}

export function parseTemplate({ text, data }: { text: string; data: Data }) {
  const { quote } = data;
  const client = quote?.client;
  client;
  const parsed = eval(`\`${text}\``);
  return parsed;
}
