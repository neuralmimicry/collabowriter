# ✍️ Collabowriter

A real-time collaborative blog post editor built with GraphQL, React, React Markdown, & AWS AppSync. (Forked from [here](https://github.com/dabit3/write-with-me) and upgraded to support React v18/Amplify)

Nadir Dabit's medium post "How to Build a Real-time Collaborative Markdown Editor with React Hooks, GraphQL & AWS AppSync". Click [here](https://medium.com/open-graphql/how-to-build-a-real-time-collaborative-markdown-editor-with-react-hooks-graphql-aws-appsync-dc0c121683f4) to check it out.

> Try it out at [collabowriter.neuralmimicry.ai](https://collabowriter.neuralmimicry.ai/#/)


### Base schema

Here's the base schema:

```graphql
type Post @model {
  id: ID!
  clientId: ID!
  markdown: String!
  title: String!
  createdAt: String
}
```

We have a `Post` type that has a few properties. The most important property is the markdown. This is where we are keeping up with the state of the post.

We also have a `clientId` to properly handle GraphQL subscriptions on the client.

## Launching the app

Deploy this fullstack app with a single click to the Amplify Console:

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/neuralmimicry/collabowriter)


### Run locally with the Amplify CLI

1. Clone the repo

```sh
git clone https://github.com/neuralmimicry/collabowriter.git
```

2. Change into the directory & install dependencies

```sh
cd collabowriter

npm install
```

3. Initialize the Amplify backend

```sh
amplify init
```

4. Push the application into your account

```sh
amplify push
```
