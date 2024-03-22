import { NextApiRequest, NextApiResponse } from "next";
import { getTemplateData, parseTemplate, resend } from "../lib/mail-template";

import { Context } from ".keystone/types";
import { getPdf } from "./pdf";

export async function mailPreviewAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  context: Context,
) {
  if (!context.session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.query.quote && typeof req.query.quote !== "string") {
    return res.status(400).json({ error: "Invalid quote id (string)" });
  }

  try {
    const data = await getTemplateData({ quote: req.query.quote });
    const text = await context.sudo().query.Quote.findOne({
      where: { id: req.query.quote },
      query: "emailTemplate { subject template format }",
    });

    const subject = parseTemplate({
      text: text?.emailTemplate?.subject ?? "",
      data: data,
    });

    const body = parseTemplate({
      text: text?.emailTemplate?.template ?? "",
      data: data,
    });

    res.send({ data: { subject, body, format: text?.emailTemplate?.format } });
  } catch (e) {
    console.log("[mailPreviewAPI]", e);
    res.status(418).json({ error: e });
  }
}

export async function mailAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  context: Context,
) {
  if (!context.session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.query.quote && typeof req.query.quote !== "string") {
    return res.status(400).json({ error: "Invalid quote id (string)" });
  }
  if (req.query.contract && typeof req.query.contract !== "string") {
    return res.status(400).json({ error: "Invalid contract id (string)" });
  }
  if (req.query.invoice && typeof req.query.invoice !== "string") {
    return res.status(400).json({ error: "Invalid invoice id (string)" });
  }

  try {
    const meta = await getTemplateData({
      quote: req.query.quote,
      contract: req.query.contract,
      invoice: req.query.invoice,
    });
    const quote = (await context.sudo().query.Quote.findOne({
      where: { id: req.query.quote },
      query: "id quoteNumber emailTemplate { subject template format }",
    })) as {
      id: string;
      quoteNumber: string;
      emailTemplate: { subject: string; template: string; format: string };
    };
    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }
    const { emailTemplate: t } = quote;

    const subject = parseTemplate({
      text: t.subject ?? "",
      data: meta,
    });

    const body = parseTemplate({
      text: t.template ?? "",
      data: meta,
    });

    const attachments: { filename: string; content: Buffer }[] = [];

    if (quote) {
      attachments.push({
        filename: `Quote-${quote.quoteNumber}.pdf`,
        content: await getPdf({ path: "quote", id: quote.id }),
      });
    }

    const { data, error } = await resend.emails.send({
      from: "My IT Studio <myit@estl.me>",
      to: [meta.quote?.client.email ?? ""],
      subject,
      text: t.format === "text" ? body : undefined,
      html: t.format === "html" ? body : undefined,
      attachments,
    });

    res.send({ data, error });
  } catch (e) {
    console.log("[mailAPI]", e);
    res.status(418).json({ error: e });
  }
}
