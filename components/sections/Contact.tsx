import SectionHead from "@/components/text/SectionHead";
import DotName from "@/components/ui/DotName";
import Shell from "@/components/ui/Shell";
import { profile } from "@/lib/content";

export default function Contact() {
  return (
    <footer id="contact" className="section contact" data-snap>
      <SectionHead cmd={`mail ${profile.user}`} title="Contact" />
      <div className="contact-grid">
        <div className="contact-copy">
          <p className="contact-big">
            Email is the best way to reach me. I&apos;m also on GitHub and LinkedIn.
          </p>
          <p className="contact-mail"><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
          <ul className="contact-links">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="btn"
                  data-magnetic
                >
                  [ {l.label.toLowerCase()} ]
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="win">
          <div className="win-bar"><span>sh</span><span>works, try it</span></div>
          <Shell />
        </div>
      </div>
      <DotName text={profile.short.toUpperCase()} />
      <div className="footer-meta">
        <span>© 2026 {profile.name}</span>
        <span>built with Next.js and GSAP. Music is generated in your browser.</span>
      </div>
    </footer>
  );
}
