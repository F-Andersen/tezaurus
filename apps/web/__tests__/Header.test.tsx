import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/ua'),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children);
  MockLink.displayName = 'Link';
  return MockLink;
});

import { Header } from '@/components/Header';

const mockSettings = {
  phones: ['+380 99 123 45 67'],
  messengers: { Telegram: 'https://t.me/tezaurustour' },
};

describe('Header', () => {
  it('renders brand name', () => {
    render(<Header lang="ua" settings={mockSettings} />);
    expect(screen.getByText('TEZAURUS·TOUR')).toBeInTheDocument();
  });

  it('renders navigation links in UA', () => {
    render(<Header lang="ua" settings={mockSettings} />);
    expect(screen.getByText('Послуги')).toBeInTheDocument();
    expect(screen.getByText('Клініки')).toBeInTheDocument();
    expect(screen.getByText('Блог')).toBeInTheDocument();
    expect(screen.getByText('Контакти')).toBeInTheDocument();
  });

  it('renders navigation links in EN', () => {
    render(<Header lang="en" settings={mockSettings} />);
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Clinics')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contacts')).toBeInTheDocument();
  });

  it('renders language switcher', () => {
    render(<Header lang="ua" settings={mockSettings} />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/ua');
    expect(hrefs).toContain('/en');
  });

  it('renders CTA button with correct text UA', () => {
    render(<Header lang="ua" settings={mockSettings} />);
    expect(screen.getByText('Консультація')).toBeInTheDocument();
  });

  it('renders CTA button with correct text EN', () => {
    render(<Header lang="en" settings={mockSettings} />);
    expect(screen.getByText('Consultation')).toBeInTheDocument();
  });

  it('nav links point to correct lang routes', () => {
    render(<Header lang="en" settings={mockSettings} />);
    const servicesLink = screen.getByRole('link', { name: 'Services' });
    expect(servicesLink).toHaveAttribute('href', '/en/services');
  });

  describe('mobile responsive', () => {
    it('desktop nav should NOT have inline display style', () => {
      render(<Header lang="ua" settings={mockSettings} />);
      const nav = screen.getByRole('navigation');
      expect(nav.style.display).toBe('');
    });

    it('desktop nav must have hidden md:flex classes', () => {
      render(<Header lang="ua" settings={mockSettings} />);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('hidden');
      expect(nav.className).toContain('md:flex');
    });

    it('burger button exists for mobile', () => {
      render(<Header lang="ua" settings={mockSettings} />);
      const burger = screen.getByLabelText('Menu');
      expect(burger).toBeInTheDocument();
    });
  });
});
