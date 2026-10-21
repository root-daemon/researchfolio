import TLink from "@/components/ui/TLink";
import Prompt from "@/components/text/Prompt";

export default function NotFound() {
  return (
    <main className="detail">
      <Prompt cmd="cd ./this-page" start="arrive" />
      <p className="shell-line--err">bash: cd: ./this-page: No such file or directory</p>
      <h1 className="detail-title">404</h1>
      <TLink href="/" className="btn">[ cd ~ ]</TLink>
    </main>
  );
}
