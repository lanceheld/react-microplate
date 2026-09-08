import { PlateType } from '../@enums/PlateType';
import { type PlateDimensions } from './PlateDimensions';
import { type Well } from './Well';

export interface Plate {
  wells: Well[];
  type: PlateType;
  dimensions: PlateDimensions;
}
