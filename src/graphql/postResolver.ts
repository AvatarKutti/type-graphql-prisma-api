import { Post } from "../entities/Post";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getMongoManager, getMongoRepository } from "typeorm";
const ObjectId = require("mongodb").ObjectID;

@Resolver()
export class PostResolver {
  // Query

  // This Query returns all the posts in the db

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    const postRepo = getMongoRepository(Post);

    // Gets the posts collection and finds all the posts in that collection

    const users = await postRepo.find({});

    //Returns the posts found in that query

    return users;
  }
  // Mutation

  // This mutation creates a post by getting the data through args
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Arg("body") body: string
  ): Promise<Post> {
    // Creates a post
    const post = await Post.create({
      title,
      body,
      comments: [],
    }).save();

    // Returns the post
    return post;
  }

  // This mutation post the comments on a particular post by getting the postId, comment content and author

  @Mutation(() => Post)
  async postComment(
    @Arg("author") author: string,
    @Arg("content") content: string,
    @Arg("postId") postId: string
  ) {
    const manager = getMongoManager();

    // Finds the post with the id given and push the comment into the comments array in the given post

    const post = await manager.findOneAndUpdate(
      Post,
      { _id: ObjectId(postId) },
      {
        comments: {
          $push: {
            author,
            content,
          },
        },
      }
    );

    // Checks if operation is done correct

    if (!post) {
      throw new Error("Something went wrong! Please check your credentials");
    }

    // Returns the post

    return post;
  }
}
