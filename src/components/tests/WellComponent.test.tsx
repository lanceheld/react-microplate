import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Mode } from '../../@enums/Mode';
import { WellShape } from '../../@enums/WellShape';
import { WellComponent } from '../WellComponent';

describe('WellComponent', () => {
  it('renders the well with an accessible name', () => {
    render(<WellComponent well={{ index: 0, row: 0, column: 0, name: 'A1' }} />);

    expect(screen.getByRole('gridcell', { name: 'A1' })).toBeInTheDocument();
  });

  it('renders a circle by default', () => {
    const { container } = render(<WellComponent well={{ index: 0, row: 0, column: 0, name: 'A1' }} />);

    expect(container.querySelector('circle')).toBeInTheDocument();
    expect(container.querySelector('rect')).not.toBeInTheDocument();
  });

  it('renders a square when shape is "square"', () => {
    const { container } = render(
      <WellComponent well={{ index: 0, row: 0, column: 0, name: 'A1' }} shape={WellShape.Square} />,
    );

    expect(container.querySelector('rect')).toBeInTheDocument();
    expect(container.querySelector('circle')).not.toBeInTheDocument();
  });

  it('applies cornerRadius to a square shape', () => {
    const { container } = render(
      <WellComponent
        well={{ index: 0, row: 0, column: 0, name: 'A1' }}
        shape={WellShape.Square}
        cornerRadius={4}
      />,
    );

    expect(container.querySelector('rect')).toHaveAttribute('rx', '4');
    expect(container.querySelector('rect')).toHaveAttribute('ry', '4');
  });

  it('renders the provided customShape when shape is "custom"', () => {
    const { container } = render(
      <WellComponent
        well={{ index: 0, row: 0, column: 0, name: 'A1' }}
        shape={WellShape.Custom}
        customShape={<polygon points="16,2 30,30 2,30" data-testid="custom-shape" />}
      />,
    );

    expect(screen.getByTestId('custom-shape')).toBeInTheDocument();
    expect(container.querySelector('circle')).not.toBeInTheDocument();
    expect(container.querySelector('rect')).not.toBeInTheDocument();
  });

  it('reflects the selected state', () => {
    render(
      <WellComponent well={{ index: 0, row: 0, column: 0, name: 'A1' }} samples={[{ uuid: 'u1', id: 'S1' }]} selected />,
    );

    expect(screen.getByRole('gridcell', { name: 'A1' })).toHaveAttribute('aria-selected', 'true');
  });

  it('ignores selected and onPress when there is no sample', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    render(<WellComponent well={{ index: 0, row: 0, column: 0, name: 'A1' }} selected onPress={onPress} />);
    const button = screen.getByRole('gridcell', { name: 'A1' });

    expect(button).toHaveAttribute('aria-selected', 'false');
    expect(button).toBeDisabled();

    await user.click(button);

    expect(onPress).not.toHaveBeenCalled();
  });

  it('calls onPress with the well and samples when pressed', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const well = { index: 0, row: 0, column: 0, name: 'A1' };
    const samples = [{ uuid: 'u1', id: 'S1' }];
    render(<WellComponent well={well} samples={samples} onPress={onPress} />);

    await user.click(screen.getByRole('gridcell', { name: 'A1' }));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(well, samples);
  });

  it('shows a pointer cursor and an outward-only glow while hovered', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WellComponent well={{ index: 0, row: 0, column: 0, name: 'A1' }} samples={[{ uuid: 'u1', id: 'S1' }]} />,
    );
    const button = screen.getByRole('gridcell', { name: 'A1' });

    expect(button).toHaveStyle({ cursor: 'default' });
    expect(container.querySelector('[data-testid="well-glow"]')).not.toBeInTheDocument();

    await user.hover(button);

    expect(button).toHaveStyle({ cursor: 'pointer' });
    const glow = container.querySelector('[data-testid="well-glow"]');
    expect(glow).toBeInTheDocument();
    expect(glow?.tagName).toBe('g');
    expect(glow).toHaveAttribute('fill', 'none');
    expect(glow).toHaveAttribute('stroke', '#70B7FF');
    expect(glow?.querySelector('circle')).toBeInTheDocument();

    await user.unhover(button);

    expect(button).toHaveStyle({ cursor: 'default' });
    expect(container.querySelector('[data-testid="well-glow"]')).not.toBeInTheDocument();
  });

  it('renders the glow behind a square shape when hovered', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WellComponent
        well={{ index: 0, row: 0, column: 0, name: 'A1' }}
        samples={[{ uuid: 'u1', id: 'S1' }]}
        shape={WellShape.Square}
      />,
    );
    const button = screen.getByRole('gridcell', { name: 'A1' });

    await user.hover(button);

    const glow = container.querySelector('[data-testid="well-glow"]');
    expect(glow?.tagName).toBe('g');
    expect(glow?.querySelector('rect')).toBeInTheDocument();
  });

  it('renders the same kind of glow around a custom shape when hovered', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WellComponent
        well={{ index: 0, row: 0, column: 0, name: 'A1' }}
        samples={[{ uuid: 'u1', id: 'S1' }]}
        shape={WellShape.Custom}
        customShape={<polygon points="16,2 30,30 2,30" />}
      />,
    );
    const button = screen.getByRole('gridcell', { name: 'A1' });

    expect(container.querySelector('[data-testid="well-glow"]')).not.toBeInTheDocument();

    await user.hover(button);

    const glow = container.querySelector('[data-testid="well-glow"]');
    expect(glow).toBeInTheDocument();
    expect(glow?.tagName).toBe('g');
    expect(glow).toHaveAttribute('fill', 'none');
    expect(glow).toHaveAttribute('stroke', '#70B7FF');
    expect(glow?.querySelector('polygon')).toBeInTheDocument();
  });

  it('shows a tooltip with the bolded well name and sample id while hovered', async () => {
    const user = userEvent.setup();
    render(<WellComponent well={{ index: 0, row: 0, column: 0, name: 'A1' }} samples={[{ uuid: 'u1', id: 'S1' }]} />);
    const button = screen.getByRole('gridcell', { name: 'A1' });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(button);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('A1: S1');
    expect(tooltip.querySelector('strong')).toHaveTextContent('A1:');
  });

  it('shows a tooltip listing every sample id when the well holds multiple samples', async () => {
    const user = userEvent.setup();
    render(
      <WellComponent
        well={{ index: 0, row: 0, column: 0, name: 'A1' }}
        samples={[
          { uuid: 'u1', id: 'S1' },
          { uuid: 'u2', id: 'S2' },
        ]}
      />,
    );
    const button = screen.getByRole('gridcell', { name: 'A1' });

    await user.hover(button);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('A1: S1, S2');
  });

  it('allows selection and hover in design mode even without a sample', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const well = { index: 0, row: 0, column: 0, name: 'A1' };
    const { container } = render(<WellComponent well={well} mode={Mode.Design} selected onPress={onPress} />);
    const button = screen.getByRole('gridcell', { name: 'A1' });

    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-selected', 'true');

    await user.click(button);
    expect(onPress).toHaveBeenCalledWith(well, []);

    await user.hover(button);
    expect(button).toHaveStyle({ cursor: 'pointer' });
    expect(container.querySelector('[data-testid="well-glow"]')).toBeInTheDocument();
  });

  it('still disables the well without a sample in display mode', () => {
    render(<WellComponent well={{ index: 0, row: 0, column: 0, name: 'A1' }} mode={Mode.Display} selected />);

    expect(screen.getByRole('gridcell', { name: 'A1' })).toBeDisabled();
  });
});
