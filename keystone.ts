import { config } from "@keystone-6/core";

import { session, withAuth } from "./admin/auth";
import { lists } from "./admin/schema/_lists";
import {
  BUCKET,
  DATABASE_URL,
  DB_PROVIDER,
  GRAPHQL_PATH,
  KS_PORT,
} from "./src/lib/variables";
import { type Context } from ".keystone/types";
import { NextApiRequest, NextApiResponse } from "next";
import { pdfAPI } from "./admin/routes/pdf";
import { serviceDuplicateAPI } from "./admin/routes/duplicate/service";
import { serviceItemDuplicateAPI } from "./admin/routes/duplicate/service-item";
import { mailAPI, mailPreviewAPI } from "./admin/routes/mail";
import { signatureAPI } from "./admin/routes/signature";

function withContext<
  F extends (
    req: NextApiRequest,
    res: NextApiResponse,
    context: Context,
  ) => void,
>(commonContext: Context, f: F) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return async (req: any, res: any) => {
    return f(req, res, await commonContext.withRequest(req, res));
  };
}

export default withAuth(
  config({
    server: {
      // options: { host: "0.0.0.0" },
      port: KS_PORT,
      extendExpressApp(app, ctx) {
        app.post(
          "/api/service-item/duplicate",
          withContext(ctx, serviceItemDuplicateAPI),
        );
        app.post(
          "/api/service/duplicate",
          withContext(ctx, serviceDuplicateAPI),
        );

        app.get("/pdf", withContext(ctx, pdfAPI));
        app.get("/api/mail/preview", withContext(ctx, mailPreviewAPI));
        app.post("/api/mail/send", withContext(ctx, mailAPI));
        app.post("/api/signature", withContext(ctx, signatureAPI));
      },
    },
    ui: {
      publicPages: [
        "/pdf",
        "/view/quote",
        "/view/contract",
        "/view/invoice",
        "/signature",
      ],
      // fix: AdminMeta access denied when login to admin ui
      isAccessAllowed: (ctx) => ctx.session,
    },
    db: { provider: DB_PROVIDER, url: DATABASE_URL },
    storage: {
      image_store: {
        kind: "s3",
        // type: "file",
        type: "image",
        region: "auto",
        bucketName: BUCKET.name,
        accessKeyId: BUCKET.accessKeyId,
        secretAccessKey: BUCKET.secretAccessKey,
        endpoint: BUCKET.endpointUrl,
        pathPrefix: "images/",
        generateUrl: (path) => {
          const original = new URL(path);
          const customUrl = new URL(original.pathname, BUCKET.customUrl);
          return customUrl.href;
        },
      },
    },

    lists,
    graphql: { path: GRAPHQL_PATH },
    session,
  }),
);
