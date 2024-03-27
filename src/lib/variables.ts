import { randomBytes } from "crypto";

try {
  require("dotenv").config();
} catch (e) { }

// KeystoneJS server config
type DB_PROVIDER_TYPE = "sqlite" | "mysql" | "postgresql";

export const KS_PORT = parseInt(process.env.KS_PORT || "3000");

export const SESSION_SECRET =
  process.env.SESSION_SECRET || randomBytes(32).toString("hex");

export const DB_PROVIDER: DB_PROVIDER_TYPE =
  (process.env.DB_PROVIDER as DB_PROVIDER_TYPE) || "sqlite";

export const DATABASE_URL = process.env.DATABASE_URL || "file://keystone.db";

// KeystoneJS & GraphQL Server
export const SERVER_URL = new URL(
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000",
);

export const GRAPHQL_PATH =
  process.env.NEXT_PUBLIC_GRAPHQL_PATH ?? "/api/graphql";

export const GRAPHQL_ENDPOINT = new URL(GRAPHQL_PATH, SERVER_URL);

export const BUCKET = {
  name: process.env.AWS_BUCKET ?? "",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpointUrl: process.env.AWS_ENDPOINT_URL,
  customUrl: process.env.AWS_CUSTOM_URL,
};

export const INFO = {
  name: process.env.NEXT_PUBLIC_INFO_NAME ?? "",
  phone: process.env.NEXT_PUBLIC_INFO_PHONE ?? "",
  address1: process.env.NEXT_PUBLIC_INFO_ADDRESS_1 ?? "",
  address2: process.env.NEXT_PUBLIC_INFO_ADDRESS_2 ?? "",
  email: process.env.NEXT_PUBLIC_INFO_EMAIL ?? "",
  abn: process.env.NEXT_PUBLIC_INFO_ABN ?? "",
};

export const ASSETS = {
  signature: process.env.NEXT_PUBLIC_SIGNATURE_URL ?? "",
  logo: process.env.NEXT_PUBLIC_LOGO_URL ?? "",
  qrcode: process.env.NEXT_PUBLIC_QRCODE_URL ?? "",
};

export const RESEND_API = process.env.RESEND_API ?? "";
export const RESEND_DOMAINS: string[] = JSON.parse(
  process.env.RESEND_DOMAINS ?? "[]",
);
