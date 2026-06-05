export const ID = 'uk.nboughton.obr-db-initiative';

export const Site = {
  Path: '/apps/obr-dragonbane-initiative',
} as const

export const IDs = {
  Root: ID,
  Meta: `${ID}/metadata`,
} as const

export interface InitCard {
  card: number;
  keep: boolean;
}

export interface StatTrack {
  max: number;
  cur: number;
}

export interface InitListItem {
  id: string;
  name: string;
  initiative: InitCard[];
  hp: StatTrack;
  wp: StatTrack;
}
