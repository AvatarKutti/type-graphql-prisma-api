import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

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
