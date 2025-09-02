import { PostService } from '@/services/PostService';
import { PostFromDB } from '@/types/Post';
import { userJwtPayloadSchema } from '@/validation/auth-validation';
import { coercedIntIdSchema } from '@/validation/common';
import { postTextContentSchema } from '@/validation/post-validation';
import { Request, Response } from 'express';
import { z } from 'zod/v4';

export class PostController {
  constructor(private readonly postService: PostService) {}

  async create(req: Request, res: Response) {
    const { id: authorId } = userJwtPayloadSchema.parse(req.user);
    const postTextContent = postTextContentSchema.parse(req.body);

    const postData = { authorId, ...postTextContent };

    const thumbnailFile = req.files?.thumbnail;

    if (Array.isArray(thumbnailFile)) {
      res
        .status(400)
        .json({ error: 'Only single file for thumbnail is allowed' });
      return;
    }

    const newPost = await this.postService.create(postData, thumbnailFile);

    res.json(newPost);
  }

  async getAll(req: Request, res: Response) {
    const userId = z.optional(coercedIntIdSchema).parse(req.query.userId);
    let posts: PostFromDB[] | null = [];

    if (userId) {
      posts = await this.postService.getAllByUserId(userId);
    } else {
      posts = await this.postService.getAll();
    }

    if (!posts) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(posts);
  }

  async getById(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);
    const post = await this.postService.getById(id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  }

  async update(req: Request, res: Response) {
    const postId = coercedIntIdSchema.parse(req.params.id);

    const { id: authorId } = userJwtPayloadSchema.parse(req.user);
    const postTextContent = postTextContentSchema.parse(req.body);

    const postData = { authorId, ...postTextContent };

    const thumbnailFile = req.files?.thumbnail;

    if (Array.isArray(thumbnailFile)) {
      res
        .status(400)
        .json({ error: 'Only single file for thumbnail is allowed' });
      return;
    }

    const updatedPost = await this.postService.update(
      postId,
      postData,
      thumbnailFile,
    );

    if (!updatedPost) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(updatedPost);
  }

  async delete(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const deletedPost = await this.postService.delete(id);

    if (!deletedPost) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(deletedPost);
  }
}
