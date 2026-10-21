import SectionHead from "@/components/text/SectionHead";
import Scramble from "@/components/text/Scramble";
import Marquee from "@/components/ui/Marquee";
import { contributions, profile, skills } from "@/lib/content";

export default function OpenSource() {
  return (
    <section className="section oss">
      <SectionHead cmd={`gh search prs --author=${profile.github}`} title="Open source" />
      <ul className="oss-list">
        {contributions.map((c) => (
          <li key={c.repo}>
            <a href={`https://github.com/${c.repo}`} target="_blank" rel="noreferrer" className="oss-row">
              <span className={`oss-state oss-state--${c.state}`}>{c.state}</span>
              <span className="oss-repo"><Scramble text={c.repo} onReveal={false} /></span>
              <span className="oss-note">{c.note}</span>
              <span className="oss-stars">{c.stars && `★ ${c.stars}`}</span>
            </a>
          </li>
        ))}
      </ul>
      <Marquee items={skills} />
    </section>
  );
}
