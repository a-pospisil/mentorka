import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center">
      <div className="page-container py-32">
        <p className="t-label flex items-center gap-3 text-gold-700">
          <span className="node" aria-hidden="true" />
          404
        </p>
        <h1 className="t-h1 mt-6 max-w-[16ch] text-ink-900">Tahle cesta nikam nevede. Ale jiná ano.</h1>
        <Link href="/" className="link-line t-label mt-12 inline-flex text-ink-700">
          Zpět na začátek
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
