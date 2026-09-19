import { useEffect, useState } from "react";
import type { Page } from "./books";

export type Route = { page: Page; recordId: string };

function readRoute(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [seg = "", ...rest] = raw.split("/").filter(Boolean);
  if (seg === "stock" && rest.length) {
    return { page: "stock", recordId: rest.join("/") };
  }
  return { page: "home", recordId: "" };
}

export function go(page: Page, recordId?: string) {
  const hash = page === "stock" && recordId ? `#/stock/${recordId}` : "#/";
  if (window.location.hash === hash) return;
  window.location.hash = hash;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute);
  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

export function usePage(): Page {
  return useRoute().page;
}
