import { useEffect, useState } from "react";
import { Books, Package, ShoppingCart, X } from "@phosphor-icons/react";
import { Account } from "./Account";
import { DateRangePicker } from "./DateRangePicker";
import { Search } from "./Search";
import { PERIODS, type DateSpan, type Period } from "./books";
import { periodRangeLabel, startOfMonth, todayKey } from "./format";
import { SaleForm, StockInForm } from "./forms";
import { Home } from "./Home";
import { go, useRoute } from "./nav";
import { StockRecord } from "./StockPage";
import { firstNameOf, useUser } from "./useAuth";
import { useBooks } from "./useBooks";
import { useTill } from "./useTill";

type Popup = "" | "sale" | "stock";

export function App() {
  const books = useBooks();
  const user = useUser();
  const { page, recordId } = useRoute();
  const [period, setPeriod] = useState<Period>("today");
  const [span, setSpan] = useState<DateSpan>(() => ({
    from: todayKey(startOfMonth()),
    to: todayKey(),
  }));
  const [popup, setPopup] = useState<Popup>("");
  const till = useTill(period, span);
  const onRecord = page === "stock" && Boolean(recordId);
  const recordName = onRecord ? books.items.find((i) => i.id === recordId)?.name : undefined;
  const firstName = firstNameOf(user);
  const title = onRecord ? (recordName ?? "Item") : firstName ? `Welcome, ${firstName}` : "Welcome";
  const subtitle = onRecord
    ? periodRangeLabel(period, span)
    : "A shop ledger for sales, stock, profit, and cash.";

  function open(next: Popup) {
    till.setError("");
    if (next === "stock") {
      const id = onRecord ? recordId : till.itemId || books.items[0]?.id;
      if (id) till.pick(id);
      else till.setQty(1);
    } else {
      till.setQty(1);
    }
    setPopup(next);
  }

  function close() {
    setPopup("");
    till.setError("");
  }

  useEffect(() => {
    document.body.classList.toggle("modal-open", Boolean(popup));
    return () => document.body.classList.remove("modal-open");
  }, [popup]);

  useEffect(() => {
    if (!popup) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPopup("");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popup]);

  return (
    <div className="stage">
      <div className="frame">
        <div className="workspace">
          <header className="workspace-bar">
            <div className="bar-top">
              <button className="brand" type="button" aria-label="Counter Books" onClick={() => go("home")}>
                <span className="brand-mark">
                  <Books size={16} weight="bold" aria-hidden />
                </span>
                <span className="brand-name">Counter Books</span>
              </button>
              <Search />
              <Account />
            </div>
            <div className="bar-main">
              <div className="bar-title">
                {onRecord ? <Package size={18} weight="bold" aria-hidden /> : null}
                <div>
                  <h2>
                    {title}
                    {onRecord ? null : (
                      <span className="wave" aria-hidden>
                        👋
                      </span>
                    )}
                  </h2>
                  <p className="range">{subtitle}</p>
                </div>
              </div>
              <div className="bar-tools">
                <div className="period" role="group" aria-label="Reporting window">
                  {PERIODS.map((p) =>
                    p.id === "custom" ? (
                      <DateRangePicker
                        key={p.id}
                        active={period === "custom"}
                        span={span}
                        onActivate={() => setPeriod("custom")}
                        onChange={setSpan}
                      />
                    ) : (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={period === p.id}
                        onClick={() => setPeriod(p.id)}
                      >
                        {p.label}
                      </button>
                    ),
                  )}
                </div>
                <div className="bar-actions">
                  <button
                    type="button"
                    className="key round"
                    onClick={() => open("sale")}
                    disabled={books.items.length === 0}
                  >
                    <ShoppingCart size={16} weight="bold" aria-hidden />
                    Record sale
                  </button>
                  <button type="button" className="key primary round" onClick={() => open("stock")}>
                    <Package size={16} weight="bold" aria-hidden />
                    Add stock
                  </button>
                </div>
              </div>
            </div>
          </header>
          <div className="workspace-body">
            {onRecord ? <StockRecord till={till} recordId={recordId} /> : <Home period={period} span={span} till={till} />}
          </div>
        </div>
      </div>
      {popup ? (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-backdrop" type="button" aria-label="Close" onClick={close} />
          <div className="modal-card">
            <div className="modal-head">
              <h2 id="modal-title">{popup === "sale" ? "Record sale" : "Add stock"}</h2>
              <button className="modal-close" type="button" aria-label="Close" onClick={close}>
                <X size={16} weight="bold" />
              </button>
            </div>
            {popup === "sale" ? (
              <SaleForm till={till} onDone={close} />
            ) : (
              <StockInForm till={till} lockedId={onRecord ? recordId : undefined} onDone={close} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
