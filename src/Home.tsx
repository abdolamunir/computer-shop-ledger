import { Package, ShoppingCart, TrendDown, TrendUp, Wallet } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { periodSales, totals, type Period } from "./books";
import { pkr } from "./format";
import { StockBoard } from "./StockBoard";
import type { Till } from "./useTill";

export function Home({
  period,
  till,
  actions,
}: {
  period: Period;
  till: Till;
  actions?: ReactNode;
}) {
  const { books } = till;
  const t = totals(books, period);
  const sales = periodSales(books, period);
  const profit = Math.max(0, t.profit);
  const loss = Math.max(0, -t.profit);

  const kpis = [
    {
      label: "Total Sales",
      value: pkr(t.revenue),
      hint: `${sales.length} ${sales.length === 1 ? "sale" : "sales"}`,
      Icon: ShoppingCart,
      tone: "",
    },
    {
      label: "Profit",
      value: pkr(profit),
      hint: "Sales minus cost",
      Icon: TrendUp,
      tone: profit > 0 ? "ok" : "",
    },
    {
      label: "Loss",
      value: pkr(loss),
      hint: "When cost is higher",
      Icon: TrendDown,
      tone: "loss",
    },
    {
      label: "Stock",
      value: pkr(t.stockValue),
      hint: `${t.stockQty} pcs on shelf`,
      Icon: Package,
      tone: "stock",
    },
    {
      label: "Balance",
      value: pkr(t.cash),
      hint: "Cash in hand",
      Icon: Wallet,
      tone: "balance",
    },
  ];

  return (
    <div className="dash">
      <section className="kpis">
        {kpis.map((k) => (
          <article key={k.label} className={`kpi ${k.tone}`}>
            <span className="kpi-icon">
              <k.Icon size={18} weight="bold" aria-hidden />
            </span>
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value">{k.value}</p>
            <p className="sub">{k.hint}</p>
          </article>
        ))}
      </section>
      {actions}
      <StockBoard till={till} />
    </div>
  );
}
