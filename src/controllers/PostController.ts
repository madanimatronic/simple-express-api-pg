import { postService } from '@/services/PostService';
import { Post } from '@/types/Post';
import { coercedIntIdSchema } from '@/validation/common';
import { postCreationSchema } from '@/validation/post-validation';
import { Request, Response } from 'express';
import { z } from 'zod/v4';

class PostController {
  async create(req: Request, res: Response) {
    const postData = postCreationSchema.parse(req.body);

    const thumbnailFile = req.files?.thumbnail;

    if (Array.isArray(thumbnailFile)) {
      res
        .status(400)
        .json({ error: 'Only single file for thumbnail is allowed' });
      return;
    }

    const newPost = await postService.create(postData, thumbnailFile);

    res.json(newPost);
  }

  async getAll(req: Request, res: Response) {
    const userId = z.optional(coercedIntIdSchema).parse(req.query.userId);
    let posts: Post[] | null = [];

    if (userId) {
      posts = await postService.getAllByUserId(userId);
    } else {
      posts = await postService.getAll();
    }

    if (!posts) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(posts);
  }

  async getById(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);
    const post = await postService.getById(id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  }

  async update(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const postData = postCreationSchema.parse(req.body);

    const thumbnailFile = req.files?.thumbnail;

    if (Array.isArray(thumbnailFile)) {
      res
        .status(400)
        .json({ error: 'Only single file for thumbnail is allowed' });
      return;
    }

    const updatedPost = await postService.update(id, postData, thumbnailFile);

    if (!updatedPost) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(updatedPost);
  }

  async delete(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const deletedPost = await postService.delete(id);

    if (!deletedPost) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(deletedPost);
  }
}

export const postController = new PostController();
