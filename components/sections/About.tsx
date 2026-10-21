import LightUpText from "@/components/text/LightUpText";
import SectionHead from "@/components/text/SectionHead";
import Prompt from "@/components/text/Prompt";
import TapeDeck from "@/components/ui/TapeDeck";
import AimTrainer from "@/components/ui/AimTrainer";
import { profile, sysinfo } from "@/lib/content";

// Original block-letter "SV" for the neofetch logo slot.
const LOGO = String.raw`
 ▄█████▄  ██      ██
 ██       ██      ██
 ▀█████▄   ██    ██
      ██    ██  ██
 ▀█████▀     ▀██▀
`.slice(1);

export default function About() {
  return (
    <section id="about" className="section about" data-snap>
      <SectionHead cmd="cat about.txt" title="About" />
      <LightUpText className="about-text" text={profile.about} />

      <Prompt cmd="neofetch" className="block-prompt" />
      <div className="neofetch">
        <pre className="nf-logo" aria-hidden>{LOGO}</pre>
        <div className="nf-info">
          <p className="nf-host"><span className="hl">{profile.user}</span>@<span className="hl">{profile.host}</span></p>
          <p className="nf-rule" aria-hidden>{"-".repeat(profile.user.length + profile.host.length + 1)}</p>
          <dl>
            {sysinfo.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <div className="nf-swatches" aria-hidden>
            {Array.from({ length: 8 }, (_, i) => <span key={i} style={{ opacity: 0.15 + i * 0.12 }} />)}
          </div>
        </div>
      </div>

      <div className="toys">
        <div className="win">
          <div className="win-bar"><span>tape.sh</span><span>music, made live in your browser</span></div>
          <TapeDeck />
        </div>
        <div className="win">
          <div className="win-bar"><span>aim_trainer</span><span>I play shooters, so</span></div>
          <AimTrainer />
        </div>
      </div>
    </section>
  );
}
