import Prompt from "@/components/text/Prompt";
import Scramble from "@/components/text/Scramble";

// Every section opens the same way: the command that "prints" it, then a big title.
export default function SectionHead({ cmd, title, path }: { cmd: string; title: string; path?: string }) {
  return (
    <div className="section-head">
      <Prompt cmd={cmd} path={path} />
      <Scramble as="h2" className="section-title" text={title} />
    </div>
  );
}
