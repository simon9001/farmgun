import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE } from '../../config/site';

/** Standard page opening: title, optional lead, optional action. */
export const PageHeader = ({ title, lead, action }) => (
  <div className="bg-white border-b border-rule">
    <div className="shell py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="t-display text-[clamp(2rem,1.4rem+2.4vw,3rem)] rise">{title}</h1>
          {lead && <p className="t-lead mt-4 rise rise-1">{lead}</p>}
        </div>
        {action && <div className="rise rise-2">{action}</div>}
      </div>
    </div>
  </div>
);

export const LoadingState = ({ label = 'Loading' }) => (
  <div className="flex justify-center items-center py-24" role="status" aria-label={label}>
    <Loader2 className="w-6 h-6 animate-spin text-field" />
  </div>
);

/** Errors say what happened and give a way forward, rather than apologising. */
export const ErrorState = ({ what = 'this page' }) => (
  <div className="py-20 text-center">
    <AlertCircle className="w-8 h-8 mx-auto text-bulb" aria-hidden="true" />
    <p className="mt-4 font-medium">We could not load {what}.</p>
    <p className="mt-1 text-sm text-quiet">
      Check your connection and reload. If it keeps happening, call{' '}
      <a href={SITE.phoneHref} className="link tnum">{SITE.phoneDisplay}</a>.
    </p>
    <button onClick={() => window.location.reload()} className="btn btn-outline mt-6">
      Reload the page
    </button>
  </div>
);

/** An empty screen is an invitation to act, not a dead end. */
export const EmptyState = ({ message, cta = true }) => (
  <div className="py-20 text-center">
    <p className="font-medium">{message}</p>
    {cta && (
      <>
        <p className="mt-1 text-sm text-quiet">
          Call {SITE.phoneDisplay} and we will talk through what you need.
        </p>
        <Link to="/contact" className="btn btn-primary mt-6">Get in touch</Link>
      </>
    )}
  </div>
);

/** One still image, or a lettered placeholder. Used across every card grid. */
export const Thumb = ({ src, alt, className = '' }) => (
  src ? (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      className={`w-full h-full object-cover ${className}`}
    />
  ) : (
    <div className={`w-full h-full grid place-items-center bg-field-tint text-field font-display text-2xl ${className}`}>
      {alt?.charAt(0)?.toUpperCase() || '·'}
    </div>
  )
);
