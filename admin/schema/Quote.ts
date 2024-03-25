import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  relationship,
  text,
  integer,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import { createdAtField, updatedAtField } from "../helpers/fields";
import moment from "moment";

export const Quote: Lists.Quote = list({
  access: allowAll,
  hooks: {
    resolveInput: async ({ operation, context, resolvedData }) => {
      // calculate item number
      if (operation === "create") {
        const dt = new Date();
        dt.setHours(0, 0, 0, 0);
        const itemsToday = (await context.sudo().query.Quote.findMany({
          where: { createdAt: { gte: dt } },
          orderBy: { number: "desc" },
          query: "number",
          take: 1,
        })) as unknown as { number: number }[];
        const itemNumber = (itemsToday?.[0]?.number ?? 0) + 1;
        return { ...resolvedData, number: itemNumber };
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
          return quote?.service.name ?? "";
        },
      }),
    }),
    number: integer({
      defaultValue: 1,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "hidden" },
      },
    }),
    fullNumber: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: (item) => {
          const dt = moment(item.createdAt).format("YYYYMMDD");
          const num = item.number?.toString().padStart(3, "0");
          return `${dt}${num}`;
        },
      }),
    }),
    client: relationship({
      ref: "Client",
      many: false,
      ui: { itemView: { fieldMode: "read", fieldPosition: "sidebar" } },
    }),
    service: relationship({
      ref: "Service.quotes",
      many: false,
      ui: {
        displayMode: "cards",
        cardFields: [
          "name",
          "description",
          "items",
          "finalAmount",
          "excludeGST",
        ],
        inlineCreate: {
          fields: ["name", "description", "items", "excludeGST"],
        },
        inlineEdit: { fields: ["name", "description", "items", "excludeGST"] },
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
    emailTemplate: relationship({ ref: "MailTemplate" }),
    preview: text({
      defaultValue: "quote",
      ui: {
        views: "./admin/views/email-preview",
        createView: { fieldMode: "hidden" },
      },
    }),
    actions: text({
      defaultValue: "quote",
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldPosition: "sidebar" },
        views: "./admin/views/actions",
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
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
