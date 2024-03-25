import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  calendarDay,
  relationship,
  text,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import { createdAtField, updatedAtField } from "../helpers/fields";
import moment from "moment";

export const Invoice: Lists.Invoice = list({
  access: allowAll,
  hooks: {
    resolveInput: async ({ operation, context, resolvedData }) => {
      // calculate item number
      if (operation === "create") {
        const dt = new Date();
        dt.setHours(0, 0, 0, 0);
        const quotesToday = (await context.sudo().query.Quote.findMany({
          where: { createdAt: { gt: dt } },
          orderBy: { number: "desc" },
          query: "number",
        })) as unknown as { number: string }[];
        const quoteNumber = parseInt(quotesToday?.[0]?.number ?? "0") + 1;
        return {
          ...resolvedData,
          number: quoteNumber.toString(),
        };
      }
      return resolvedData;
    },
  },
  fields: {
    number: text({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "hidden" },
      },
    }),
    fullNumber: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: (item) =>
          `${moment(item.createdAt).format("YYYYMMDD")}${item.number.padStart(3, "0")}`,
      }),
    }),
    client: relationship({
      ref: "Client",
      many: false,
      ui: {
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
        displayMode: "cards",
        cardFields: [
          "alias",
          "name",
          "contactPerson",
          "email",
          "phone",
          "businessNumberType",
          "businessNumber",
        ],
        inlineConnect: true,
      },
    }),
    service: relationship({
      ref: "Service.invoices",
      many: false,
      ui: {
        displayMode: "cards",
        cardFields: ["name", "description", "items", "totalAmount"],
        inlineCreate: { fields: ["name", "description", "items"] },
        inlineEdit: { fields: ["name", "description", "items"] },
        inlineConnect: true,
      },
      hooks: {
        validateInput: async ({ item, resolvedData, addValidationError }) => {
          if (!item?.serviceId && !resolvedData.service?.connect) {
            addValidationError("Please select a service.");
          } else if (item?.serviceId && resolvedData.service?.disconnect) {
            addValidationError("Service is required.");
          }
        },
      },
    }),
    invoiceDate: calendarDay({ validation: { isRequired: true } }),
    emailedAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    paidAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
