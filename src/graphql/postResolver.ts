import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getMongoManager, getMongoRepository } from "typeorm";
const ObjectId = require("mongodb").ObjectID;
import { AuthMiddleware } from "./middlewares/authMiddleware";

@Resolver()
export class PostResolver {
  // QUERY

  // This Query returns all the posts in the db

  @Query(() => [Post])
  @UseMiddleware(AuthMiddleware)
  async posts(): Promise<Post[]> {
    const postRepo = getMongoRepository(Post);

    // Gets the posts collection and finds all the posts in that collection

    const posts = await postRepo.find({});

    //Returns the posts found in that query

    return posts;
  }

  //MUTATION

  // This mutation creates a post by getting the data through args
  @Mutation(() => Post)
  @UseMiddleware(AuthMiddleware)
  async createPost(
    @Arg("title") title: string,
    @Arg("body") body: string,
    @Arg("userId") id: string
  ): Promise<Post> {
    // Creates a post
    const post = await Post.create({
      title,
      body,
      comments: [],
    }).save();

    if (post) {
      const manager = getMongoManager();

      const user = await manager.findOneAndUpdate(
        User,
        { _id: ObjectId(id) },
        {
          $push: {
            posts: post.id,
          },
        }
      );

      if (!user) {
        throw new Error("Something went wrong");
      }
    }

    // Returns the post
    return post;
  }

  // This mutation post the comments on a particular post by getting the postId, comment content and author

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async postComment(
    @Arg("author") author: string,
    @Arg("content") content: string,
    @Arg("postId") postId: string
  ): Promise<Boolean> {
    const manager = getMongoManager();

    // Finds the post with the id given and push the comment into the comments array in the given post

    const post = await manager.findOneAndUpdate(
      Post,
      { _id: ObjectId(postId) },
      {
        $push: {
          comments: {
            author,
            content,
          },
        },
      }
    );

    if (!post.lastErrorObject.updatedExisting) {
      return false;
    }

    // Returns the true if the document is updated

    return true;
  }

  // This mutation deletes a post

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deletePost(@Arg("id") id: string): Promise<Boolean> {
    const manager = getMongoManager();
    try {
      const post = await manager.findOneAndDelete(Post, { _id: ObjectId(id) });
      console.log(post);
      return true;
    } catch (error) {
      return false;
    }
  }
}
