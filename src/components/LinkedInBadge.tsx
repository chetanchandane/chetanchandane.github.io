import React, { useEffect } from "react";
import "../assets/styles/LinkedInBadge.scss";

const VANITY = "chetanchandane";
const NAME = "Chetan Chandane";

/**
 * Loads LinkedIn's official badge script once (coalesced across all badge
 * instances) so it renders every `.badge-base` on the page into its iframe.
 */
let scheduled = false;
function scheduleBadgeRender() {
  if (scheduled) return;
  scheduled = true;
  window.setTimeout(() => {
    scheduled = false;
    const old = document.getElementById("li-badge-script");
    if (old) old.remove();
    const s = document.createElement("script");
    s.id = "li-badge-script";
    s.src = "https://platform.linkedin.com/badges/js/profile.js";
    s.async = true;
    s.defer = true;
    s.type = "text/javascript";
    document.body.appendChild(s);
  }, 400);
}

type Props = {
  children: React.ReactNode; // the trigger link/icon
  block?: boolean; // true when wrapping a block-level element (e.g. a card)
};

export default function LinkedInBadge({ children, block = false }: Props) {
  useEffect(() => {
    scheduleBadgeRender();
  }, []);

  return (
    <span className={`li-badge-hover${block ? " li-badge-hover--block" : ""}`}>
      {children}
      <span className="li-badge-pop">
        <div
          className="badge-base LI-profile-badge"
          data-locale="en_US"
          data-size="medium"
          data-theme="dark"
          data-type="VERTICAL"
          data-vanity={VANITY}
          data-version="v1"
        >
          <a
            className="badge-base__link LI-simple-link"
            href={`https://www.linkedin.com/in/${VANITY}?trk=profile-badge`}
            target="_blank"
            rel="noreferrer"
          >
            {NAME}
          </a>
        </div>
      </span>
    </span>
  );
}
