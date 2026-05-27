import { describe, it, expect } from 'vitest';
import { mixColors, colorToHex, hexToColor, isColorClose, colorDistance, getMissions, calculateColorLabScore } from '../logic';

describe('Color Lab Logic', () => {
  describe('mixColors', () => {
    it('mixes red and blue to purple-ish', () => {
      const result = mixColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 });
      expect(result.r).toBe(128);
      expect(result.g).toBe(0);
      expect(result.b).toBe(128);
    });

    it('mixes red and yellow to orange-ish', () => {
      const result = mixColors({ r: 255, g: 0, b: 0 }, { r: 255, g: 255, b: 0 });
      expect(result.r).toBe(255);
      expect(result.g).toBe(128);
      expect(result.b).toBe(0);
    });

    it('mixes same color with itself', () => {
      const color = { r: 100, g: 150, b: 200 };
      const result = mixColors(color, color);
      expect(result.r).toBe(100);
      expect(result.g).toBe(150);
      expect(result.b).toBe(200);
    });
  });

  describe('colorToHex', () => {
    it('converts red', () => {
      expect(colorToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
    });

    it('converts white', () => {
      expect(colorToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
    });

    it('converts black', () => {
      expect(colorToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    });
  });

  describe('hexToColor', () => {
    it('parses red hex', () => {
      const c = hexToColor('#ff0000');
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
    });

    it('parses without hash', () => {
      const c = hexToColor('00ff00');
      expect(c.g).toBe(255);
    });
  });

  describe('isColorClose', () => {
    it('same color is close', () => {
      const c = { r: 100, g: 100, b: 100 };
      expect(isColorClose(c, c, 10)).toBe(true);
    });

    it('slightly different is close with tolerance', () => {
      expect(isColorClose({ r: 100, g: 100, b: 100 }, { r: 105, g: 95, b: 100 }, 10)).toBe(true);
    });

    it('very different is not close', () => {
      expect(isColorClose({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, 10)).toBe(false);
    });
  });

  describe('colorDistance', () => {
    it('same color has distance 0', () => {
      const c = { r: 100, g: 100, b: 100 };
      expect(colorDistance(c, c)).toBe(0);
    });

    it('black to white has max distance', () => {
      const d = colorDistance({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
      expect(d).toBeGreaterThan(400);
    });
  });

  describe('getMissions', () => {
    it('returns identify missions for chick', () => {
      const m = getMissions('chick');
      expect(m.length).toBe(3);
      expect(m[0]?.hint).toContain('Toque');
    });

    it('returns mix missions for explorer', () => {
      const m = getMissions('explorer');
      expect(m.length).toBe(3);
    });
  });

  describe('calculateColorLabScore', () => {
    it('gives 3 stars for completing all missions', () => {
      const result = calculateColorLabScore(3, 3, 5, 30);
      expect(result.stars).toBe(3);
    });

    it('awards color-mixer for 10+ mixes', () => {
      const result = calculateColorLabScore(3, 3, 12, 30);
      expect(result.achievements).toContain('color-mixer');
    });

    it('no color-mixer for few mixes', () => {
      const result = calculateColorLabScore(3, 3, 5, 30);
      expect(result.achievements).not.toContain('color-mixer');
    });
  });
});
