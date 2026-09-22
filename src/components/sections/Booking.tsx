import { bookingEmbedSrc, bookingUrl, hasAnyBooking, site } from "@/config/site";
import { booking as bookingContent } from "@/content/contact";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Rezervace termínu přes plánek schůzek Google Workspace.
 * Zobrazí hlavní plánek (site.booking.primary) – vložený kalendář i odkaz.
 * Odkazy na ostatní délky setkání jsou u jednotlivých karet v ceníku.
 *
 * Dokud není vyplněný žádný plánek, sekce se nevykreslí vůbec – nebo
 * zobrazí návod, když je zapnuté site.booking.showPlaceholder.
 */
export function Booking() {
  const url = bookingUrl();
  const embed = bookingEmbedSrc();

  if (!url) {
    // Placeholder se drží stejného vzoru jako ostatní chybějící údaje.
    if (hasAnyBooking() || !site.booking.showPlaceholder) return null;
    return (
      <Reveal className="todo-block mt-14 p-7 lg:mt-20">
        <span className="todo">TODO: DOPLNIT rezervační kalendář</span>
        <p className="t-small mt-4 max-w-[68ch] text-ink-500">
          V Google Kalendáři účtu <strong className="text-ink-700">vladislava@mentorka.eu</strong>{" "}
          vytvořte tři plánky schůzek – úvodní rozhovor (30 min), první sezení (2 h) a další
          sezení (1 h). Odkazy na rezervační stránky vložte do{" "}
          <code className="text-ink-700">site.booking.schedules</code> v souboru{" "}
          <code className="text-ink-700">src/config/site.ts</code>. Kalendář se pak zobrazí přímo
          zde, karty v ceníku dostanou tlačítko Rezervovat a hlavní tlačítka povedou na rezervaci.
        </p>
      </Reveal>
    );
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
        <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-[1.5rem] border hairline bg-paper-50 p-1 lg:mt-10">
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
