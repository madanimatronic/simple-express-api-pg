import { postCreationSchema } from '@/validation/post-validation';

describe('postCreationSchema', () => {
  describe('given valid input', () => {
    it('should return valid object for valid creation data', () => {
      const creationData = {
        title: '123',
        authorId: 1,
        content: 'test',
      };

      const result = postCreationSchema.parse(creationData);

      expect(result).toEqual(creationData);
    });

    it('should return valid object for valid creation data with authorId as string', () => {
      const creationData = {
        title: '123',
        authorId: '1',
        content: 'test',
      };
      const expectedData = {
        ...creationData,
        authorId: 1,
      };

      const result = postCreationSchema.parse(creationData);

      expect(result).toEqual(expectedData);
    });
  });

  describe('given invalid input', () => {
    it('should throw error if some fields are missing', () => {
      const creationData = {
        title: '123',
        authorId: 1,
      };

      const testFunction = () => {
        postCreationSchema.parse(creationData);
      };

      expect(testFunction).toThrow();
    });

    it('should throw error for invalid title', () => {
      const creationData = {
        title: 123,
        authorId: 1,
        content: 'test',
      };

      const testFunction = () => {
        postCreationSchema.parse(creationData);
      };

      expect(testFunction).toThrow();
    });

    it('should throw error for invalid authorId', () => {
      const creationData = {
        title: '123',
        authorId: 'trash',
        content: 'test',
      };

      const testFunction = () => {
        postCreationSchema.parse(creationData);
      };

      expect(testFunction).toThrow();
    });

    it('should throw error for invalid content', () => {
      const creationData = {
        title: '123',
        authorId: 1,
        content: 999,
      };

      const testFunction = () => {
        postCreationSchema.parse(creationData);
      };

      expect(testFunction).toThrow();
    });
  });
});
