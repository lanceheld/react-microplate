import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';

import { WellComponent } from '../src';
import { Mode } from '../src/@enums/Mode';
import { WellShape } from '../src/@enums/WellShape';

const meta = {
  title: 'WellComponent',
  component: WellComponent,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onPress: { action: 'onPress' },
  },
  decorators: [
    (Story: ComponentType) => (
      <div style={{ width: 50, height: 50, backgroundColor: '#fff' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WellComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Circle: Story = {
  args: {
    well: { index: 0, row: 0, column: 0, name: 'A1' },
    shape: WellShape.Circle,
  },
};

export const Square: Story = {
  args: {
    well: { index: 0, row: 0, column: 0, name: 'A1' },
    shape: WellShape.Square,
  },
};

export const SquareWithCornerRadius: Story = {
  args: {
    well: { index: 0, row: 0, column: 0, name: 'A1' },
    shape: WellShape.Square,
    cornerRadius: 6,
  },
};

export const Custom: Story = {
  args: {
    well: { index: 0, row: 0, column: 0, name: 'A1' },
    shape: WellShape.Custom,
    customShape: <polygon points="16,2 30,30 2,30" />,
  },
};

export const Selected: Story = {
  args: {
    well: { index: 0, row: 0, column: 0, name: 'A1' },
    samples: [{ uuid: 'u1', id: 'S1' }],
    selected: true,
  },
};

export const WithSample: Story = {
  args: {
    well: { index: 0, row: 0, column: 0, name: 'A1' },
    samples: [{ uuid: 'u1', id: 'S1' }],
  },
};

export const WithMultipleSamples: Story = {
  args: {
    well: { index: 0, row: 0, column: 0, name: 'A1' },
    samples: [
      { uuid: 'u1', id: 'S1' },
      { uuid: 'u2', id: 'S2' },
    ],
  },
};

export const DesignMode: Story = {
  args: {
    well: { index: 0, row: 0, column: 0, name: 'A1' },
    mode: Mode.Design,
  },
};
