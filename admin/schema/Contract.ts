import { type Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  calendarDay,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";
import { createdAtField, updatedAtField } from "../helpers/fields";

export const Contract: Lists.Contract = list({
  access: allowAll,
  fields: {
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
