import { PostRepository } from '@/repositories/PostRepository';
import { PostCreationData, PostCreationDataWithThumbnail } from '@/types/Post';
import { UploadedFile } from 'express-fileupload';
import { FileService } from './FileService';
import { UserService } from './UserService';

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  async create(postContent: PostCreationData, thumbnailFile?: UploadedFile) {
    const postDataWithThumbnail: PostCreationDataWithThumbnail = {
      ...postContent,
    };

    if (thumbnailFile) {
      postDataWithThumbnail.thumbnail =
        await this.fileService.saveFile(thumbnailFile);
    }

    try {
      const newPost = await this.postRepository.create(postDataWithThumbnail);

      return newPost;
    } catch (err) {
      // Если при создании поста произошла ошибка, то удаляем созданную картинку (если создавали)
      if (postDataWithThumbnail.thumbnail) {
        await this.fileService.deleteFile(postDataWithThumbnail.thumbnail);
      }

      throw err;
    }
  }

  async getAll() {
    return await this.postRepository.getAll();
  }

  async getById(id: number) {
    if (!id) {
      throw new Error('Id is missing');
    }

    return await this.postRepository.getById(id);
  }

  async getAllByUserId(id: number) {
    if (!id) {
      throw new Error('User id is missing');
    }

    const user = await this.userService.getById(id);
    if (!user) {
      return null;
    }

    return await this.postRepository.getAllByUserId(id);
  }

  async update(
    id: number,
    postContent: PostCreationData,
    thumbnailFile?: UploadedFile,
  ) {
    if (!id) {
      throw new Error('Id is missing');
    }

    const oldPost = await this.postRepository.getById(id);
    if (!oldPost) {
      return null;
    }
    const oldPostThumbnail = oldPost.thumbnail;

    const postDataWithThumbnail: PostCreationDataWithThumbnail = {
      ...postContent,
    };

    if (thumbnailFile) {
      postDataWithThumbnail.thumbnail =
        await this.fileService.saveFile(thumbnailFile);
    }

    try {
      const updatedPost = await this.postRepository.update(
        id,
        postDataWithThumbnail,
      );

      if (oldPostThumbnail) {
        await this.fileService.deleteFile(oldPostThumbnail);
      }

      return updatedPost;
    } catch (err) {
      if (postDataWithThumbnail.thumbnail) {
        await this.fileService.deleteFile(postDataWithThumbnail.thumbnail);
      }

      throw err;
    }
  }

  async delete(id: number) {
    if (!id) {
      throw new Error('Id is missing');
    }

    const deletedPost = await this.postRepository.delete(id);
    if (!deletedPost) {
      return null;
    }

    const thumbnail = deletedPost.thumbnail;
    if (thumbnail) {
      await this.fileService.deleteFile(thumbnail);
    }

    return deletedPost;
  }
}
