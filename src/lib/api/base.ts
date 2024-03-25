import useSWR from "swr";
import { GRAPHQL_ENDPOINT } from "../variables";
import { Obj } from "../types/helpers";

export async function graphql<T>({
  query,
  variables = {},
  url = GRAPHQL_ENDPOINT,
}: {
  query: string;
  variables?: Obj;
  url?: URL;
}): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query.replace(/(\r\n|\n|\r|\t)/gm, " ").replace(/ +/g, " "),
      variables,
    }),
  });

  const res = await response.json();
  if (res.errors) console.error("graphql error:", res.errors);
  return res;
}

export function useGraphql<T>({
  query,
  variables,
  url,
}: {
  query: string;
  variables?: Obj;
  url?: URL;
}) {
  return useSWR<{ data: T }>([query, variables], () =>
    graphql<{ data: T }>({ query, variables, url }),
  );
}
