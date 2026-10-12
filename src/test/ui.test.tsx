import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { progressStore, STORAGE_KEY } from '../lib/progress';
import App from '../App';

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [false, () => {}],
    offlineReady: [false, () => {}],
    updateServiceWorker: async () => {},
  }),
}));

// jsdom has no layout engine.
Element.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

async function go(hash: string) {
  await act(async () => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

beforeEach(async () => {
  localStorage.clear();
  progressStore.reset();
  // Most tests jump straight to later areas; spoiler gating has its own test.
  progressStore.updateSettings({ spoilers: 'all' });
  await go('#/');
});

describe('app', () => {
  it('shows the Journey dashboard with Disc 1 areas', () => {
    render(<App />);
    expect(screen.getByText('Adventure Companion')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Begin Adventure/ })).toHaveAttribute('href', '#/area/prima-vista-heist');
    expect(screen.getAllByText('Evil Forest').length).toBeGreaterThan(0);
  });

  it('ticks an entry, updates the area count and persists it', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go('#/area/cargo-ship');
    expect(screen.getByText('0 / 3')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'Silver Gloves (steal)' }));
    expect(screen.getByRole('checkbox', { name: 'Silver Gloves (steal)' })).toBeChecked();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).completed).toHaveProperty('d1.cargo-ship.steal-silver-gloves');

    await user.click(screen.getByRole('checkbox', { name: 'Silver Gloves (steal)' }));
    expect(screen.getByText('0 / 3')).toBeInTheDocument();
  });

  it('expands an entry to show details', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go('#/area/cargo-ship');
    const toggle = screen.getByRole('button', { name: /Silver Gloves \(steal\)/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/A pair sits on the bench/)).toBeInTheDocument();
  });

  it('updates the Before You Leave warning as missables are completed', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go('#/area/ice-cavern');
    const panel = screen.getByRole('region', { name: 'Before You Leave' });
    expect(within(panel).getByText('1 missable opportunity remaining')).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'Mythril Dagger (steal)' }));
    expect(within(panel).getByText(/clear to move on/)).toBeInTheDocument();
    // Ordinary pickups are still there, just folded away.
    expect(within(panel).getByRole('button', { name: /lower-priority item/ })).toBeInTheDocument();
  });

  it('shows the Chocograph log with separate dug/found ticks', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go('#/progress');
    const dug = screen.getByRole('checkbox', { name: '#11 Small Beach: dug up' });
    await user.click(dug);
    expect(dug).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '#11 Small Beach: treasure found' })).not.toBeChecked();
    expect(screen.getByText(/Needs Reef/)).toBeInTheDocument();
  });

  it('shows party portraits and the Square Enix notice', async () => {
    render(<App />);
    await go('#/area/dali');
    expect(screen.getByRole('img', { name: 'Vivi' })).toHaveAttribute('loading', 'lazy');
    expect(screen.getByText(/© 2000, 2019 SQUARE ENIX CO., LTD./)).toBeInTheDocument();
  });

  it('navigates between areas and remembers the last one', async () => {
    render(<App />);
    await go('#/area/cargo-ship');
    expect(screen.getByRole('heading', { level: 1, name: 'Cargo Ship' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Next area' })).toHaveAttribute('href', '#/area/lindblum');
    expect(screen.getByRole('link', { name: 'Previous area' })).toHaveAttribute('href', '#/area/dali');
    expect(progressStore.getState().lastAreaId).toBe('cargo-ship');

    await go('#/');
    expect(screen.getByRole('link', { name: /Continue Adventure/ })).toHaveAttribute('href', '#/area/cargo-ship');
  });

  it('hides completed entries when "show incomplete only" is on', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go('#/area/cargo-ship');
    await user.click(screen.getByRole('checkbox', { name: 'Steepled Hat (steal)' }));
    await user.click(screen.getByRole('switch', { name: /incomplete only/ }));
    expect(screen.queryByRole('checkbox', { name: 'Steepled Hat (steal)' })).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Linen Cuirass (steal)' })).toBeInTheDocument();
  });

  it('gates far-ahead areas behind a spoiler screen but still lets you in', async () => {
    const user = userEvent.setup();
    progressStore.updateSettings({ spoilers: 'safe' });
    render(<App />);
    await go('#/area/burmecia');
    expect(screen.getByText(/further ahead than you/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Show anyway/ }));
    expect(screen.getByRole('region', { name: 'Treasure & Items' })).toBeInTheDocument();
  });

  it('jumps from a search deep link to the entry', async () => {
    render(<App />);
    await go('#/area/dali?entry=d1.dali.aries-stellazzio');
    const toggle = screen.getByRole('button', { name: /Aries \(Stellazzio coin\)/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('searches from the search page', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go('#/search');
    await user.type(screen.getByRole('searchbox'), 'moonstone');
    expect(await screen.findByText(/Sword fight: impress all 100 nobles/)).toBeInTheDocument();
  });
});
