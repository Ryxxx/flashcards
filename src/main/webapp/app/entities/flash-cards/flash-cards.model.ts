import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IFlashCards {
  id?: number;
  repetitions?: number | null;
  qualite?: number | null;
  facilite?: number | null;
  intervalle?: number | null;
  prochainEntrainement?: dayjs.Dayjs | null;
  userId?: IUser | null;
}

export class FlashCards implements IFlashCards {
  constructor(
    public id?: number,
    public repetitions?: number | null,
    public qualite?: number | null,
    public facilite?: number | null,
    public intervalle?: number | null,
    public prochainEntrainement?: dayjs.Dayjs | null,
    public userId?: IUser | null
  ) {}
}

export function getFlashCardsIdentifier(flashCards: IFlashCards): number | undefined {
  return flashCards.id;
}
