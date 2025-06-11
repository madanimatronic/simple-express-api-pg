import { postRepository } from '@/repositories/PostRepository';
import { PostCreationData, PostCreationDataWithThumbnail } from '@/types/Post';
import { UploadedFile } from 'express-fileupload';
import { fileService } from './FileService';
import { userService } from './UserService';

class PostService {
  async create(postContent: PostCreationData, thumbnailFile?: UploadedFile) {
    const postDataWithThumbnail: PostCreationDataWithThumbnail = {
      ...postContent,
    };

    if (thumbnailFile) {
      postDataWithThumbnail.thumbnail =
        await fileService.saveFile(thumbnailFile);
    }

    try {
      const newPost = await postRepository.create(postDataWithThumbnail);

      return newPost;
    } catch (err) {
      // Если при создании поста произошла ошибка, то удаляем созданную картинку (если создавали)
      if (postDataWithThumbnail.thumbnail) {
        await fileService.deleteFile(postDataWithThumbnail.thumbnail);
      }

      throw err;
    }
  }

  async getAll() {
    return await postRepository.getAll();
  }

  async getById(id: number) {
    if (!id) {
      throw new Error('Id is missing');
    }

    return await postRepository.getById(id);
  }

  async getAllByUserId(id: number) {
    if (!id) {
      throw new Error('User id is missing');
    }

    const user = await userService.getById(id);
    if (!user) {
      return null;
    }

    return await postRepository.getAllByUserId(id);
  }

  async update(
    id: number,
    postContent: PostCreationData,
    thumbnailFile?: UploadedFile,
  ) {
    if (!id) {
      throw new Error('Id is missing');
    }

    const oldPost = await postRepository.getById(id);
    if (!oldPost) {
      return null;
    }
    const oldPostThumbnail = oldPost.thumbnail;

    const postDataWithThumbnail: PostCreationDataWithThumbnail = {
      ...postContent,
    };

    if (thumbnailFile) {
      postDataWithThumbnail.thumbnail =
        await fileService.saveFile(thumbnailFile);
    }

    try {
      const updatedPost = await postRepository.update(
        id,
        postDataWithThumbnail,
      );

      if (oldPostThumbnail) {
        await fileService.deleteFile(oldPostThumbnail);
      }

      return updatedPost;
    } catch (err) {
      if (postDataWithThumbnail.thumbnail) {
        await fileService.deleteFile(postDataWithThumbnail.thumbnail);
      }

      throw err;
    }
  }

  async delete(id: number) {
    if (!id) {
      throw new Error('Id is missing');
    }

    const deletedPost = await postRepository.delete(id);
    if (!deletedPost) {
      return null;
    }

    const thumbnail = deletedPost.thumbnail;
    if (thumbnail) {
      await fileService.deleteFile(thumbnail);
    }

    return deletedPost;
  }
}

export const postService = new PostService();
