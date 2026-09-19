import { useEffect, useState } from "react";
import { Package, ShoppingCart, X } from "@phosphor-icons/react";
import { Account } from "./Account";
import { PERIODS, type Period } from "./books";
import { periodRangeLabel } from "./format";
import { SaleForm, StockInForm } from "./forms";
import { Home } from "./Home";
import { useRoute } from "./nav";
import { StockRecord } from "./StockPage";
import { useBooks } from "./useBooks";
import { useTill } from "./useTill";

type Popup = "" | "sale" | "stock";

export function App() {
  const books = useBooks();
  const { page, recordId } = useRoute();
  const [period, setPeriod] = useState<Period>("today");
  const [popup, setPopup] = useState<Popup>(books.items.length === 0 ? "stock" : "");
  const till = useTill(period);
  const onRecord = page === "stock" && Boolean(recordId);
  const recordName = onRecord ? books.items.find((i) => i.id === recordId)?.name : undefined;
  const title = onRecord ? (recordName ?? "Item") : "Welcome";

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

  const actions = (
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
  );

  return (
    <div className="stage">
      <div className="frame">
        <div className="workspace">
          <header className="workspace-bar">
            <div className="bar-title">
              {onRecord ? <Package size={18} weight="bold" aria-hidden /> : null}
              <div>
                <h2>
                  {onRecord ? null : (
                    <span className="wave" aria-hidden>
                      👋
                    </span>
                  )}
                  {title}
                </h2>
                <p className="range">{periodRangeLabel(period)}</p>
              </div>
            </div>
            <div className="period" role="group" aria-label="Reporting window">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={period === p.id}
                  onClick={() => setPeriod(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Account />
          </header>
          <div className="workspace-body">
            {onRecord ? (
              <StockRecord till={till} recordId={recordId} actions={actions} />
            ) : (
              <Home period={period} till={till} actions={actions} />
            )}
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
