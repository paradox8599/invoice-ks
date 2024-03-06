import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  json,
  relationship,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import { createdAtField, updatedAtField } from "../helpers/fields";

export const Quote: Lists.Quote = list({
  access: allowAll,
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
