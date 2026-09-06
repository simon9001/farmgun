import { memo } from "react";
import { Link } from 'react-router-dom';
import { Mail, Facebook, Youtube, Phone, Instagram, MessageCircle, MapPin } from "lucide-react";
import { SITE, FACTS } from "../config/site";

const TikTok = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const SOCIALS = [
  { href: SITE.social.facebook, title: "Facebook", Icon: Facebook },
  { href: SITE.social.instagram, title: "Instagram", Icon: Instagram },
  { href: SITE.social.tiktok, title: "TikTok", Icon: TikTok },
  { href: SITE.social.youtube, title: "YouTube", Icon: Youtube },
];

const EXPLORE = [
  { to: "/services", label: "Services" },
  { to: "/crops", label: "Crops" },
  { to: "/projects", label: "Field work" },
  { to: "/blogs", label: "Guides" },
];

const COMPANY = [
  { to: "/about", label: "About Irene" },
  { to: "/testimonials", label: "Client results" },
  { to: "/partners", label: "Partners" },
  { to: "/contact", label: "Contact" },
];

const FooterColumn = ({ heading, links }) => (
  <div>
    <h3 className="text-sm font-semibold text-ink mb-3 font-sans">{heading}</h3>
    <ul className="space-y-2">
      {links.map(({ to, label }) => (
        <li key={to}>
          <Link to={to} className="text-sm text-quiet hover:text-field transition-colors">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = memo(() => (
  <footer className="bg-white border-t border-rule mt-auto">
    <div className="shell py-14">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src={SITE.logo} alt="" width="40" height="40" loading="lazy" className="w-10 h-10 shrink-0" />
            <span className="font-display text-xl font-semibold text-field">{SITE.name}</span>
          </div>
          <p className="text-sm text-quiet mt-3 leading-relaxed max-w-xs">
            Practical agronomy for Kenyan onion and garlic growers — from land
            preparation through to the buyer&rsquo;s scale.
          </p>

          <div className="flex gap-2 mt-5">
            {SOCIALS.map(({ href, title, Icon }) => (
              <a
                key={title}
                href={href}
                title={title}
                aria-label={title}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 grid place-items-center rounded-md border border-rule text-quiet hover:text-field hover:border-field transition-colors"
              >
                <Icon className="w-[1.05rem] h-[1.05rem]" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn heading="Explore" links={EXPLORE} />
        <FooterColumn heading="Farm with Irene" links={COMPANY} />

        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">Talk to us</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={SITE.phoneHref} className="flex items-center gap-2.5 text-quiet hover:text-field transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                <span className="tnum">{SITE.phoneDisplay}</span>
              </a>
              {FACTS.hours && <p className="text-xs text-quiet/80 mt-1 ml-6.5">{FACTS.hours}</p>}
            </li>
            <li>
              <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-quiet hover:text-field transition-colors">
                <MessageCircle className="w-4 h-4 shrink-0" />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={SITE.emailHref} className="flex items-center gap-2.5 text-quiet hover:text-field transition-colors break-all">
                <Mail className="w-4 h-4 shrink-0" />
                {SITE.email}
              </a>
            </li>
            {FACTS.basedIn && (
              <li className="flex items-center gap-2.5 text-quiet">
                <MapPin className="w-4 h-4 shrink-0" />
                {FACTS.basedIn}
              </li>
            )}
          </ul>

          <Link to="/booking" className="btn btn-primary btn-sm mt-5">
            Book a consultation
          </Link>
        </div>
      </div>

      <div className="border-t border-rule mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-quiet">
        <span>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
        <span>Built for farmers, in Kenya.</span>
      </div>
    </div>
  </footer>
));

Footer.displayName = "Footer";

export default Footer;
