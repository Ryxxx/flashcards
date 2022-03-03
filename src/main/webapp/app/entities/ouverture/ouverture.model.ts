import { IUser } from 'app/entities/user/user.model';
import { IVariante } from 'app/entities/variante/variante.model';
import { Couleur } from 'app/entities/enumerations/couleur.model';

export interface IOuverture {
  id?: number;
  nom?: string | null;
  couleur?: Couleur | null;
  userId?: IUser | null;
  ouvertureIds?: IVariante[] | null;
}

export class Ouverture implements IOuverture {
  constructor(
    public id?: number,
    public nom?: string | null,
    public couleur?: Couleur | null,
    public userId?: IUser | null,
    public ouvertureIds?: IVariante[] | null
  ) {}
}

export function getOuvertureIdentifier(ouverture: IOuverture): number | undefined {
  return ouverture.id;
}
