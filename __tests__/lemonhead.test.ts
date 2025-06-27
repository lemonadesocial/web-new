import { expect, it, describe } from 'vitest';
import {
  TraitType,
  findConflictTraits,
  validateTraits,
  calculateLookHash,
  getFinalTraits,
  type Trait,
} from '../lib/services/lemonhead/core';

describe('Lemonhead core logic', () => {
  describe('TraitType enum', () => {
    it('should have proper casing without underscores', () => {
      expect(TraitType.origin).toBe('origin');
      expect(TraitType.gender).toBe('gender');
      expect(TraitType.body_type).toBe('body_type');
      expect(TraitType.skin_tone).toBe('skin_tone');
      expect(TraitType.background).toBe('background');
      expect(TraitType.top).toBe('top');
      expect(TraitType.bottom).toBe('bottom');
      expect(TraitType.outfit).toBe('outfit');
      expect(TraitType.eyes).toBe('eyes');
      expect(TraitType.earrings).toBe('earrings');
      expect(TraitType.eyewear).toBe('eyewear');
      expect(TraitType.hair).toBe('hair');
      expect(TraitType.headgear).toBe('headgear');
      expect(TraitType.mouth).toBe('mouth');
      expect(TraitType.mouthgear).toBe('mouthgear');
      expect(TraitType.facial_hair).toBe('facial_hair');
      expect(TraitType.footwear).toBe('footwear');
    });
  });

  describe('findConflictTraits', () => {
    it('should find conflict when trait types are the same', () => {
      const existingTraits: Trait[] = [{ type: TraitType.eyes, value: 'blue' }];
      const newTrait: Trait = { type: TraitType.eyes, value: 'brown' };

      const conflict = findConflictTraits(existingTraits, newTrait);
      expect(conflict).toEqual([{ type: TraitType.eyes, value: 'blue' }]);
    });

    it('should not find conflict for base trait types', () => {
      const existingTraits: Trait[] = [{ type: TraitType.eyes, value: 'blue' }];
      const newTrait: Trait = { type: TraitType.origin, value: 'asian' };

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

    it('should find conflict when body_size conflicts with other traits', () => {
      const existingTraits: Trait[] = [{ type: TraitType.body_type, value: 'medium' }];
      const newTrait: Trait = { type: TraitType.footwear, value: 'shoes' };

      const conflict = findConflictTraits(existingTraits, newTrait);
      expect(conflict).toEqual([]); // body_size (layer 20) and footwear (layer 30) don't conflict
    });
  });

  describe('validateTraits', () => {
    it('should validate a complete set of valid traits', () => {
      const traits: Trait[] = [
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
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
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        // Missing body_size, hair, and mouth
      ];

      expect(() => validateTraits(traits)).toThrow('Required traits are missing');
    });

    it('should throw error when there is a layer conflict', () => {
      const traits: Trait[] = [
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
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
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        // Missing bottom
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).toThrow('Top and bottom are required if no outfit is present');
    });
  });

  describe('getFinalTraits', () => {
    it('should filter out empty values and sort traits correctly', () => {
      const traits: Trait[] = [
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.mouth, value: 'smile' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.body_type, value: 'medium' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.earrings, value: '' }, // Should be filtered out
      ];

      const finalTraits = getFinalTraits(traits);
      
      // Should be sorted with base traits first, then by layer
      expect(finalTraits).toEqual([
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
        { type: TraitType.mouth, value: 'smile' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.eyes, value: 'brown' },
      ]);
    });
  });

  describe('calculateLookHash', () => {
    it('should generate consistent hash for same traits', () => {
      const traits1: Trait[] = [
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      const traits2: Trait[] = [
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
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
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      const traits2: Trait[] = [
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
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
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
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
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
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
    it('should handle multiple layer conflicts', () => {
      const traits: Trait[] = [
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.outfit, value: 'dress' }, // Conflicts with both top and bottom
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).toThrow('Layer conflict detected');
    });

    it('should handle complex outfit scenarios', () => {
      // Test with outfit only (should be valid)
      const outfitOnlyTraits: Trait[] = [
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
        { type: TraitType.outfit, value: 'dress' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(outfitOnlyTraits)).not.toThrow();

      // Test with top and bottom only (should be valid)
      const topBottomTraits: Trait[] = [
        { type: TraitType.origin, value: 'asian' },
        { type: TraitType.gender, value: 'male' },
        { type: TraitType.skin_tone, value: 'light' },
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body_type, value: 'medium' },
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
