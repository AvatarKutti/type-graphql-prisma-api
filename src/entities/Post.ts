import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  body: string;

  @Field(() => [Comment])
  @Column()
  comments: Comment[];
}

@ObjectType()
@Entity()
class Comment {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  author: string;

  @Field()
  @Column()
  content: string;
}
