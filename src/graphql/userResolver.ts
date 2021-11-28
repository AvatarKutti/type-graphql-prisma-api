import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import * as bcrypt from "bcryptjs";
import { getMongoManager, getMongoRepository } from "typeorm";

// import { Post } from "../entities/Post"

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    console.log("query started");

    const userRepo = getMongoRepository(User);

    const users = await userRepo.find({});

    console.log("query ending");
    return users;
  }

  @Mutation(() => User)
  async createUser(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: string) {
    const manager = getMongoManager();
    const user = await manager.findOneAndDelete(User, {
      where: {
        _id: id,
      },
    });
    console.log(user);

    return true;
  }
}
