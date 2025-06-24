import { coercedIntIdSchema, intIdSchema } from '@/validation/common';

describe('intIdSchema', () => {
  describe('given valid input', () => {
    it('should return number for positive integer', () => {
      const result = intIdSchema.parse(10);

      expect(result).toBe(10);
    });
  });

  describe('given invalid input', () => {
    it('should throw error for string', () => {
      const testFunction = () => {
        intIdSchema.parse('10');
      };

      expect(testFunction).toThrow();
    });

    it('should throw error for negative integer', () => {
      const testFunction = () => {
        intIdSchema.parse(-1);
      };

      expect(testFunction).toThrow();
    });

    it('should throw error for 0', () => {
      const testFunction = () => {
        intIdSchema.parse(0);
      };

      expect(testFunction).toThrow();
    });

    it('should throw error for floating point number', () => {
      const testFunction = () => {
        intIdSchema.parse(2.2);
      };

      expect(testFunction).toThrow();
    });
  });
});

describe('coercedIntIdSchema', () => {
  describe('given valid input', () => {
    it('should return number for positive integer', () => {
      const result = coercedIntIdSchema.parse(10);

      expect(result).toBe(10);
    });

    it('should return number if positive int string provided', () => {
      const result = coercedIntIdSchema.parse('10');

      expect(result).toBe(10);
    });
  });

  describe('given invalid input', () => {
    it('should throw error for invalid string', () => {
      const testFunction = () => {
        coercedIntIdSchema.parse('DHB823g^&372f');
      };

      expect(testFunction).toThrow();
    });

    it('should throw error for negative integer', () => {
      const testFunction = () => {
        coercedIntIdSchema.parse(-1);
      };

      expect(testFunction).toThrow();
    });

    it('should throw error for 0', () => {
      const testFunction = () => {
        coercedIntIdSchema.parse(0);
      };

      expect(testFunction).toThrow();
    });

    it('should throw error for floating point number', () => {
      const testFunction = () => {
        coercedIntIdSchema.parse(2.2);
      };

      expect(testFunction).toThrow();
    });
  });
});
