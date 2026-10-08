/**
 * The Knowledge Center's front door: a swimlane that starts from the one
 * question every desk interaction begins with — who is paying whom? — and
 * then lays out the phases of that trade twice: what you do at the desk, and
 * what you click in Business Central (BC). Every node points at the exact SOP
 * section that answers "what do I do now?".
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

export interface KbGuideLink {
  label: string;
  target: KbGuideTarget;
}

/** The two flows. Price is what the customer pays us; Buyback is what we pay (customers and suppliers). */
export type KbFlowTone = 'price' | 'buyback';

/** The Business Central hub page in the web app (the route lives in apps/web/src/config/routes.tsx). */
export const KB_BC_HUB_PATH = '/knowledge/business-central';

// ── Home: the swimlane ─────────────────────────────────────────────────────

export interface KbGuideNode {
  title: string;
  hint: string;
  target: KbGuideTarget;
  /** `soft` is a side situation (reprice); `external` is "not your step" / "nothing to do yet" and renders dashed. */
  kind?: 'soft' | 'external';
  /** Only some of the time ("if new"). */
  optional?: boolean;
}

/** The red STOP bar that runs across both lanes of a phase. */
export interface KbGuideGate {
  title: string;
  hint: string;
  target: KbGuideTarget;
}

export interface KbGuidePhase {
  title: string;
  gate?: KbGuideGate;
  /** What you do with the customer. */
  desk: KbGuideNode[];
  /** What you click in BC, in the real BC order. */
  bc: KbGuideNode[];
}

export interface KbGuideBranch {
  id: KbFlowTone;
  title: string;
  /** Who is buying, in plain words. */
  tag: string;
  blurb: string;
  icon: KbGuideIcon;
  phases: KbGuidePhase[];
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

/** The Business Central banner on the home page: learn it, see both flows, or get unstuck. */
export interface KbGuideBc {
  title: string;
  hint: string;
  start: KbGuideLink;
  hub: KbGuideLink;
  stuck: KbGuideLink;
}

// ── Business Central hub ───────────────────────────────────────────────────

export type KbBcHubItem =
  | { kind: 'step'; title: string; hint: string; /** The BC screen to open, shown as a mono chip. */ screen: string; target: KbGuideTarget }
  | { kind: 'stop'; title: string; hint: string; target: KbGuideTarget }
  | { kind: 'external'; title: string; hint: string; target: KbGuideTarget };

export interface KbBcHubFlow {
  id: KbFlowTone;
  title: string;
  sub: string;
  items: KbBcHubItem[];
  foot: KbGuideLink;
}

export interface KbBcChainLink {
  label: string;
  target: KbGuideTarget;
  tone?: 'stop' | 'end';
}

export interface KbBcScreen {
  /** The page name as BC shows it — what staff actually know. */
  title: string;
  hint: string;
  flow: KbFlowTone;
  target: KbGuideTarget;
}

export interface KbBcTrap {
  title: string;
  hint: string;
  target: KbGuideTarget;
}

export interface KbBcHub {
  title: string;
  intro: string;
  flows: KbBcHubFlow[];
  /** "The whole sale, in one line". */
  chain: KbBcChainLink[];
  screens: KbBcScreen[];
  zoho: { zoho: string; bc: string; target: KbGuideTarget }[];
  traps: KbBcTrap[];
  stop: { title: string; hint: string; target: KbGuideTarget };
}

// ── Flow bars: the stepper at the top of a procedure ───────────────────────

export interface KbFlowBar {
  id: string;
  label: string;
  tone: KbFlowTone;
  items: { slug: string; label: string }[];
  /** Steps happen in this order, so the last step's "Next" can be derived from it. Desk bars are a set, not a sequence. */
  sequential: boolean;
  /** "See the whole flow". */
  overview: KbGuideTarget;
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
    hint: 'Pick the side of the trade. Each step shows what to do at the desk and what to click in BC.',
  },

