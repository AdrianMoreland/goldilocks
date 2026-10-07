/**
 * The Knowledge Center's front door: a flowchart that starts from the one
 * question every desk interaction begins with — who is paying whom? — and
 * then chains the steps, each pointing at the exact SOP section that answers
 * "what do I do now?".
 *
 * This is navigation, not content: the SOP files stay the owners'. It lives
 * here (plain data, no UI imports) so a test can check every target against
 * the real SOP files — an owner renaming a heading must fail a test, not
 * silently break a link on the desk's most-used page.
 *
 * Wording follows the product vocabulary: "Price" is what the customer pays
 * us, "Buyback" is what we pay the customer — never "Sell"/"Buy".
 */

/** Icon names the web app maps to its icon set; kept as strings so this package stays UI-free. */
export type KbGuideIcon =
  | 'file-text'
  | 'calculator'
  | 'banknote'
  | 'lock'
  | 'package-check'
  | 'id-card'
  | 'search-check'
  | 'hand-coins'
  | 'boxes'
  | 'vault'
  | 'book-user'
  | 'shield-check'
  | 'messages'
  | 'phone'
  | 'blocks'
  | 'layout-dashboard'
  | 'user-search'
  | 'receipt';

/** A place in the library (a whole SOP, or one section of it), or somewhere else in the app. */
export type KbGuideTarget = { slug: string; anchor?: string } | { href: string };

export interface KbGuideStep {
  title: string;
  hint: string;
  icon: KbGuideIcon;
  target: KbGuideTarget;
  /** The matching Business Central how-to, shown as a small "In BC" link under the step. */
  bc?: KbGuideLink;
}

export interface KbGuideLink {
  label: string;
  target: KbGuideTarget;
}

export interface KbGuideBranch {
  id: 'price' | 'buyback';
  title: string;
  /** Who is buying, in plain words. */
  tag: string;
  blurb: string;
  icon: KbGuideIcon;
  steps: KbGuideStep[];
  /** Side situations that branch off this path. */
  alsoSee: KbGuideLink[];
}

export interface KbGuideShortcut {
  label: string;
  hint: string;
  icon: KbGuideIcon;
  target: KbGuideTarget;
  /** The SOP doesn't exist yet; the tile shows "coming soon" instead of a dead link. */
  pendingSop?: boolean;
}

/** The Business Central strip on the home page: where to start, then the clicks for each job. */
export interface KbGuideBc {
  title: string;
  hint: string;
  start: KbGuideLink;
  links: KbGuideLink[];
}

export interface KbGuide {
  start: { title: string; hint: string };
  businessCentral: KbGuideBc;
  branches: KbGuideBranch[];
  quickLinks: KbGuideShortcut[];
  tools: KbGuideShortcut[];
}

