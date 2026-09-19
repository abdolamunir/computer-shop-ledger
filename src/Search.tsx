import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { onHand, supplierName, type Books, type Item } from "./books";
import { productPhoto } from "./catalog";
import { go } from "./nav";
import { useBooks } from "./useBooks";

type Hit = { item: Item; supplier: string };

function searchItems(books: Books, query: string): Hit[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return books.items
    .map((item) => {
      const supplier = supplierName(books, item.supplierId);
      const hay = `${item.name} ${item.kind ?? ""} ${supplier}`.toLowerCase();
      const name = item.name.toLowerCase();
      let rank = 99;
      if (name.startsWith(needle)) rank = 0;
      else if (name.includes(needle)) rank = 1;
      else if (hay.includes(needle)) rank = 2;
      return { item, supplier, rank };
    })
    .filter((hit) => hit.rank < 99)
    .sort((a, b) => a.rank - b.rank || a.item.name.localeCompare(b.item.name))
    .slice(0, 8);
}

export function Search() {
  const books = useBooks();
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const hits = useMemo(() => searchItems(books, query), [books, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function pick(item: Item) {
    setQuery("");
    setOpen(false);
    input.current?.blur();
    go("stock", item.id);
  }

  const showHits = open && query.trim().length > 0;

  return (
    <div className="bar-search" ref={wrap}>
      <label className="bar-search-field">
        <MagnifyingGlass size={16} weight="bold" aria-hidden />
        <input
          ref={input}
          value={query}
          placeholder="Search stock"
          autoComplete="off"
          spellCheck={false}
          aria-label="Search stock"
          aria-expanded={showHits}
          aria-controls="bar-search-hits"
          aria-autocomplete="list"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              if (query) setQuery("");
              else input.current?.blur();
              setOpen(false);
              return;
            }
            if (!hits.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => (i + 1) % hits.length);
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i - 1 + hits.length) % hits.length);
            }
            if (e.key === "Enter") {
              e.preventDefault();
              pick(hits[active]?.item ?? hits[0].item);
            }
          }}
        />
      </label>
      {showHits ? (
        <div className="bar-search-hits" id="bar-search-hits" role="listbox">
          {hits.length === 0 ? (
            <p className="bar-search-empty">No items match.</p>
          ) : (
            hits.map((hit, i) => {
              const photo = productPhoto(hit.item);
              const stock = onHand(books, hit.item);
              return (
                <button
                  key={hit.item.id}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? "on" : undefined}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(hit.item)}
                >
                  <span className="sheet-item">
                    {photo ? <img src={photo} alt="" /> : <span>{hit.item.name.slice(0, 1)}</span>}
                    <span>
                      <strong>{hit.item.name}</strong>
                      <em>
                        {hit.supplier || hit.item.kind || "Item"} · {stock} in stock
                      </em>
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
