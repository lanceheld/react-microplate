import { Tooltip } from '@mui/material';
import { usePress } from '@react-aria/interactions';
import { join, map } from 'lodash/fp';
import { useId, useState, type ReactElement, type SVGProps } from 'react';

import { Mode } from '../@enums/Mode';
import { WellShape } from '../@enums/WellShape';
import { type Sample } from '../@types/Sample';
import { type Well } from '../@types/Well';

interface WellComponentBaseProps {
  well: Well;
  samples?: Sample[];
  selected?: boolean;
  mode?: Mode;
  onPress?: (well: Well, samples: Sample[]) => void;
}

export type WellComponentProps = WellComponentBaseProps &
  (
    | { shape?: WellShape.Circle; customShape?: never; cornerRadius?: never }
    | { shape: WellShape.Square; customShape?: never; cornerRadius?: number }
    | { shape: WellShape.Custom; customShape: ReactElement<SVGProps<SVGElement>>; cornerRadius?: never }
  );

const VIEWBOX_SIZE = 32;
const CENTER = VIEWBOX_SIZE / 2;
const RADIUS = VIEWBOX_SIZE / 2 - 1;
const SQUARE_INSET = 1;
const STROKE_WIDTH = 2;
const STROKE_COLOR = '#CBCBCB';
const GLOW_COLOR = '#70B7FF';
const FILL = 'transparent';
const TOOLTIP_BACKGROUND = '#fff';
const TOOLTIP_TEXT_COLOR = '#000';
const TOOLTIP_SHADOW = '0 2px 8px rgba(0, 0, 0, 0.3)';

export const WellComponent = ({
  well,
  samples = [],
  selected = false,
  shape = WellShape.Circle,
  customShape,
  cornerRadius,
  mode = Mode.Display,
  onPress,
}: WellComponentProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { index, row, column, name } = well;
  const hasSamples = samples.length > 0;
  const canInteract = hasSamples || mode === Mode.Design;
  const highlighted = isHovered || selected;
  const outsideMaskId = `well-outside-${useId().replace(/:/g, '')}`;
  const { pressProps } = usePress({
    onPress: () => onPress?.(well, samples),
    isDisabled: !canInteract,
  });

  const geometry =
    shape === WellShape.Circle ? (
      <circle cx={CENTER} cy={CENTER} r={RADIUS} />
    ) : shape === WellShape.Square ? (
      <rect
        x={SQUARE_INSET}
        y={SQUARE_INSET}
        width={VIEWBOX_SIZE - SQUARE_INSET * 2}
        height={VIEWBOX_SIZE - SQUARE_INSET * 2}
        rx={cornerRadius}
        ry={cornerRadius}
      />
    ) : (
      customShape
    );

  return (
    <Tooltip
      title={
        <>
          <strong>{name}:</strong> {join(', ', map('id', samples))}
        </>
      }
      open={hasSamples && isHovered}
      arrow
      placement="right"
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: TOOLTIP_BACKGROUND,
            color: TOOLTIP_TEXT_COLOR,
            boxShadow: TOOLTIP_SHADOW,
          },
        },
        arrow: {
          sx: {
            color: TOOLTIP_BACKGROUND,
          },
        },
      }}
    >
      <button
        type="button"
        role="gridcell"
        disabled={!canInteract}
        aria-selected={canInteract && selected}
        aria-label={name}
        data-index={index}
        data-row={row}
        data-column={column}
        {...pressProps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          padding: 0,
          margin: 0,
          border: 'none',
          background: 'inherit',
          cursor: canInteract && isHovered ? 'pointer' : 'default',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
          aria-hidden="true"
          style={{ overflow: 'visible' }}
        >
          {geometry && canInteract && highlighted && (
            <>
              {/* Masks out the shape's own silhouette (masks composite per-shape by luminance,
                  unlike clipPath which unions sibling shapes instead of subtracting them), so
                  only the portion of the glow stroke outside the shape remains visible. */}
              <defs>
                <mask
                  id={outsideMaskId}
                  maskUnits="userSpaceOnUse"
                  x={-VIEWBOX_SIZE}
                  y={-VIEWBOX_SIZE}
                  width={VIEWBOX_SIZE * 3}
                  height={VIEWBOX_SIZE * 3}
                >
                  <rect
                    x={-VIEWBOX_SIZE}
                    y={-VIEWBOX_SIZE}
                    width={VIEWBOX_SIZE * 3}
                    height={VIEWBOX_SIZE * 3}
                    fill="#fff"
                  />
                  <g fill="#000">{geometry}</g>
                </mask>
              </defs>
              {/* A stroke 3x as thick as the real one, centered on the same outline, masked to
                  its outside half — leaving a ring exactly one stroke-width thick just outside
                  the shape. */}
              <g
                fill="none"
                stroke={GLOW_COLOR}
                strokeWidth={STROKE_WIDTH * 3}
                mask={`url(#${outsideMaskId})`}
                data-testid="well-glow"
              >
                {geometry}
              </g>
            </>
          )}
          <g fill={FILL} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH}>
            {geometry}
          </g>
        </svg>
      </button>
    </Tooltip>
  );
};
