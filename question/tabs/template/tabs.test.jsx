import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { Tabs, TabsList, TabsTrigger, TabsContent } from './App';

describe('Tabs Component', () => {
  test('renders all tabs', () => {
    render(<App />);
    expect(screen.getByRole('tab', { name: /account/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /password/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
  });

  test('renders tablist with proper role', () => {
    render(<App />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  test('default tab is selected', () => {
    render(<App />);
    const accountTab = screen.getByRole('tab', { name: /account/i });
    expect(accountTab).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking tab changes selection', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const passwordTab = screen.getByRole('tab', { name: /password/i });
    await user.click(passwordTab);
    
    expect(passwordTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /account/i })).toHaveAttribute('aria-selected', 'false');
  });

  test('clicking tab shows corresponding panel', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Account panel should be visible by default
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Account Settings');
    
    const settingsTab = screen.getByRole('tab', { name: /settings/i });
    await user.click(settingsTab);
    
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings');
  });

  test('right arrow key navigates to next tab', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const accountTab = screen.getByRole('tab', { name: /account/i });
    accountTab.focus();
    
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /password/i })).toHaveFocus();
  });

  test('left arrow key navigates to previous tab', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const passwordTab = screen.getByRole('tab', { name: /password/i });
    passwordTab.focus();
    
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: /account/i })).toHaveFocus();
  });

  test('Home key navigates to first tab', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const settingsTab = screen.getByRole('tab', { name: /settings/i });
    settingsTab.focus();
    
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: /account/i })).toHaveFocus();
  });

  test('End key navigates to last tab', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const accountTab = screen.getByRole('tab', { name: /account/i });
    accountTab.focus();
    
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: /settings/i })).toHaveFocus();
  });

  test('tab moves focus to tabpanel', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const accountTab = screen.getByRole('tab', { name: /account/i });
    accountTab.focus();
    
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  test('aria-controls connects tab to panel', () => {
    render(<App />);
    
    const accountTab = screen.getByRole('tab', { name: /account/i });
    const controlledPanelId = accountTab.getAttribute('aria-controls');
    
    expect(controlledPanelId).toBeTruthy();
    expect(document.getElementById(controlledPanelId)).toHaveRole('tabpanel');
  });

  test('aria-labelledby connects panel to tab', () => {
    render(<App />);
    
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    panels.forEach(panel => {
      const labelledBy = panel.getAttribute('aria-labelledby');
      if (labelledBy) {
        const tab = document.getElementById(labelledBy);
        expect(tab).toHaveRole('tab');
      }
    });
  });

  test('only visible panel has tabindex', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // When account tab is active
    const accountPanel = screen.getByRole('tabpanel');
    expect(accountPanel).toHaveAttribute('tabIndex', '0');
    
    // Click settings tab
    const settingsTab = screen.getByRole('tab', { name: /settings/i });
    await user.click(settingsTab);
    
    // Now settings panel is visible
    const settingsPanel = screen.getByRole('tabpanel');
    expect(settingsPanel).toHaveAttribute('tabIndex', '0');
  });

  test('keyboard wraps around at boundaries', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // At first tab, pressing left should go to last tab
    const accountTab = screen.getByRole('tab', { name: /account/i });
    accountTab.focus();
    
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: /settings/i })).toHaveFocus();
    
    // At last tab, pressing right should go to first tab
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /account/i })).toHaveFocus();
  });
});