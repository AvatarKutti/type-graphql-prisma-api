# TYPE-GRAPHQL-TYPEORM-API

## Short Description

This is a simple server build using typeorm and typegraphql and mongodb

## Techonolgies used: 
   * Typescript
   * Graphql(type-graphql)
   * MongoDB
   * Typeorm
   * Express
   * JsonWebToken
   
## Brief Description
I build this simple api using the above mentioned technologies , so that I can learn this topic of creating type-safe backend and at the same time I can help others to learn 
from my code as well. Using this api you can create a user, log in a user, delete a user, query the users. 
    
## Errors Faced
 1 . The main error or bug I faced is the incompatibility of mongoDB version 4 with typeorm . If you want to use mongoDB with typeorm use mongoDB version 3. T personally used 
 mongDB version 3.7.1. This error will look like this,
 
     TypeError: Cannot read property 'prototype' of undefined
     at FindCursor.cursor.toArray (/home/anon/projects/mongo-typeorm-sample/src/entity-manager/MongoEntityManager.ts:707:37)
     at MongoEntityManager. (/home/anon/projects/mongo-typeorm-sample/src/entity-manager/MongoEntityManager.ts:97:23)
     at step (/home/anon/projects/mongo-typeorm-sample/node_modules/tslib/tslib.js:143:27)
     at Object.next (/home/anon/projects/mongo-typeorm-sample/node_modules/tslib/tslib.js:124:57)
     at fulfilled (/home/anon/projects/mongo-typeorm-sample/node_modules/tslib/tslib.js:114:62)
     at processTicksAndRejections (internal/process/task_queues.js:95:5)
   

