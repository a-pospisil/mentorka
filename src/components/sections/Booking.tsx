import { bookingEmbedSrc, bookingUrl, isTodo, site } from "@/config/site";
import { booking as bookingContent } from "@/content/contact";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Rezervace termínu přes plánek schůzek Google Workspace.
 * – odkaz vyplněný + embed zapnutý → vložený rezervační kalendář
 * – odkaz vyplněný, embed vypnutý  → tlačítko na rezervační stránku
 * – odkaz nevyplněný               → nápověda, kde odkaz doplnit
 */
export function Booking() {
  const url = bookingUrl();
  const embed = bookingEmbedSrc();

  if (!url) {
    // Placeholder se drží stejného vzoru jako ostatní chybějící údaje.
    return isTodo(site.booking.url) ? (
      <Reveal className="todo-block mt-14 p-7 lg:mt-20">
        <span className="todo">TODO: DOPLNIT rezervační kalendář</span>
        <p className="t-small mt-4 max-w-[62ch] text-ink-500">
          V Google Kalendáři vytvořte „Plánek schůzek“, zkopírujte odkaz na rezervační
          stránku a vložte ho do <code className="text-ink-700">site.booking.url</code> v souboru{" "}
          <code className="text-ink-700">src/config/site.ts</code>. Kalendář se pak zobrazí
          přímo zde a hlavní tlačítka povedou na rezervaci.
        </p>
      </Reveal>
    ) : null;
  }

  return (
    <div className="mt-14 border-t hairline pt-12 lg:mt-20 lg:pt-16">
      <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <h3 className="t-label text-ink-500">{bookingContent.label}</h3>
          <p className="t-lead mt-4 max-w-[34ch] text-ink-800">{bookingContent.text}</p>
        </div>
        <MagneticButton
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm"
        >
          {bookingContent.openLabel}
          <Arrow className="h-3 w-3" />
        </MagneticButton>
      </Reveal>

      {embed ? (
        <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-[1.5rem] bg-paper-50 p-1 hairline border lg:mt-10">
          <iframe
            src={embed}
            title={bookingContent.iframeTitle}
            loading="lazy"
            className="h-[42rem] w-full rounded-[1.25rem] border-0"
          />
        </Reveal>
      ) : null}
    </div>
  );
}
