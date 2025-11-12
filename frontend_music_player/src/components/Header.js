import React from "react";

// PUBLIC_INTERFACE
export default function Header() {
  /** Minimalist sticky header with app brand text. */
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true" />
          <div>
            <div className="brand-title">Ocean Music</div>
            <div className="subtle">Minimalist Web Player</div>
          </div>
        </div>
      </div>
    </header>
  );
}
