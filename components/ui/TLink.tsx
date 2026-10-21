"use client";

import Link from "next/link";
import { useTransitionNavigate } from "@/components/providers/PageTransition";

type Props = React.ComponentProps<typeof Link> & { href: string };

// next/link that routes through the page-transition choreography.
export default function TLink({ href, onClick, ...rest }: Props) {
  const navigate = useTransitionNavigate();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (href.startsWith("http") || href.startsWith("mailto:")) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
}
