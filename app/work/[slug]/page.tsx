import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LineReveal from "@/components/text/LineReveal";
import Prompt from "@/components/text/Prompt";
import Cover from "@/components/ui/Cover";
import TLink from "@/components/ui/TLink";
import { projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p ? `${p.title} | Srivishal` : "Not found" };
}

export default function ProjectPage(props: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<main className="detail" />}>
      <Project params={props.params} />
    </Suspense>
  );
}

// Laid out like a man page: NAME, SYNOPSIS, DESCRIPTION, SEE ALSO.
async function Project({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const head = `${p.slug.toUpperCase()}(1)`;

  return (
    <main className="detail">
      <Prompt cmd={`man ${p.slug}`} start="arrive" />
      <div className="man-head" aria-hidden>
        <span>{head}</span><span>Projects Manual</span><span>{head}</span>
      </div>
      <LineReveal as="h1" className="detail-title" trigger="arrive">{p.title}</LineReveal>

      <section className="man-sec">
        <h2>NAME</h2>
        <p>{p.slug} - {p.blurb}</p>
      </section>
      <Cover seed={p.slug} className="detail-cover" />
      <section className="man-sec">
        <h2>SYNOPSIS</h2>
        <ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        <p className="man-dim">{p.kind}, {p.year}</p>
      </section>
      <section className="man-sec">
        <h2>DESCRIPTION</h2>
        <ul className="detail-points">
          {p.details.map((d) => <LineReveal as="li" key={d}>{d}</LineReveal>)}
        </ul>
      </section>
      <section className="man-sec">
        <h2>SEE ALSO</h2>
        <a href={p.href} target="_blank" rel="noreferrer" className="btn" data-magnetic>
          [ {p.href.replace("https://", "")} ↗ ]
        </a>
      </section>

      <TLink href={`/work/${next.slug}`} className="next-project" data-cursor="view" data-cursor-label="next">
        <span className="ps1">next: </span>
        <span className="next-title">man {next.slug}</span>
      </TLink>
    </main>
  );
}
