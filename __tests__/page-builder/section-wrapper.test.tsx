import React from 'react';
import { expect, it, describe } from 'vitest';
import { render } from '@testing-library/react';
import { SectionWrapper } from '$lib/components/features/page-builder/sections/SectionWrapper';

describe('SectionWrapper', () => {
  it('renders children', () => {
    const { getByText } = render(
      <SectionWrapper>
        <p>Test content</p>
      </SectionWrapper>,
    );

    expect(getByText('Test content')).toBeDefined();
  });

  describe('width classes', () => {
    it('applies "full" width class', () => {
      const { container } = render(
        <SectionWrapper width="full">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('w-full');
      expect(section.className).not.toContain('max-w-5xl');
      expect(section.className).not.toContain('max-w-2xl');
    });

    it('applies "contained" width class', () => {
      const { container } = render(
        <SectionWrapper width="contained">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('max-w-5xl');
      expect(section.className).toContain('mx-auto');
    });

    it('applies "narrow" width class', () => {
      const { container } = render(
        <SectionWrapper width="narrow">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('max-w-2xl');
      expect(section.className).toContain('mx-auto');
    });
  });

  describe('padding classes', () => {
    it('applies "none" padding class (no padding classes)', () => {
      const { container } = render(
        <SectionWrapper padding="none">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).not.toContain('px-');
      expect(section.className).not.toContain('py-');
    });

    it('applies "sm" padding class', () => {
      const { container } = render(
        <SectionWrapper padding="sm">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('px-4');
      expect(section.className).toContain('py-4');
    });

    it('applies "md" padding class', () => {
      const { container } = render(
        <SectionWrapper padding="md">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('px-6');
      expect(section.className).toContain('py-8');
    });

    it('applies "lg" padding class', () => {
      const { container } = render(
        <SectionWrapper padding="lg">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('px-8');
      expect(section.className).toContain('py-12');
    });

    it('applies "xl" padding class', () => {
      const { container } = render(
        <SectionWrapper padding="xl">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('px-10');
      expect(section.className).toContain('py-16');
    });
  });

  describe('alignment classes', () => {
    it('applies "left" alignment class', () => {
      const { container } = render(
        <SectionWrapper alignment="left">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('text-left');
    });

    it('applies "center" alignment class', () => {
      const { container } = render(
        <SectionWrapper alignment="center">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('text-center');
    });

    it('applies "right" alignment class', () => {
      const { container } = render(
        <SectionWrapper alignment="right">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).toContain('text-right');
    });

    it('does not apply alignment class when alignment is undefined', () => {
      const { container } = render(
        <SectionWrapper>
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.className).not.toContain('text-left');
      expect(section.className).not.toContain('text-center');
      expect(section.className).not.toContain('text-right');
    });
  });

  describe('background styles', () => {
    it('applies background color style', () => {
      const { container } = render(
        <SectionWrapper background={{ type: 'color', value: '#ff0000' }}>
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    it('applies background image style', () => {
      const { container } = render(
        <SectionWrapper background={{ type: 'image', value: 'https://example.com/bg.jpg' }}>
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.style.backgroundImage).toBe('url(https://example.com/bg.jpg)');
      expect(section.style.backgroundSize).toBe('cover');
      expect(section.style.backgroundPosition).toBe('center');
    });

    it('applies gradient background style (does not set color/image props)', () => {
      const gradient = 'linear-gradient(90deg, #ff0000, #0000ff)';
      const { container } = render(
        <SectionWrapper background={{ type: 'gradient', value: gradient }}>
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      // jsdom does not support CSS gradient values on the `background` shorthand,
      // so the property is silently dropped. We verify the component does NOT
      // set backgroundColor or backgroundImage for gradient types, which would be
      // incorrect behavior.
      expect(section.style.backgroundColor).toBe('');
      expect(section.style.backgroundImage).toBe('');
    });
  });

  describe('min_height style', () => {
    it('applies min_height style', () => {
      const { container } = render(
        <SectionWrapper min_height="500px">
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.style.minHeight).toBe('500px');
    });

    it('does not set min_height when not provided', () => {
      const { container } = render(
        <SectionWrapper>
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      expect(section.style.minHeight).toBe('');
    });
  });

  describe('defaults', () => {
    it('default width is "contained" and default padding is "md"', () => {
      const { container } = render(
        <SectionWrapper>
          <p>Content</p>
        </SectionWrapper>,
      );

      const section = container.querySelector('section')!;
      // contained: 'w-full max-w-5xl mx-auto'
      expect(section.className).toContain('max-w-5xl');
      expect(section.className).toContain('mx-auto');
      // md: 'px-6 py-8'
      expect(section.className).toContain('px-6');
      expect(section.className).toContain('py-8');
    });
  });
});
