import { memo } from "react";
import { Link } from "react-router-dom";
import ProfileImage from '../assets/irene.jpeg';
import { SITE, FACTS } from "../config/site";

/* Rendered both on its own at /about and as a section of the home page,
   so it carries no full-height or page-level chrome of its own. */
export default memo(function About() {
  return (
    <section className="section bg-husk">
      <div className="shell">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_22rem] items-start">

          <div>
            <div className="section-head">
              <h2 className="t-h2">Who you will be working with</h2>
            </div>

            <p className="t-body text-[1.0625rem]">
              My name is {SITE.person}. I started with a small piece of land and a
              stubborn belief that it could feed my family and pay for itself. Onions
              and garlic are where I settled, and I learned them the slow way &mdash; through
              a few good seasons and several expensive ones.
            </p>

            <p className="t-body text-[1.0625rem] mt-5">
              Farm with Irene exists so other farmers do not have to pay for those
              lessons twice. What I share is what works in our soil, our water and our
              markets: real spacing, real spray programmes, real numbers. If you want to
              farm more deliberately and make fewer costly mistakes, we will get on well.
            </p>

            {FACTS.basedIn && (
              <p className="mt-6 text-sm text-quiet">Based in {FACTS.basedIn}.</p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/booking" className="btn btn-primary">Book a consultation</Link>
              <Link to="/projects" className="btn btn-outline">See the field work</Link>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto lg:mx-0 lg:sticky lg:top-28">
            <img
              src={ProfileImage}
              alt={SITE.person}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/5] object-cover rounded-[0.625rem] border border-rule"
            />
            <p className="mt-3 text-sm text-quiet">
              {SITE.person} &mdash; {SITE.tagline.toLowerCase()}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
});
