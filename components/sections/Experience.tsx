import SectionHead from "@/components/text/SectionHead";
import Scramble from "@/components/text/Scramble";
import LineReveal from "@/components/text/LineReveal";
import { jobs } from "@/lib/content";

// A stable fake commit hash per job, so the log reads like the real thing.
const sha = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
};

export default function Experience() {
  return (
    <section id="experience" className="section experience" data-snap>
      <SectionHead cmd="git log --graph --author=srivishal" title="Experience" />
      <ol className="jobs">
        {jobs.map((j, i) => (
          <li key={j.company} className="job">
            <p className="job-commit">
              <span className="hl">commit {sha(j.company)}</span>
              {i === 0 && <span className="job-head"> (HEAD -&gt; main)</span>}
            </p>
            <p className="job-meta">Date: {j.period} · {j.place}</p>
            <div className="job-body">
              <Scramble as="h3" className="job-company" text={j.company} />
              <p className="job-role">{j.role}</p>
              <ul className="job-points">
                {j.points.map((p) => <LineReveal as="li" key={p}>{p}</LineReveal>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
