// Company facts shown on every page. One place, so a phone number or a company number cannot differ between
// pages (docs/site-migration/current-site-audit.md, section 4).
export const COMPANY = {
  name: "Merrion Gold",
  legalName: "Merrion Gold Ltd",
  companyNumber: "537361",
  lei: "635400GUYAUTIUK88B49",
  phone: { display: "01 254 7901", tel: "+35312547901" },
  whatsapp: { display: "085 275 1841", href: "https://wa.me/353852751841" },
  email: "info@merriongold.ie",
  vaultsUrl: "https://www.merrionvaults.ie",
} as const;