  businessCentral: {
    title: 'Business Central',
    hint: 'The exact clicks for every job. Lost on a BC screen? Find it by name.',
    start: { label: 'New to BC? Start here', target: { slug: 'bc-quick-start' } },
    hub: { label: 'Both flows on one page', target: { href: KB_BC_HUB_PATH } },
    stuck: { label: 'Stuck? When to stop', target: { slug: 'bc-troubleshooting-and-escalation' } },
  },

  branches: [
    {
      id: 'price',
      title: 'Price',
      tag: 'Customer buys from us',
      blurb: 'They pay us. Quote, take payment, lock the price, hand over.',
      icon: 'receipt',
      phases: [
        {
          title: 'Quote',
          desk: [
            {
              title: 'Quote the customer',
              hint: 'Identify them, price it, check stock, send it',
              target: { slug: 'customer-inquiry-to-quote', anchor: 'steps' },
            },
            { title: 'Work out the Price', hint: 'Spot, premium and VAT', target: { slug: 'pricing', anchor: 'sell-price' } },
          ],
          bc: [
            {
              title: 'New customer',
              hint: 'Only if they are not in BC yet',
              target: { slug: 'bc-new-customer', anchor: 'steps' },
              optional: true,
            },
            {
              title: 'Sales Quote',
              hint: 'Create it and send it with the payment reference',
              target: { slug: 'bc-sales-quote', anchor: 'create-the-quote' },
            },
          ],
        },
        {
          title: 'Wait for money',
          gate: {
            title: 'STOP — has the money landed?',
            hint: 'Nothing moves until the funds are confirmed. A screenshot or the customer’s word is not proof.',
            target: { slug: 'payment-lock-and-hedge', anchor: 'confirming-funds' },
          },
          desk: [
            {
              title: 'Take payment',
              hint: 'Bank transfer, card or cash, and the fees',
              target: { slug: 'payment-lock-and-hedge', anchor: 'accepted-payment-methods' },
            },
          ],
          bc: [
            {
              title: 'Nothing to do in BC yet',
              hint: 'Do not convert the quote',
              target: { slug: 'bc-sales-quote', anchor: 'stop-here' },
              kind: 'external',
            },
          ],
        },
        {
          title: 'Lock it in',
          desk: [
            {
              title: 'Lock the price and hedge',
              hint: 'At current spot. A manager places the hedge',
              target: { slug: 'payment-lock-and-hedge', anchor: 'steps' },
            },
            {
              title: 'Price moved?',
              hint: 'Reprice, call the customer, record their choice',
              target: { slug: 'customer-inquiry-to-quote', anchor: 'price-changed-before-funds-landed' },
              kind: 'soft',
            },
          ],
          bc: [
            {
              title: 'Sales Order',
              hint: 'Make Order from the quote',
              target: { slug: 'bc-sales-order-and-prepayment', anchor: 'convert-the-quote-to-a-sales-order' },
            },
            {
              title: 'Prepayment Invoice',
              hint: 'Enter the prepayment, post it, check it posted',
              target: { slug: 'bc-sales-order-and-prepayment', anchor: 'post-the-prepayment-invoice' },
            },
            { title: 'Record the payment', hint: 'Cash Receipt Journal. Amount is negative', target: { slug: 'bc-record-customer-payment' } },
            {
              title: 'Release and confirm',
              hint: 'Fills the Hedging table, then email the customer',
              target: { slug: 'bc-release-and-confirm', anchor: 'steps' },
            },
          ],
        },
        {
          title: 'Hand over',
          desk: [
            {
              title: 'Check ID and hand it over',
              hint: 'Signature, mark as collected',
              target: { slug: 'customer-collection', anchor: 'steps' },
            },
          ],
          bc: [
            {
              title: 'Collect or ship',
              hint: 'Serials, then Post → Ship and Invoice',
              target: { slug: 'bc-collection-and-shipment', anchor: 'final-posting' },
            },
          ],
        },
      ],
      alsoSee: [
        { label: 'Bonded silver (VAT-free)', target: { slug: 'bonded-silver-storage' } },
        { label: 'Cash of €10,000 or more', target: { slug: 'cash-transactions-ie' } },
      ],
    },
    {
      id: 'buyback',
      title: 'Buyback',
      tag: 'Customer sells to us',
      blurb: 'We pay them. Test the item, agree a price, record it, pay by bank transfer.',
      icon: 'hand-coins',
      phases: [
        {
          title: 'Identify',
          desk: [
            {
              title: 'Identify the customer',
              hint: 'Check photo ID and run the AML checks',
              target: { slug: 'customer-buyback', anchor: 'steps' },
            },
          ],
          bc: [
            {
              title: 'New vendor',
              hint: 'A customer selling to us is a vendor in BC',
              target: { slug: 'bc-new-vendor', anchor: 'steps' },
            },
          ],
        },
        {
          title: 'Test and price',
          desk: [
            {
              title: 'Test the item',
              hint: 'Tester, weight, dimensions, condition',
              target: { slug: 'customer-buyback', anchor: 'testing' },
            },
            {
              title: 'Work out the Buyback',
              hint: 'Spot value less the product discount',
              target: { slug: 'pricing', anchor: 'buy-price' },
            },
          ],
          bc: [
            {
              title: 'Nothing to do in BC yet',
              hint: 'Test first, then record',
              target: { slug: 'bc-purchase-orders', anchor: 'rules' },
              kind: 'external',
            },
          ],
        },
        {
          title: 'Agree and record',
          desk: [
            {
              title: 'Agree it and do the paperwork',
              hint: 'Receipt, copies, price, signatures',
              target: { slug: 'buyback-paperwork-and-testing', anchor: 'at-the-desk' },
            },
          ],
          bc: [
            {
              title: 'Purchase Order',
              hint: 'Vendor, item, quantity, unit cost',
              target: { slug: 'bc-purchase-orders', anchor: 'steps' },
            },
            {
              title: 'Serial numbers',
              hint: 'Bars only. One serial per bar',
              target: { slug: 'bc-purchase-orders', anchor: 'serial-numbers-for-bars' },
            },
          ],
        },
        {
          title: 'Pay',
          desk: [
            {
              title: 'Pay by bank transfer',
              hint: 'Tell them the timing first',
              target: { slug: 'customer-buyback', anchor: 'paying-the-customer' },
            },
          ],
          bc: [
            {
              title: 'Accounts pay the seller',
              hint: 'Not a branch step',
              target: { slug: 'bc-purchase-orders', anchor: 'who-does-what' },
              kind: 'external',
            },
          ],
        },
        {
          title: 'Into stock',
          desk: [
            {
              title: 'Put it into stock',
              hint: 'Counted in the monthly stock take',
              target: { slug: 'stock-management', anchor: 'monthly-stock-take' },
            },
          ],
          bc: [
            {
              title: 'Receive and invoice',
              hint: 'Goods and serials checked? Home → Post',
              target: { slug: 'bc-purchase-orders', anchor: 'steps' },
            },
          ],
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

/** Business Central on one page: the two flows, a screen finder, the Zoho translation and the traps. */
export const KB_BC_HUB: KbBcHub = {
  title: 'Two jobs, two flows.',
  intro:
    'Everything you do in Business Central is either a customer buying from us, or us buying in. Learn the shape of each flow first, then tap any step for the exact clicks.',

  flows: [
    {
      id: 'price',
      title: 'Customer buys from us',
      sub: 'Price flow',
      items: [
        {
          kind: 'step',
          title: 'Sales Quote',
          hint: 'Price it and send it with the payment reference',
          screen: 'Sales Quotes → New',
          target: { slug: 'bc-sales-quote' },
        },
        {
          kind: 'stop',
          title: 'STOP: payment confirmed?',
          hint: 'Nothing moves until it is',
          target: { slug: 'bc-sales-quote', anchor: 'stop-here' },
        },
        {
          kind: 'step',
          title: 'Sales Order',
          hint: 'Convert the quote, check the price',
          screen: 'Quote → Make Order',
          target: { slug: 'bc-sales-order-and-prepayment', anchor: 'convert-the-quote-to-a-sales-order' },
        },
        {
          kind: 'step',
          title: 'Prepayment Invoice',
          hint: 'Enter the prepayment, post it, check it posted',
          screen: 'Actions → Posting → Prepayment',
          target: { slug: 'bc-sales-order-and-prepayment', anchor: 'post-the-prepayment-invoice' },
        },
        {
          kind: 'step',
          title: 'Cash Receipt Journal',
          hint: 'Record the money, apply it to the invoice',
          screen: 'Cash Receipt Journals',
          target: { slug: 'bc-record-customer-payment' },
        },
        {
          kind: 'step',
          title: 'Release',
          hint: 'Fills the Hedging table, then confirm',
          screen: 'Home → Release',
          target: { slug: 'bc-release-and-confirm' },
        },
        {
          kind: 'step',
          title: 'Collect or Ship',
          hint: 'Ship and Invoice removes the stock',
          screen: 'Orders Awaiting Collection',
          target: { slug: 'bc-collection-and-shipment' },
        },
      ],
      foot: { label: 'The whole sale in one page', target: { slug: 'bc-customer-sales-workflow' } },
    },
    {
      id: 'buyback',
      title: 'We buy in',
      sub: 'Customer Buyback or supplier order',
      items: [
        {
          kind: 'step',
          title: 'Vendor',
          hint: 'Search first. New ones use DOM-VEND',
          screen: 'Vendors → New',
          target: { slug: 'bc-new-vendor' },
        },
        {
          kind: 'step',
          title: 'Purchase Order',
          hint: 'Item, quantity, direct unit cost',
          screen: 'Purchase Orders → New',
          target: { slug: 'bc-purchase-orders', anchor: 'steps' },
        },
        {
          kind: 'step',
          title: 'Serial numbers',
          hint: 'Bars only: one serial per bar',
          screen: 'Line → Item Tracking Lines',
          target: { slug: 'bc-purchase-orders', anchor: 'serial-numbers-for-bars' },
        },
        {
          kind: 'step',
          title: 'Check and print',
          hint: 'Total vs the agreed deal. PO for signatures',
          screen: 'Print/Send',
          target: { slug: 'bc-purchase-orders', anchor: 'steps' },
        },
        {
          kind: 'external',
          title: 'Accounts pays the seller',
          hint: 'Not a branch step. Just wait for it',
          target: { slug: 'bc-purchase-orders', anchor: 'who-does-what' },
        },
        {
          kind: 'step',
          title: 'Receive and Invoice',
          hint: 'Puts the stock into inventory',
          screen: 'Home → Post',
          target: { slug: 'bc-purchase-orders', anchor: 'steps' },
        },
      ],
      foot: { label: 'Stuck on a Purchase Order?', target: { slug: 'bc-troubleshooting-and-escalation', anchor: 'common-problems' } },
    },
  ],

  chain: [
    { label: 'Quote', target: { slug: 'bc-sales-quote' } },
    { label: 'Wait', target: { slug: 'bc-sales-quote', anchor: 'stop-here' }, tone: 'stop' },
    { label: 'Order', target: { slug: 'bc-sales-order-and-prepayment' } },
    { label: 'Prepay Invoice', target: { slug: 'bc-sales-order-and-prepayment', anchor: 'post-the-prepayment-invoice' } },
    { label: 'Journal', target: { slug: 'bc-record-customer-payment' } },
    { label: 'Release', target: { slug: 'bc-release-and-confirm' } },
    { label: 'Hand over', target: { slug: 'bc-collection-and-shipment' }, tone: 'end' },
  ],

  screens: [
    { title: 'Customers', hint: 'Search before you create', flow: 'price', target: { slug: 'bc-new-customer', anchor: 'steps' } },
    { title: 'Sales Quotes', hint: 'New quote, lines, Print/Send', flow: 'price', target: { slug: 'bc-sales-quote', anchor: 'create-the-quote' } },
    {
      title: 'Sales Orders',
      hint: 'Prepayment and Post Prepayment Invoice',
      flow: 'price',
      target: { slug: 'bc-sales-order-and-prepayment', anchor: 'post-the-prepayment-invoice' },
    },
    {
      title: 'Cash Receipt Journals',
      hint: 'Negative amount, then Apply Entries',
      flow: 'price',
      target: { slug: 'bc-record-customer-payment', anchor: 'fill-in-the-journal' },
    },
    {
      title: 'Apply Entries',
      hint: 'Link the payment to the invoice',
      flow: 'price',
      target: { slug: 'bc-record-customer-payment', anchor: 'link-the-payment-to-the-invoice' },
    },
    {
      title: 'Orders Awaiting Collection',
      hint: 'Find the order and the balance owing',
      flow: 'price',
      target: { slug: 'bc-collection-and-shipment', anchor: 'find-the-customer-s-order' },
    },
    {
      title: 'Item Tracking Lines',
      hint: 'One serial per bar, Quantity (Base) 1',
      flow: 'price',
      target: { slug: 'bc-collection-and-shipment', anchor: 'serial-numbers-for-bars' },
    },
    { title: 'Vendors', hint: 'DOM-VEND template', flow: 'buyback', target: { slug: 'bc-new-vendor', anchor: 'steps' } },
    { title: 'Purchase Orders', hint: 'Lines, serials, Receive and invoice', flow: 'buyback', target: { slug: 'bc-purchase-orders', anchor: 'steps' } },
    { title: 'Hedging table', hint: 'Filled by Release', flow: 'price', target: { slug: 'bc-release-and-confirm', anchor: 'steps' } },
  ],

  zoho: [
    { zoho: 'Estimate', bc: 'Sales Quote', target: { slug: 'bc-sales-quote' } },
    { zoho: 'Invoice', bc: 'Sales Order + Prepayment Invoice', target: { slug: 'bc-sales-order-and-prepayment' } },
    { zoho: 'Record Payment', bc: 'Cash Receipt Journal + Apply Entries', target: { slug: 'bc-record-customer-payment' } },
    { zoho: '(no equivalent)', bc: 'Release → fills the Hedging table', target: { slug: 'bc-release-and-confirm' } },
    { zoho: 'Mark as delivered', bc: 'Post → Ship and Invoice', target: { slug: 'bc-collection-and-shipment', anchor: 'final-posting' } },
  ],

  traps: [
    {
      title: 'Journal amount is negative',
      hint: '€4,495 received → -4495',
      target: { slug: 'bc-record-customer-payment', anchor: 'fill-in-the-journal' },
    },
    {
      title: 'Prepayment field is 100',
      hint: 'Even if only part has been paid',
      target: { slug: 'bc-sales-order-and-prepayment', anchor: 'the-prepayment-value' },
    },
    { title: 'Release before confirming', hint: 'No Release, no Hedging table', target: { slug: 'bc-release-and-confirm', anchor: 'steps' } },
    {
      title: 'One serial per bar',
      hint: 'Quantity (Base) = 1 on every line',
      target: { slug: 'bc-collection-and-shipment', anchor: 'serial-numbers-for-bars' },
    },
    { title: 'Start from a Quote', hint: 'Never a standalone Sales Order', target: { slug: 'bc-sales-quote' } },
    { title: 'Location Code DU', hint: 'On every sales quote line', target: { slug: 'bc-sales-quote', anchor: 'create-the-quote' } },
  ],

  stop: {
    title: 'Stop and ask a manager',
    hint: 'Amendments, cancellations, reversals, posting corrections, or anything that doesn’t match these flows. Don’t use a function just because it’s in the menu.',
    target: { slug: 'bc-troubleshooting-and-escalation', anchor: 'when-to-stop' },
  },
};

/**
 * Where a procedure sits in the process, for the stepper at the top of its
 * page. Membership lives here rather than in SOP frontmatter, so the SOP owners'
 * files stay untouched.
 */
export const KB_FLOW_BARS: KbFlowBar[] = [
  {
    id: 'bc-price',
    label: 'In Business Central · Customer buys from us',
    tone: 'price',
    sequential: true,
    overview: { href: KB_BC_HUB_PATH },
    items: [
      { slug: 'bc-new-customer', label: 'New customer' },
      { slug: 'bc-sales-quote', label: 'Sales Quote' },
      { slug: 'bc-sales-order-and-prepayment', label: 'Order + prepayment' },
      { slug: 'bc-record-customer-payment', label: 'Record payment' },
      { slug: 'bc-release-and-confirm', label: 'Release' },
      { slug: 'bc-collection-and-shipment', label: 'Collect / ship' },
    ],
  },
  {
    id: 'bc-buy',
    label: 'In Business Central · We buy in',
    tone: 'buyback',
    sequential: true,
    overview: { href: KB_BC_HUB_PATH },
    items: [
      { slug: 'bc-new-vendor', label: 'New vendor' },
      { slug: 'bc-purchase-orders', label: 'Purchase Order' },
    ],
  },
  {
    id: 'desk-price',
    label: 'At the desk · Price',
    tone: 'price',
    sequential: false,
    overview: { href: '/knowledge?flow=price' },
    items: [
      { slug: 'customer-inquiry-to-quote', label: 'Quote' },
      { slug: 'pricing', label: 'Price' },
      { slug: 'payment-lock-and-hedge', label: 'Payment and lock' },
      { slug: 'customer-collection', label: 'Hand over' },
    ],
  },
  {
    id: 'desk-buyback',
    label: 'At the desk · Buyback',
    tone: 'buyback',
    sequential: false,
    overview: { href: '/knowledge?flow=buyback' },
    items: [
      { slug: 'customer-buyback', label: 'Buyback' },
      { slug: 'buyback-paperwork-and-testing', label: 'Paperwork and testing' },
      { slug: 'stock-management', label: 'Stock' },
    ],
  },
];

/** The flow bar a procedure belongs to, and its place in it. Null when the procedure isn't part of a flow. */
export function flowBarFor(slug: string, bars: KbFlowBar[] = KB_FLOW_BARS): { bar: KbFlowBar; index: number } | null {
  for (const bar of bars) {
    const index = bar.items.findIndex((item) => item.slug === slug);
    if (index >= 0) return { bar, index };
  }
  return null;
}

/** The slug of the next step in a sequential flow, when the procedure has none of its own "Next" section. */
export function flowNextSlug(slug: string, bars: KbFlowBar[] = KB_FLOW_BARS): string | null {
  const found = flowBarFor(slug, bars);
  if (!found || !found.bar.sequential) return null;
  return found.bar.items[found.index + 1]?.slug ?? null;
}

export interface KbGuideLibraryTarget {
  slug: string;
  anchor?: string;
  pendingSop: boolean;
}

/** Every library target the guide points at, for tests and for the web app's resolver. */
export function guideLibraryTargets(
  guide: KbGuide = KB_GUIDE,
  hub: KbBcHub = KB_BC_HUB,
  bars: KbFlowBar[] = KB_FLOW_BARS,
): KbGuideLibraryTarget[] {
  const out: KbGuideLibraryTarget[] = [];
  const add = (target: KbGuideTarget, pendingSop = false) => {
    if ('slug' in target) out.push({ slug: target.slug, anchor: target.anchor, pendingSop });
  };

  const bc = guide.businessCentral;
  [bc.start, bc.hub, bc.stuck].forEach((link) => add(link.target));

  for (const branch of guide.branches) {
    for (const phase of branch.phases) {
      if (phase.gate) add(phase.gate.target);
      [...phase.desk, ...phase.bc].forEach((node) => add(node.target));
    }
    branch.alsoSee.forEach((link) => add(link.target));
  }
  [...guide.quickLinks, ...guide.tools].forEach((shortcut) => add(shortcut.target, shortcut.pendingSop));

  for (const flow of hub.flows) {
    flow.items.forEach((item) => add(item.target));
    add(flow.foot.target);
  }
  hub.chain.forEach((link) => add(link.target));
  hub.screens.forEach((screen) => add(screen.target));
  hub.zoho.forEach((row) => add(row.target));
  hub.traps.forEach((trap) => add(trap.target));
  add(hub.stop.target);

  for (const bar of bars) {
    bar.items.forEach((item) => add({ slug: item.slug }));
    add(bar.overview);
  }
  return out;
}
