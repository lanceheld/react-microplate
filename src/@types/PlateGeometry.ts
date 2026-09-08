import { type LabelLocation } from '../@enums/LabelLocation';
import { type PlateDimensions } from './PlateDimensions';

export interface PlateGeometry extends PlateDimensions {
  wellWidth: number;
  wellHeight: number;
  wellGapX: number;
  wellGapY: number;
  platePaddingX: number;
  platePaddingY: number;
  rowLabelLocation: LabelLocation;
  colLabelLocation: LabelLocation;
}
