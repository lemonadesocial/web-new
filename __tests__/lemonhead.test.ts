import { expect, it, describe } from 'vitest';
import {
  TraitType,
  FilterType,
  findConflictTraits,
  validateTraits,
  calculateLookHash,
  getFinalTraits,
  type Trait,
} from '../lib/services/lemonhead/core';

describe('Lemonhead core logic', () => {
  describe('TraitType enum', () => {
    it('should have proper trait type values', () => {
      expect(TraitType.background).toBe('background');
      expect(TraitType.body).toBe('body');
      expect(TraitType.footwear).toBe('footwear');
      expect(TraitType.bottom).toBe('bottom');
      expect(TraitType.top).toBe('top');
      expect(TraitType.outfit).toBe('outfit');
      expect(TraitType.mouth).toBe('mouth');
      expect(TraitType.facial_hair).toBe('facial_hair');
      expect(TraitType.hair).toBe('hair');
      expect(TraitType.earrings).toBe('earrings');
      expect(TraitType.headgear).toBe('headgear');
      expect(TraitType.mouthgear).toBe('mouthgear');
      expect(TraitType.eyes).toBe('eyes');
      expect(TraitType.eyewear).toBe('eyewear');
    });
  });

  describe('FilterType enum', () => {
    it('should have proper filter type values', () => {
      expect(FilterType.race).toBe('race');
      expect(FilterType.gender).toBe('gender');
      expect(FilterType.skin_tone).toBe('skin_tone');
      expect(FilterType.color).toBe('color');
      expect(FilterType.size).toBe('size');
    });
  });

  describe('findConflictTraits', () => {
    it('should find conflict when trait types are the same', () => {
      const existingTraits: Trait[] = [{ type: TraitType.eyes, value: 'blue' }];
      const newTrait: Trait = { type: TraitType.eyes, value: 'brown' };

      const conflict = findConflictTraits(existingTraits, newTrait);
      expect(conflict).toEqual([{ type: TraitType.eyes, value: 'blue' }]);
    });

    it('should not find conflict for different trait types', () => {
      const existingTraits: Trait[] = [{ type: TraitType.eyes, value: 'blue' }];
      const newTrait: Trait = { type: TraitType.hair, value: 'brown' };

      const conflict = findConflictTraits(existingTraits, newTrait);
      expect(conflict).toEqual([]);
    });

    it('should find conflict when layers overlap', () => {
      const existingTraits: Trait[] = [{ type: TraitType.top, value: 'tshirt' }];
      const newTrait: Trait = { type: TraitType.outfit, value: 'dress' };

      const conflict = findConflictTraits(existingTraits, newTrait);
      expect(conflict).toEqual([{ type: TraitType.top, value: 'tshirt' }]);
    });

    it('should not find conflict when layers do not overlap', () => {
      const existingTraits: Trait[] = [{ type: TraitType.eyes, value: 'blue' }];
      const newTrait: Trait = { type: TraitType.hair, value: 'brown' };

      const conflict = findConflictTraits(existingTraits, newTrait);
      expect(conflict).toEqual([]);
    });

    it('should not find conflict when body and footwear are used together', () => {
      const existingTraits: Trait[] = [{ type: TraitType.body, value: 'medium' }];
      const newTrait: Trait = { type: TraitType.footwear, value: 'shoes' };

      const conflict = findConflictTraits(existingTraits, newTrait);
      expect(conflict).toEqual([]); // body (layer 20) and footwear (layer 30) don't conflict
    });
  });

  describe('validateTraits', () => {
    it('should validate a complete set of valid traits', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).not.toThrow();
    });

    it('should throw error when required traits are missing', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        // Missing body, hair, and mouth
      ];

      expect(() => validateTraits(traits)).toThrow('Required traits are missing');
    });

    it('should throw error when there is a layer conflict', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.outfit, value: 'dress' }, // Conflicts with top (layer 50)
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).toThrow('Layer conflict detected');
    });

    it('should throw error when outfit is missing but top and bottom are required', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        // Missing bottom
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).toThrow('Top and bottom are required if no outfit is present');
    });

    it('should handle multiple layer conflicts', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.outfit, value: 'dress' }, // Conflicts with both top and bottom
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).toThrow('Layer conflict detected');
    });
  });

  describe('getFinalTraits', () => {
    it('should filter out empty values and sort traits correctly', () => {
      const traits: Trait[] = [
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.mouth, value: 'smile' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.earrings, value: '' }, // Should be filtered out
      ];

      const finalTraits = getFinalTraits(traits);
      
      // Should be sorted by layer order (background: 10, body: 20, mouth: 60, hair: 80, eyes: 130)
      expect(finalTraits).toEqual([
        { type: TraitType.background, value: 'blue', filter: [] },
        { type: TraitType.body, value: 'medium', filter: [] },
        { type: TraitType.mouth, value: 'smile', filter: [] },
        { type: TraitType.hair, value: 'black', filter: [] },
        { type: TraitType.eyes, value: 'brown', filter: [] },
      ]);
    });
  });

  describe('calculateLookHash', () => {
    it('should generate consistent hash for same traits', () => {
      const traits1: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      const traits2: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      const hash1 = calculateLookHash(traits1);
      const hash2 = calculateLookHash(traits2);

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different traits', () => {
      const traits1: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      const traits2: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.eyes, value: 'blue' }, // Different eye color
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      const hash1 = calculateLookHash(traits1);
      const hash2 = calculateLookHash(traits2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Integration tests', () => {
    it('should handle a complete avatar creation workflow', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.outfit, value: 'dress' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).not.toThrow();
      
      const finalTraits = getFinalTraits(traits);
      const hash = calculateLookHash(finalTraits);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.startsWith('0x')).toBe(true);
    });

    it('should detect conflicts in complex scenarios', () => {
      const existingTraits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      // Try to add outfit (conflicts with top and bottom)
      const outfitTrait: Trait = { type: TraitType.outfit, value: 'dress' };
      const conflict = findConflictTraits(existingTraits, outfitTrait);
      expect(conflict).toHaveLength(2); // Should find both top and bottom conflicts
      expect(conflict).toContainEqual({ type: TraitType.top, value: 'tshirt' });
      expect(conflict).toContainEqual({ type: TraitType.bottom, value: 'jeans' });
    });
  });

  describe('Edge cases and error conditions', () => {
    it('should handle complex outfit scenarios', () => {
      // Test with outfit only (should be valid)
      const outfitOnlyTraits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.outfit, value: 'dress' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(outfitOnlyTraits)).not.toThrow();

      // Test with top and bottom only (should be valid)
      const topBottomTraits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(topBottomTraits)).not.toThrow();
    });
  });
});
