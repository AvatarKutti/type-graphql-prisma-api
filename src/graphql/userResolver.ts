import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../entities/User";
import * as bcrypt from "bcryptjs";
import { getMongoManager, getMongoRepository } from "typeorm";
const ObjectId = require("mongodb").ObjectID;
import * as jwt from "jsonwebtoken";
import { AuthMiddleware } from "./middlewares/authMiddleware";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(AuthMiddleware)
  async users(): Promise<User[]> {
    // Got an error "TypeError: Cannot read property 'prototype' of undefined"
    // Fixed it by downgrading to mongodb version 3.7.1

    const userRepo = getMongoRepository(User);

    // Gets the user collection and finds all the users in that collection

    const users = await userRepo.find({});

    //Returns the users found in that query

    return users;
  }

  // Mutations

  //This mutation creates the user by getting the data in the form of arguments(@Arg)
  @Mutation(() => User)
  @UseMiddleware(AuthMiddleware)
  async createUser(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    //Hashes the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Creates the user and reutrns the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      posts: [],
    }).save();

    return user;
  }

  // This mutation deletes a user by using their id

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteUser(@Arg("id") id: string) {
    const manager = getMongoManager();
    try {
      const user = await manager.findOneAndDelete(User, { _id: ObjectId(id) });
      console.log(user);
      return true;
    } catch (error) {
      return false;
    }
  }

  // This mutation log In's a user by getting their email and password , Also this mutation sends back a token

  @Mutation(() => String)
  @UseMiddleware(AuthMiddleware)
  async logUser(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const userRepo = getMongoRepository(User);

    // Finds the user with the email given
    const user = await userRepo.findOne({ email });

    // Checks if user exists for the given email

    if (!user) {
      throw new Error("User not found! Please check your email");
    }

    // If user exists it checks whether the password is right

    const comparePassword = await bcrypt.compare(password, user.password);

    // Checks whether the passowrd is correct if not throws an error

    if (!comparePassword) {
      throw new Error("User not found! Please check your password");
    }

    // If given information is right signs a json web token and sends it back

    const token = jwt.sign(
      { userId: user.id },
      "jsiffsfagfmabgjwgahuaghaughaugauywgaehjgege"
    );

    // Returns the token

    return token;
  }
}
