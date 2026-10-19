import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {OnboardingForm} from '../src/components/OnboardingForm';

afterEach(cleanup);

async function fillStep1AndNext(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('e.g. University of Mumbai'), 'University of Mumbai');
  await user.type(screen.getByPlaceholderText('e.g. VJTI, DJ Sanghvi'), 'VJTI');
  await user.click(screen.getByRole('button', {name: /next/i}));
}

describe('OnboardingForm', () => {
  it('renders step 1 of 4', async () => {
    render(<OnboardingForm onSubmit={vi.fn()} isSubmitting={false} />);

    expect(await screen.findByText('Skills & Experience')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. University of Mumbai')).toBeInTheDocument();
  });

  it('walks through all four steps and submits the profile', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<OnboardingForm onSubmit={onSubmit} isSubmitting={false} />);

    await fillStep1AndNext(user);
    expect(await screen.findByText('Career Interests')).toBeInTheDocument();
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: /next/i}));
    expect(await screen.findByText('Constraints & Preferences')).toBeInTheDocument();
    expect(screen.getByText('Step 3 of 4')).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: /next/i}));
    expect(await screen.findByText('Ready to Analyze')).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: /generate my career path/i}));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.university).toBe('University of Mumbai');
    expect(submitted.college).toBe('VJTI');
  });

  it('shows a progress state while submitting instead of the generate button', async () => {
    render(<OnboardingForm onSubmit={vi.fn()} isSubmitting={true} />);
    const user = userEvent.setup();

    await fillStep1AndNext(user);
    await user.click(screen.getByRole('button', {name: /next/i}));
    await user.click(screen.getByRole('button', {name: /next/i}));

    expect(await screen.findByText('Ready to Analyze')).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: /processing/i})).toBeDisabled();
    expect(screen.queryByRole('button', {name: /generate my career path/i})).not.toBeInTheDocument();
  });
});
