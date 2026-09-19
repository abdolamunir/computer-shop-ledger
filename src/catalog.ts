import hp15s from "./assets/products/hp-15s.png";
import dellVostro from "./assets/products/dell-vostro.png";
import kingston512 from "./assets/products/kingston-512.png";
import kingston1tb from "./assets/products/kingston-1tb.png";
import m185 from "./assets/products/m185.png";
import ddr48 from "./assets/products/ddr4-8.png";
import archerC6 from "./assets/products/archer-c6.png";
import hdmi2m from "./assets/products/hdmi-2m.png";
import mousePad from "./assets/products/mouse-pad.png";
import wd1tb from "./assets/products/wd-1tb.png";
import type { Item, ItemKind } from "./books";

const PHOTOS: Record<string, string> = {
  "hp-15s": hp15s,
  "dell-vostro": dellVostro,
  "kingston-512": kingston512,
  "kingston-1tb": kingston1tb,
  m185,
  "ddr4-8": ddr48,
  "archer-c6": archerC6,
  "hdmi-2m": hdmi2m,
  "mouse-pad": mousePad,
  "wd-1tb": wd1tb,
};

const KINDS: Record<string, ItemKind> = {
  "hp-15s": "Laptop",
  "dell-vostro": "Laptop",
  "kingston-512": "Storage",
  "kingston-1tb": "Storage",
  m185: "Accessory",
  "ddr4-8": "Storage",
  "archer-c6": "Network",
  "hdmi-2m": "Accessory",
  "mouse-pad": "Accessory",
  "wd-1tb": "Storage",
};

export function productPhoto(item: Item): string | undefined {
  return PHOTOS[item.id];
}

export function productKind(item: Item): ItemKind {
  return item.kind ?? KINDS[item.id] ?? "Accessory";
}
