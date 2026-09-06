/**
 * Single source of truth for business details shown across the site.
 * Edit here and every page updates.
 *
 * NOTE: the entries marked TODO are claims only Irene can confirm. They are
 * left as null on purpose — the pages check for null and simply omit them
 * rather than showing a made-up number. Fill them in to switch them on.
 */

export const SITE = {
  name: "Farm with Irene",
  person: "Irene Mwangi",
  tagline: "Onion & garlic agronomy",

  /* Served from public/, so this is a stable, crawlable URL. It is also the
     favicon, the apple-touch icon, the PWA icon, and the `logo` in the
     Organization structured data in index.html — keep those in step if it moves. */
  logo: "/logo.png",

  phoneDisplay: "+254 784 298 879",
  phoneHref: "tel:+254784298879",
  whatsappHref: "https://wa.me/254784298879",

  email: "FarmWithIrene@gmail.com",
  emailHref: "mailto:FarmWithIrene@gmail.com",

  social: {
    facebook: "https://www.facebook.com/share/1aNUzPY1yX",
    instagram: "https://www.instagram.com/farmwithirene",
    // Was missing its protocol, so the browser treated it as a relative path.
    tiktok: "https://www.tiktok.com/@farm_with_irene",
    youtube: "https://www.youtube.com/@FarmWithIrene",
  },
};

export const FACTS = {
  /** TODO: e.g. "Nyandarua County, Kenya" — shown in the hero and footer. */
  basedIn: null,
  /** TODO: e.g. 8 — rendered as "8 years in the field". */
  yearsFarming: null,
  /** TODO: e.g. "Mon–Sat, 8am–6pm" — shown beside the phone number. */
  hours: null,
};

/** Crops Irene specialises in. Shown in the hero as a plain, honest statement. */
export const SPECIALITIES = ["Onions", "Garlic"];
