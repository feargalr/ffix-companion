import type {
  Area,
  ChecklistEntry,
  Missability,
  MissableKind,
  SourceId,
  Verification,
} from '../types/game';

/** Entry as written in a data file: areaId and id prefix are filled in for you. */
export type EntryInput = Omit<
  ChecklistEntry,
  'id' | 'areaId' | 'missability' | 'verification' | 'sources'
> & {
  /** Short slug unique within the area; becomes part of the stable ID. */
  slug: string;
  missability?: Missability;
  verification?: Verification;
  sources?: SourceId[];
};

export interface AreaDefaults {
  /** Missability applied to entries that don't specify one. */
  missability: Missability;
  missableKind?: MissableKind;
  lastOpportunity?: string;
  closesWithArea?: string;
  sources?: SourceId[];
}

const BOTH: SourceId[] = ['jegged', 'gamefaqs-bover'];

export function defineArea(
  meta: Omit<Area, 'entries'>,
  defaults: AreaDefaults,
  entries: EntryInput[],
): Area {
  return {
    ...meta,
    entries: entries.map(({ slug, ...e }) => {
      const missability = e.missability ?? defaults.missability;
      const inheritsMissable = e.missability === undefined;
      return {
        ...e,
        id: `d${meta.disc}.${meta.id}.${slug}`,
        areaId: meta.id,
        missability,
        missableKind:
          e.missableKind ?? (inheritsMissable && missability !== 'none' ? defaults.missableKind : undefined),
        lastOpportunity:
          e.lastOpportunity ?? (inheritsMissable && missability !== 'none' ? defaults.lastOpportunity : undefined),
        closesWithArea:
          e.closesWithArea ?? (inheritsMissable && missability !== 'none' ? defaults.closesWithArea : undefined),
        verification: e.verification ?? 'verified',
        sources: e.sources ?? defaults.sources ?? BOTH,
      } satisfies ChecklistEntry;
    }),
  };
}

/** Prefix a short slug with the disc/area so `requires` can reference it. */
export const ref = (disc: number, areaId: string, slug: string) => `d${disc}.${areaId}.${slug}`;
