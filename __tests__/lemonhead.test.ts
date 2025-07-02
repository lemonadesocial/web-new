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
      expect(TraitType.necklace).toBe('necklace');
      expect(TraitType.bowtie).toBe('bowtie');
      expect(TraitType.mouthgear).toBe('mouthgear');
      expect(TraitType.eyes).toBe('eyes');
      expect(TraitType.eyewear).toBe('eyewear');
      expect(TraitType.pet).toBe('pet');
      expect(TraitType.instrument).toBe('instrument');
    });
  });

  describe('FilterType enum', () => {
    it('should have proper filter type values', () => {
      expect(FilterType.race).toBe('race');
      expect(FilterType.gender).toBe('gender');
      expect(FilterType.skin_tone).toBe('skin_tone');
      expect(FilterType.color).toBe('color');
      expect(FilterType.size).toBe('size');
      expect(FilterType.art_style).toBe('art_style');
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

    it('should find conflict when layers are mutually exclusive', () => {
      const existingTraits: Trait[] = [{ type: TraitType.top, value: 'tshirt' }];
      const newTrait: Trait = { type: TraitType.outfit, value: 'dress' };

      const conflict = findConflictTraits(existingTraits, newTrait);
      expect(conflict).toEqual([{ type: TraitType.top, value: 'tshirt' }]);
    });

    it('should find conflict when necklace and bowtie are used together', () => {
      const existingTraits: Trait[] = [{ type: TraitType.necklace, value: 'gold' }];
      const newTrait: Trait = { type: TraitType.bowtie, value: 'red' };

      const conflict = findConflictTraits(existingTraits, newTrait);
      expect(conflict).toEqual([{ type: TraitType.necklace, value: 'gold' }]);
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
      expect(conflict).toEqual([]); // body and footwear don't conflict
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
        { type: TraitType.outfit, value: 'dress' }, // Conflicts with top
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

    it('should throw error when alien body has eyes, mouth, or hair', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'alien', filters: [{ type: FilterType.race, value: 'alien' }] },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' }, // Alien shouldn't have eyes
        { type: TraitType.hair, value: 'black' }, // Alien shouldn't have hair
        { type: TraitType.mouth, value: 'smile' }, // Alien shouldn't have mouth
      ];

      expect(() => validateTraits(traits)).toThrow('Alien cannot have eyes, mouth, or hair');
    });

    it('should require eyes, mouth, and hair for non-alien bodies', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        // Missing eyes, hair, and mouth
      ];

      expect(() => validateTraits(traits)).toThrow('Eyes, mouth, and hair are required');
    });

    it('should throw error for duplicated filters', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        {
          type: TraitType.body,
          value: 'medium',
          filters: [
            { type: FilterType.gender, value: 'male' },
            { type: FilterType.gender, value: 'female' }, // Duplicate filter type
          ],
        },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).toThrow('Duplicated filter detected');
    });

    it('should throw error for inconsistent gender across traits', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium', filters: [{ type: FilterType.gender, value: 'male' }] },
        { type: TraitType.top, value: 'tshirt', filters: [{ type: FilterType.gender, value: 'female' }] }, // Different gender
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).toThrow('Gender and size must be consistent between traits');
    });

    it('should throw error for inconsistent size across traits', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium', filters: [{ type: FilterType.size, value: 'medium' }] },
        { type: TraitType.top, value: 'tshirt', filters: [{ type: FilterType.size, value: 'large' }] }, // Different size
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).toThrow('Gender and size must be consistent between traits');
    });

    it('should throw error for invalid trait type', () => {
      const traits: Trait[] = [
        { type: 'invalid' as TraitType, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(traits)).toThrow('Invalid trait type');
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

      // Should be sorted by TraitType enum order
      expect(finalTraits).toEqual([
        { type: TraitType.background, value: 'blue', filters: [] },
        { type: TraitType.body, value: 'medium', filters: [] },
        { type: TraitType.mouth, value: 'smile', filters: [] },
        { type: TraitType.hair, value: 'black', filters: [] },
        { type: TraitType.eyes, value: 'brown', filters: [] },
      ]);
    });

    it('should include filters for traits that have them', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        {
          type: TraitType.body,
          value: 'medium',
          filters: [
            { type: FilterType.gender, value: 'male' },
            { type: FilterType.size, value: 'medium' },
          ],
        },
        {
          type: TraitType.top,
          value: 'tshirt',
          filters: [
            { type: FilterType.gender, value: 'male' },
            { type: FilterType.size, value: 'medium' },
          ],
        },
        {
          type: TraitType.bottom,
          value: 'jeans',
          filters: [
            { type: FilterType.gender, value: 'male' },
            { type: FilterType.size, value: 'medium' },
          ],
        },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      const finalTraits = getFinalTraits(traits);

      expect(finalTraits[0]).toEqual({ type: TraitType.background, value: 'blue', filters: [] });
      expect(finalTraits[1]).toEqual({
        type: TraitType.body,
        value: 'medium',
        filters: [
          { type: FilterType.gender, value: 'male' },
          { type: FilterType.size, value: 'medium' },
        ].sort((a, b) => a.type.localeCompare(b.type)),
      });
    });

    it('should only include filters that are valid for the trait type', () => {
      const traits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        {
          type: TraitType.body,
          value: 'medium',
          filters: [
            { type: FilterType.gender, value: 'male' },
            { type: FilterType.size, value: 'medium' },
            { type: FilterType.color, value: 'blue' }, // Invalid filter for body
          ],
        },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      const finalTraits = getFinalTraits(traits);

      expect(finalTraits[1]).toEqual({
        type: TraitType.body,
        value: 'medium',
        filters: [
          { type: FilterType.gender, value: 'male' },
          { type: FilterType.size, value: 'medium' },
        ].sort((a, b) => a.type.localeCompare(b.type)),
      });
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

    it('should generate different hashes for different filters', () => {
      const traits1: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium', filters: [{ type: FilterType.gender, value: 'male' }] },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      const traits2: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium', filters: [{ type: FilterType.gender, value: 'female' }] },
        { type: TraitType.eyes, value: 'brown' },
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
      expect(conflict).toHaveLength(2); // Should find only top and bottom conflicts
      expect(conflict).toContainEqual({ type: TraitType.top, value: 'tshirt' });
      expect(conflict).toContainEqual({ type: TraitType.bottom, value: 'jeans' });
    });

    it('should handle alien body type correctly', () => {
      const alienTraits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'alien', filters: [{ type: FilterType.race, value: 'alien' }] },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        // No eyes, hair, or mouth for alien
      ];

      expect(() => validateTraits(alienTraits)).not.toThrow();

      const finalTraits = getFinalTraits(alienTraits);
      const hash = calculateLookHash(finalTraits);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.startsWith('0x')).toBe(true);
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

    it('should handle necklace and bowtie mutual exclusivity', () => {
      // Test with necklace only (should be valid)
      const necklaceTraits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.necklace, value: 'gold' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(necklaceTraits)).not.toThrow();

      // Test with bowtie only (should be valid)
      const bowtieTraits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.bowtie, value: 'red' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(bowtieTraits)).not.toThrow();

      // Test with both necklace and bowtie (should fail)
      const bothTraits: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.necklace, value: 'gold' },
        { type: TraitType.bowtie, value: 'red' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
      ];

      expect(() => validateTraits(bothTraits)).toThrow('Layer conflict detected');
    });

    it('should handle optional traits correctly', () => {
      const traitsWithOptionals: Trait[] = [
        { type: TraitType.background, value: 'blue' },
        { type: TraitType.body, value: 'medium' },
        { type: TraitType.top, value: 'tshirt' },
        { type: TraitType.bottom, value: 'jeans' },
        { type: TraitType.eyes, value: 'brown' },
        { type: TraitType.hair, value: 'black' },
        { type: TraitType.mouth, value: 'smile' },
        { type: TraitType.facial_hair, value: 'beard' }, // Optional
        { type: TraitType.earrings, value: 'diamond' }, // Optional
        { type: TraitType.headgear, value: 'hat' }, // Optional
        { type: TraitType.mouthgear, value: 'pipe' }, // Optional
        { type: TraitType.eyewear, value: 'sunglasses' }, // Optional
        { type: TraitType.pet, value: 'dog' }, // Optional
        { type: TraitType.instrument, value: 'guitar' }, // Optional
      ];

      expect(() => validateTraits(traitsWithOptionals)).not.toThrow();
    });
  });
});
