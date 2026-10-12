import type { CharacterId } from '../types/game';
import { CHARACTER_IMAGES, CHARACTER_NAMES, LOCATION_IMAGES, SQUARE_ENIX_NOTICE, type OfficialImage } from '../data/images';

const url = (img: OfficialImage) => `${import.meta.env.BASE_URL}${img.file}`;

/** A location screenshot from the official FFIX site. */
export function OfficialImg({ imageId, alt, className = '' }: { imageId: string; alt: string; className?: string }) {
  const img = LOCATION_IMAGES[imageId];
  if (!img) return null;
  return (
    <img
      src={url(img)}
      width={img.width}
      height={img.height}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`h-auto ring-1 ring-silver/40 ${className}`}
    />
  );
}

/**
 * Small row of official character renders for the party in this area.
 * Optional recruits are dimmed and labelled so the row never implies they
 * have definitely joined.
 */
export function PartyPortraits({ ids, optional = [] }: { ids: CharacterId[]; optional?: CharacterId[] }) {
  return (
    <ul className="flex items-end gap-1" aria-label="Party">
      {[...ids, ...optional].map((id) => {
        const img = CHARACTER_IMAGES[id];
        const isOptional = optional.includes(id);
        const name = isOptional ? `${CHARACTER_NAMES[id]} (if recruited)` : CHARACTER_NAMES[id];
        return (
          <li
            key={id}
            className={`relative grid h-12 w-10 place-items-end overflow-hidden rounded-md bg-night/40 ${
              isOptional ? 'opacity-60 outline-1 outline-dashed outline-silver/60' : 'ring-1 ring-silver/25'
            }`}
          >
            <img
              src={url(img)}
              width={img.width}
              height={img.height}
              alt={name}
              title={name}
              loading="lazy"
              decoding="async"
              className="h-11 w-auto max-w-none object-contain object-bottom"
            />
            {isOptional && (
              <span aria-hidden="true" className="absolute top-0 right-0 rounded-bl bg-night/80 px-0.5 text-[9px] leading-tight text-ink-2">
                ?
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Copyright notice required on every page that shows official material. */
export function SquareEnixNotice() {
  return (
    <p className="text-center text-[10px] leading-relaxed text-ink-3/80">
      {SQUARE_ENIX_NOTICE.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}
