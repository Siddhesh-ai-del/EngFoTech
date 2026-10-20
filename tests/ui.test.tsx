import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from '../src/components/ui/Button';
import { Card, SectionHeading } from '../src/components/ui/Card';
import { Field } from '../src/components/ui/Field';
import { Tag } from '../src/components/ui/Tag';
import { Spinner } from '../src/components/ui/Spinner';

afterEach(cleanup);

describe('Button', () => {
  it('exposes its label as an accessible name', () => {
    render(<Button>Next</Button>);
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('is a non-submit button by default so it never posts a form by accident', () => {
    render(<Button>Back</Button>);
    expect(screen.getByRole('button', { name: 'Back' })).toHaveAttribute('type', 'button');
  });

  it('marks itself busy, disables, and swaps the label while loading', () => {
    render(
      <Button loading loadingLabel="Processing…">
        Generate My Career Path
      </Button>,
    );
    const button = screen.getByRole('button', { name: /processing/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Generate My Career Path')).not.toBeInTheDocument();
  });

  it('stays disabled when the caller disables it', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});

describe('Field', () => {
  it('gives the control an accessible name via its label', () => {
    render(<Field label="University name">{(p) => <input {...p} className="field" />}</Field>);
    expect(screen.getByLabelText('University name')).toBeInTheDocument();
  });

  it('associates helper text through aria-describedby', () => {
    render(
      <Field label="CGPA" hint="Out of 10">
        {(p) => <input {...p} className="field" />}
      </Field>,
    );
    const input = screen.getByLabelText('CGPA');
    const hint = screen.getByText('Out of 10');
    expect(input).toHaveAttribute('aria-describedby', hint.id);
  });

  it('omits aria-describedby when there is no hint', () => {
    render(<Field label="College name">{(p) => <input {...p} />}</Field>);
    expect(screen.getByLabelText('College name')).not.toHaveAttribute('aria-describedby');
  });
});

describe('Card, SectionHeading, Tag, Spinner', () => {
  it('renders a titled section at the requested heading level', () => {
    render(
      <Card>
        <SectionHeading title="Roadmap" description="Month by month." level={3} />
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Roadmap' })).toBeInTheDocument();
    expect(screen.getByText('Month by month.')).toBeInTheDocument();
  });

  it('renders the action slot next to the heading', () => {
    render(
      <Card>
        <SectionHeading title="Skills" action={<Button variant="ghost">Edit</Button>} />
      </Card>,
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('exposes a tag label', () => {
    render(<Tag tone="green">High priority</Tag>);
    expect(screen.getByText('High priority')).toBeInTheDocument();
  });

  it('hides the spinner from assistive tech', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
