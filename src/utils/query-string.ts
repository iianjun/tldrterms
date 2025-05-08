interface QueryStringOptions {
  includeSeparator?: boolean;
  pathname?: string;
}

export function getQueryString(
  obj: { [key: string]: string | undefined },
  options: QueryStringOptions = {
    includeSeparator: false,
    pathname: "",
  }
) {
  if (!Object.keys(obj).length) return "";
  const params = new URLSearchParams([]);
  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return `${options.pathname ?? ""}${options.includeSeparator ? "?" : ""}${params.toString()}`;
}
