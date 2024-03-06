import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  calendarDay,
  integer,
  relationship,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import { createdAtField, updatedAtField } from "../helpers/fields";

export const Invoice: Lists.Invoice = list({
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
    dayIndex: integer({
      // hidden, used as internal reference, see invoiceNumber for public use
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "hidden", fieldPosition: "sidebar" },
      },
      hooks: {
        afterOperation: async ({ operation, item, context }) => {
          // find the largest dayIndex of the day and increment by 1
          if (operation === "create") {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const invoices = (await context.sudo().query.Invoice.findMany({
              where: { createdAt: { gt: now.getTime() } },
              orderBy: { dayIndex: "desc" },
              take: 1,
              query: "dayIndex",
            })) as { dayIndex: number }[];
            const dayIndex = invoices[0]?.dayIndex ?? 0;
            await context.sudo().query.Invoice.updateOne({
              where: { id: item.id },
              data: { dayIndex: dayIndex + 1 },
            });
          }
        },
      },
    }),
    invoiceNumber: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: (item, _args, _context) => {
          const c = item?.createdAt;
          if (!c) return "";
          const y = c.getFullYear();
          const m = String(c.getMonth() + 1).padStart(2, "0");
          const d = String(c.getDate()).padStart(2, "0");
          return `${y}${m}${d}${item.dayIndex}`;
        },
      }),
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
