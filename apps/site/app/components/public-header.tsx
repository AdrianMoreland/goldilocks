import { Link, NavLink } from "react-router";
import { Button } from "@goldilocks/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@goldilocks/ui/sheet";

import { COMPANY } from "../config/company";

export const NAV_ITEMS = [
  { to: "/buy/", label: "Buy" },
  { to: "/sell-gold/", label: "Sell" },
  { to: "/prices/", label: "Prices" },
  { to: "/safe-deposit-box/", label: "Storage" },
  { to: "/learn/", label: "Learn" },
  { to: "/locations/", label: "Branches" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${COMPANY.name}, home`}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <circle cx="13" cy="13" r="11" fill="none" stroke="var(--gold)" strokeWidth="3" />
      </svg>
      <span className="font-heading text-lg tracking-[0.25em]">MERRION GOLD</span>
    </Link>
  );
}

const linkClass = ({ isActive }: { isActive: boolean }) => `text-[0.9375rem] font-medium hover:underline ${isActive ? "underline underline-offset-8" : ""}`;

export interface PublicHeaderProps {
  /** Items in the cart. */
  cartCount?: number;
}

/** The site header: logo, the six sections, the phone number and the cart. Collapses into a sheet on a phone. */
export function PublicHeader({ cartCount = 0 }: PublicHeaderProps) {
  return (
    <header className="bg-background flex items-center gap-6 border-b px-6 py-4">
      <Logo />
      <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <a href={`tel:${COMPANY.phone.tel}`} className="text-muted-foreground hidden text-sm hover:underline lg:inline">
          {COMPANY.phone.display}
        </a>
        <Button asChild size="sm">
          <Link to="/cart/">Cart ({cartCount})</Link>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="md:hidden" aria-label="Open menu">
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-4 px-4">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
              <a href={`tel:${COMPANY.phone.tel}`} className="text-muted-foreground text-sm">
                {COMPANY.phone.display}
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
