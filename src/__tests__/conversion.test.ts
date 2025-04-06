import { calculateGrams, findIngredient, parseNaturalLanguageInput } from '../utils/conversion';

describe('Conversion Utilities', () => {
  describe('findIngredient', () => {
    it('should find exact ingredient matches', () => {
      expect(findIngredient('all-purpose flour')).toBe('all-purpose flour');
      expect(findIngredient('butter')).toBe('butter');
    });
    
    it('should find ingredients via alternatives', () => {
      expect(findIngredient('plain flour')).toBe('all-purpose flour');
      expect(findIngredient('icing sugar')).toBe('powdered sugar');
    });
    
    it('should find ingredients with fuzzy matching', () => {
      expect(findIngredient('flour')).toBe('all-purpose flour');
      expect(findIngredient('ap flour')).toBe('all-purpose flour');
    });
    
    it('should return null for unknown ingredients', () => {
      expect(findIngredient('unobtainium')).toBeNull();
    });
  });
  
  describe('calculateGrams', () => {
    it('should correctly convert cups to grams', () => {
      expect(calculateGrams('all-purpose flour', 1, 'cup')).toBe(120);
      expect(calculateGrams('granulated sugar', 2, 'cup')).toBe(400);
    });
    
    it('should correctly convert tablespoons to grams', () => {
      expect(calculateGrams('butter', 2, 'tablespoon')).toBe(28.4);
      expect(calculateGrams('salt', 1, 'tablespoon')).toBe(18);
    });
    
    it('should return 0 for unknown ingredients', () => {
      expect(calculateGrams('unknown ingredient', 1, 'cup')).toBe(0);
    });
  });
  
  describe('parseNaturalLanguageInput', () => {
    it('should parse simple ingredient expressions', () => {
      expect(parseNaturalLanguageInput('2 cups of flour')).toEqual({
        ingredient: 'all-purpose flour',
        amount: 2,
        unit: 'cup'
      });
    });
    
    it('should parse expressions with abbreviations', () => {
      expect(parseNaturalLanguageInput('1.5 tbsp butter')).toEqual({
        ingredient: 'butter',
        amount: 1.5,
        unit: 'tablespoon'
      });
    });
    
    it('should parse expressions with "convert to grams" format', () => {
      expect(parseNaturalLanguageInput('convert 3 cups of sugar to grams')).toEqual({
        ingredient: 'granulated sugar',
        amount: 3,
        unit: 'cup'
      });
    });
    
    it('should return null for unparseable input', () => {
      expect(parseNaturalLanguageInput('how many eggs do I need')).toBeNull();
    });
  });
});
