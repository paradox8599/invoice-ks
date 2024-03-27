import { Resend } from "resend";
import { RESEND_API } from "../../src/lib/variables";
import { graphql } from "../../src/lib/api/base";
import Mustache from "mustache";

let _resend: Resend;
export function getResend() {
  _resend ??= new Resend(RESEND_API);
  return _resend;
}

type EmailItemData = {
  fullNumber: string;
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

export type EmailMetaData = {
  quote?: EmailItemData;
  contract?: EmailItemData;
  invoice?: EmailItemData;
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
  const commonQuery = `
    fullNumber
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
  `;
  const quoteQuery = `quote(where: $quoteWhere) { ${commonQuery} }`;
  const contractQuery = `contract(where: $contractWhere) { ${commonQuery} }`;
  const invoiceQuery = `invoice(where: $invoiceWhere) { ${commonQuery} }`;
  const { data } = (await graphql({
    query: /* GraphQL */ `
      query ExampleQuery(
        ${quote ? "$quoteWhere: QuoteWhereUniqueInput!" : ""}
        ${contract ? "$contractWhere: ContractWhereUniqueInput!" : ""}
        ${invoice ? "$invoiceWhere: InvoiceWhereUniqueInput!" : ""}
      ) {
        ${quote ? quoteQuery : ""}
        ${contract ? contractQuery : ""}
        ${invoice ? invoiceQuery : ""}
      }
    `,
    variables: {
      quoteWhere: { id: quote },
      contractWhere: { id: contract },
      invoiceWhere: { id: invoice },
    },
  })) as { data: EmailMetaData };
  return data;
}

export function parseTemplate({
  text,
  data,
}: {
  text: string;
  data: EmailMetaData;
}) {
  const quote = data.quote;
  const contract = data.contract;
  const invoice = data.invoice;
  const client = quote?.client || contract?.client || invoice?.client;
  const service = quote?.service || contract?.service || invoice?.service;
  const fullNumber =
    quote?.fullNumber || contract?.fullNumber || invoice?.fullNumber;

  return Mustache.render(text, {
    quote,
    contract,
    invoice,
    client,
    service,
    fullNumber,
  });
}
