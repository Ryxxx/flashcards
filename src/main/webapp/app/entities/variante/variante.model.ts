import { IOuverture } from 'app/entities/ouverture/ouverture.model';

export interface IVariante {
  id?: number;
  nom?: string | null;
  coups?: string | null;
  ouverture?: IOuverture | null;
}

export class Variante implements IVariante {
  constructor(public id?: number, public nom?: string | null, public coups?: string | null, public ouverture?: IOuverture | null) {}
}

export function getVarianteIdentifier(variante: IVariante): number | undefined {
  return variante.id;
}
