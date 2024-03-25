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

export const Contract: Lists.Contract = list({
  access: allowAll,
  hooks: {
    resolveInput: async ({ operation, context, resolvedData }) => {
      // calculate item number
      if (operation === "create") {
        const dt = new Date();
        dt.setHours(0, 0, 0, 0);
        const itemsToday = (await context.sudo().query.Contract.findMany({
          where: { createdAt: { gt: dt } },
          orderBy: { number: "desc" },
          query: "number",
          take: 1,
        })) as unknown as { number: string }[];
        const itemNumber = parseInt(itemsToday?.[0]?.number ?? "0") + 1;
        return { ...resolvedData, number: itemNumber.toString() };
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
      ref: "Service.contracts",
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
    startDate: calendarDay({ validation: { isRequired: true } }),
    emailedAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    signature: text({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    signedAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
