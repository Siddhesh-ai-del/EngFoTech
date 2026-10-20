import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { RoadmapView } from '../src/components/RoadmapView';
import { RoadmapStep } from '../src/types';

const renderRoadmap = (roadmap: RoadmapStep[]) =>
  render(
    <MemoryRouter>
      <RoadmapView roadmap={roadmap} />
    </MemoryRouter>,
  );

afterEach(cleanup);

const step: RoadmapStep = {
  month: 'Month 1',
  milestone: 'Foundations',
  tasks: ['Revise DSA basics'],
  resources: [{ name: 'LeetCode Top 100', url: 'https://example.com', type: 'free' }],
  projects: ['Deploy portfolio v2'],
  proTips: ['Ship small, ship often'],
};

describe('RoadmapView', () => {
  it('renders milestones, tasks, and string projects', () => {
    renderRoadmap([step]);
    expect(screen.getByText('Month 1')).toBeInTheDocument();
    expect(screen.getByText('Revise DSA basics')).toBeInTheDocument();
    expect(screen.getByText('Deploy portfolio v2')).toBeInTheDocument();
    expect(screen.getByText('LeetCode Top 100')).toBeInTheDocument();
  });

  it('survives legacy stored data where projects are objects, not strings', () => {
    // Older/looser saved analyses can carry {title, description} projects.
    // React used to throw "Objects are not valid as a React child" and
    // white-screen the whole route.
    const legacy = {
      ...step,
      projects: [{ title: 'Chat app', description: 'WebSocket based' }],
    } as unknown as RoadmapStep;

    renderRoadmap([legacy]);

    expect(screen.getByText('Chat app')).toBeInTheDocument();
    expect(screen.getByText('WebSocket based')).toBeInTheDocument();
  });
});