export const KB_GUIDE: KbGuide = {
  start: {
    title: 'Who is paying whom?',
    hint: 'Pick the side of the trade. Everything else follows from it.',
  },

  businessCentral: {
    title: 'Business Central',
    hint: 'The exact clicks for each job in BC, in the order you do them.',
    start: { label: 'New to BC? Start here', target: { slug: 'bc-quick-start' } },
    links: [
      { label: 'A sale, step by step', target: { slug: 'bc-customer-sales-workflow' } },
      { label: 'New customer', target: { slug: 'bc-new-customer' } },
      { label: 'Sales Quote', target: { slug: 'bc-sales-quote' } },
      { label: 'Sales Order and prepayment', target: { slug: 'bc-sales-order-and-prepayment' } },
      { label: 'Record a payment', target: { slug: 'bc-record-customer-payment' } },
      { label: 'Release and confirm', target: { slug: 'bc-release-and-confirm' } },
      { label: 'Collection and shipment', target: { slug: 'bc-collection-and-shipment' } },
      { label: 'Buying: Purchase Order', target: { slug: 'bc-purchase-orders' } },
      { label: 'New vendor', target: { slug: 'bc-new-vendor' } },
      { label: 'Stuck? When to stop', target: { slug: 'bc-troubleshooting-and-escalation' } },
    ],
  },

  branches: [
    {
      id: 'price',
      title: 'Price',
      tag: 'Customer buys from us',
      blurb: 'They pay us. Quote, take payment, lock the price, hand over.',
      icon: 'receipt',
      steps: [
        {
          title: 'Quote the customer',
          hint: 'Identify them, price it, check stock, send the quote',
          icon: 'file-text',
          target: { slug: 'customer-inquiry-to-quote', anchor: 'steps' },
          bc: { label: 'Sales Quote in BC', target: { slug: 'bc-sales-quote' } },
        },
        {
          title: 'Work out the Price',
          hint: 'Spot, premium and VAT',
          icon: 'calculator',
          target: { slug: 'pricing', anchor: 'sell-price' },
        },
        {
          title: 'Take payment',
          hint: 'Bank transfer, card or cash — and confirm the funds landed',
          icon: 'banknote',
          target: { slug: 'payment-lock-and-hedge', anchor: 'accepted-payment-methods' },
          bc: { label: 'Record the payment in BC', target: { slug: 'bc-record-customer-payment' } },
        },
        {
          title: 'Lock the price and hedge',
          hint: 'Only once the funds have landed',
          icon: 'lock',
          target: { slug: 'payment-lock-and-hedge', anchor: 'steps' },
          bc: { label: 'Sales Order, prepayment and Release in BC', target: { slug: 'bc-sales-order-and-prepayment' } },
        },
        {
          title: 'Hand it over',
          hint: 'ID check, signature, mark as collected',
          icon: 'package-check',
          target: { slug: 'customer-collection', anchor: 'steps' },
          bc: { label: 'Collection in BC', target: { slug: 'bc-collection-and-shipment' } },
        },
      ],
      alsoSee: [
        { label: 'Price moved before funds landed', target: { slug: 'customer-inquiry-to-quote', anchor: 'price-changed-before-funds-landed' } },
        { label: 'Bonded silver (VAT-free)', target: { slug: 'bonded-silver-storage' } },
      ],
    },
    {
      id: 'buyback',
      title: 'Buyback',
      tag: 'Customer sells to us',
      blurb: 'We pay them. Test the item, agree a price, record it, pay by bank transfer.',
      icon: 'hand-coins',
      steps: [
        {
          title: 'Identify the customer',
          hint: 'Find or create them in BC, check their photo ID',
          icon: 'user-search',
          target: { slug: 'customer-buyback', anchor: 'steps' },
          bc: { label: 'New vendor card in BC', target: { slug: 'bc-new-vendor' } },
        },
        {
          title: 'Test the item',
          hint: 'Tester, weight, dimensions and condition',
          icon: 'search-check',
          target: { slug: 'customer-buyback', anchor: 'testing' },
        },
        {
          title: 'Work out the Buyback',
          hint: 'Spot value less the product’s discount',
          icon: 'calculator',
          target: { slug: 'pricing', anchor: 'buy-price' },
        },
        {
          title: 'Agree it and record it',
          hint: 'Every purchase goes into BC',
          icon: 'file-text',
          target: { slug: 'customer-buyback', anchor: 'purchase-records' },
          bc: { label: 'Purchase Order in BC', target: { slug: 'bc-purchase-orders' } },
        },
        {
          title: 'Pay the customer',
          hint: 'Bank transfer only — tell them the timing first',
          icon: 'banknote',
          target: { slug: 'customer-buyback', anchor: 'paying-the-customer' },
        },
        {
          title: 'Put it into stock',
          hint: 'Counted in the monthly stock take',
          icon: 'boxes',
          target: { slug: 'stock-management', anchor: 'monthly-stock-take' },
        },
      ],
      alsoSee: [
        { label: 'Scrap and non-standard items', target: { slug: 'pricing', anchor: 'scrap-and-non-standard-items' } },
        { label: 'Selling bonded silver back', target: { slug: 'bonded-silver-storage', anchor: 'selling-bonded-silver-back' } },
      ],
    },
  ],

  quickLinks: [
    {
      label: 'Checking a customer’s ID',
      hint: 'Accepted documents and the rules',
      icon: 'id-card',
      target: { slug: 'customer-collection', anchor: 'identity-check' },
    },
    {
      label: 'Who do I escalate to?',
      hint: 'Contacts by topic',
      icon: 'phone',
      target: { slug: 'branch-directory', anchor: 'escalation' },
    },
    {
      label: 'Which system do I use?',
      hint: 'BC, StoneX, Zoho and the rest',
      icon: 'blocks',
      target: { slug: 'systems-overview', anchor: 'system-map' },
    },
    {
      label: 'Monthly stock take',
      hint: 'Count, compare with BC, report differences',
      icon: 'boxes',
      target: { slug: 'stock-management', anchor: 'monthly-stock-take' },
    },
    {
      label: 'Is gold going up?',
      hint: 'What to say, and what not to',
      icon: 'messages',
      target: { slug: 'customer-market-questions' },
    },
  ],

  tools: [
    {
      label: 'Pricing Workbook',
      hint: 'Live spot and product prices',
      icon: 'layout-dashboard',
      target: { href: '/dashboard' },
    },
    {
      label: 'Pricing & VAT',
      hint: 'Spot, premiums, VAT rules',
      icon: 'calculator',
      target: { slug: 'pricing' },
    },
    {
      label: 'Stock',
      hint: 'Monthly count and the customer safe',
      icon: 'boxes',
      target: { slug: 'stock-management' },
    },
    {
      label: 'Bonded silver',
      hint: 'VAT-free storage and serial numbers',
      icon: 'vault',
      target: { slug: 'bonded-silver-storage' },
    },
    {
      label: 'Branch directory',
      hint: 'Addresses, hours and contacts',
      icon: 'book-user',
      target: { slug: 'branch-directory' },
    },
    {
      label: 'Compliance & ID',
      hint: 'KYC and AML checks',
      icon: 'shield-check',
      target: { slug: 'kyc-aml' },
    },
  ],
};

/** Every library target the guide points at, for tests and for the web app's resolver. */
export function guideLibraryTargets(guide: KbGuide = KB_GUIDE): { slug: string; anchor?: string; pendingSop: boolean }[] {
  const out: { slug: string; anchor?: string; pendingSop: boolean }[] = [];
  const add = (target: KbGuideTarget, pendingSop = false) => {
    if ('slug' in target) out.push({ slug: target.slug, anchor: target.anchor, pendingSop });
  };

  add(guide.businessCentral.start.target);
  guide.businessCentral.links.forEach((link) => add(link.target));
  for (const branch of guide.branches) {
    branch.steps.forEach((step) => {
      add(step.target);
      if (step.bc) add(step.bc.target);
    });
    branch.alsoSee.forEach((link) => add(link.target));
  }
  [...guide.quickLinks, ...guide.tools].forEach((shortcut) => add(shortcut.target, shortcut.pendingSop));
  return out;
}
