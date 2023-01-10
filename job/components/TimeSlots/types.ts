import {TimeSlot} from '../../../../types/work-order';

export type RadioTimeSlot = TimeSlot & {isAvailable: boolean};

export enum RadioGroupDisplayTypes {
  ROW = 'row',
  GRID = 'grid',
}
