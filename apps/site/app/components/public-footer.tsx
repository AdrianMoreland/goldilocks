import { Link } from "react-router";

import { COMPANY } from "../config/company";
import { Logo } from "./public-header";

const COLUMNS = [
  {
    title: "Buy and sell",
    links: [
      { to: "/buy/", label: "Buy" },
      { to: "/how-to-buy/", label: "How to buy" },
      { to: "/sell-gold/", label: "Sell" },
      { to: "/vat-free-silver/", label: "VAT-free silver" },
      { to: "/prices/", label: "Live prices" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about/", label: "About" },
      { to: "/locations/", label: "Branches" },
      { to: "/about/security-and-trust/", label: "Security and trust" },
      { to: "/faq/", label: "FAQ" },
      { to: "/contact/", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms-and-conditions/", label: "Terms and conditions" },
      { to: "/privacy-policy/", label: "Privacy policy" },
      { to: "/cookie-policy/", label: "Cookie policy" },
    ],
  },
] as const;

/** The site footer: sections, legal links, company details, and one mention of Merrion Vaults. */
export function PublicFooter() {
  return (
    <footer className="bg-card border-t px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-muted-foreground text-sm">
            Call <a href={`tel:${COMPANY.phone.tel}`} className="text-foreground hover:underline">{COMPANY.phone.display}</a> or WhatsApp{" "}
            <a href={COMPANY.whatsapp.href} className="text-foreground hover:underline">{COMPANY.whatsapp.display}</a>.
          </p>
          <p className="text-muted-foreground text-sm">
            Safe deposit boxes at{" "}
            <a href={COMPANY.vaultsUrl} className="text-foreground underline underline-offset-4" rel="noopener">
              Merrion Vaults
            </a>
            .
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2">
            <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-widest uppercase">{column.title}</p>
            {column.links.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <p className="text-muted-foreground mx-auto mt-10 max-w-6xl text-xs">
        {COMPANY.legalName} · Company number {COMPANY.companyNumber} · LEI {COMPANY.lei}
      </p>
    </footer>
  );
}
