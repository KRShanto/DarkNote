import { ReturnedJsonType } from "./../types/json";

export default async function fetcher(
  url: string,
  body: any
): Promise<ReturnedJsonType> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  return json;
}
