import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  json,
  relationship,
  text,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import { createdAtField, updatedAtField } from "../helpers/fields";
import moment from "moment";

export const Quote: Lists.Quote = list({
  access: allowAll,
  hooks: {
    resolveInput: async ({ operation, context, resolvedData }) => {
      if (operation === "create") {
        const dt = new Date();
        dt.setHours(0, 0, 0, 0);
        const quotesToday = (await context.sudo().query.Quote.findMany({
          where: { createdAt: { gt: dt } },
          orderBy: { number: "desc" },
          query: "number",
        })) as unknown as { number: string }[];
        console.log(JSON.stringify(quotesToday));
        const quoteNumber = parseInt(quotesToday?.[0]?.number ?? "0") + 1;
        console.log("quote number", quoteNumber);
        return {
          ...resolvedData,
          number: quoteNumber.toString(),
        };
      }
      return resolvedData;
    },
  },
  fields: {
    // service name as label
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: async (item, _args, context) => {
          const quote = (await context.sudo().query.Quote.findOne({
            where: { id: item.id },
            query: "service { name }",
          })) as { service: { name: string } };
          return quote.service.name;
        },
      }),
    }),
    number: text({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "hidden" },
      },
    }),
    quoteNumber: virtual({
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
      ref: "Service.quotes",
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
          // make sure a service is selected
          if (!item?.serviceId && !resolvedData.service?.connect) {
            addValidationError("Please select a service.");
          } else if (item?.serviceId && resolvedData.service?.disconnect) {
            addValidationError("Service is required.");
          }
        },
      },
    }),
    emailedAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    acceptedAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    actions: json({
      ui: {},
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
