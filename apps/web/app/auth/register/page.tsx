import { redirect } from "next/navigation";

function productUrl(path: string) {
  const configured = process.env.NEXT_PUBLIC_APP_URL || "https://app.kinetixfitt.com";
  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" && process.env.NODE_ENV === "production") return `https://app.kinetixfitt.com${path}`;
    url.pathname = path;
    return url.toString();
  } catch {
    return `https://app.kinetixfitt.com${path}`;
  }
}

export default function WebRegisterRedirect() {
  redirect(productUrl("/register"));
}
