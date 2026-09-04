import type { Meta, StoryObj } from '@storybook/react-vite';
import { Microplate } from '../src';

const meta = {
  title: 'Microplate',
  component: Microplate,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Microplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
