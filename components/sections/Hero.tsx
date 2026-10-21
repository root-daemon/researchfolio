"use client";

import { useState } from "react";
import Prompt from "@/components/text/Prompt";
import RotatingWord from "@/components/text/RotatingWord";
import AsciiField from "@/components/webgl/AsciiField";
import TLink from "@/components/ui/TLink";
import { profile } from "@/lib/content";

export default function Hero() {
  // The output only "prints" once the whoami command has finished typing.
  const [out, setOut] = useState(false);
  return (
    <section id="top" className="hero" data-snap>
      <AsciiField className="hero-ascii" />
      <div className="hero-copy">
        <Prompt cmd="whoami" start="arrive" onDone={() => setOut(true)} />
        <div className={`hero-out ${out ? "is-on" : ""}`}>
          <h1 className="hero-title">{profile.short}</h1>
          <p className="hero-sub">{profile.intro}</p>
          <p className="hero-sub">
            Right now I build <RotatingWord words={profile.verbs} />
            <span className="caret" aria-hidden />
          </p>
          <div className="hero-cta">
            <TLink href="/#work" className="btn btn--solid" data-magnetic>[ ls projects ]</TLink>
            <a href={`mailto:${profile.email}`} className="btn" data-magnetic>[ mail me ]</a>
          </div>
        </div>
      </div>
    </section>
  );
}
