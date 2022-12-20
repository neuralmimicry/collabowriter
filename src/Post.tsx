import React, { useState, useReducer, useEffect } from 'react'
import { css } from 'glamor'
import { Link, useParams } from 'react-router-dom'
import { API, graphqlOperation } from 'aws-amplify'
import debounce from 'debounce';
import { createPost, updatePost as UpdatePost } from './graphql/mutations'
import { onUpdatePostWithId } from './graphql/subscriptions'
import { v4 as uuidv4 } from 'uuid'
import Container from './Container'
import {Observable} from 'zen-observable-ts'

const CLIENTID = uuidv4()

const ReactMarkdown = require('react-markdown')
const input = `# This is a header\n\nAnd this is a paragraph\n\n`

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'updateMarkdown':
      return {
        ...state,
        markdown: action.markdown,
        clientId: CLIENTID
      };
    case 'updateTitle':
      return {
        ...state,
        title: action.title,
        clientId: CLIENTID
      };
    case 'updatePost':
      return action.post
    default:
      throw new Error();
  }
}

async function createNewPost(post: any, dispatch: React.Dispatch<any>) {
  try {
    const postData: any = await API.graphql(graphqlOperation(createPost, { input: post }))
    dispatch({
      type: 'updatePost',
      post: {
        ...postData.data.createPost,
        clientId: CLIENTID,
        createdAt: new Date().toISOString()
      }
    })
  } catch (err) {
    if (err instanceof Error) {
      // @ts-ignore
      if (err.errors[0].errorType === "DynamoDB:ConditionalCheckFailedException") {
        // @ts-ignore
        const existingPost = err.errors[0].data
        dispatch({
          type: 'updatePost',
          post: {
            ...existingPost,
            clientId: CLIENTID
          }
        })
      }
    }
  }
}

const debouncedUpdatePost = debounce(
  async function updatePost(post: any) {
    try {
      await API.graphql(graphqlOperation(UpdatePost, { input: post }))
      console.log('post has been updated!')
    } catch (err) {
      console.log('error:', err)
    }
  },
  250
)

const Post = () => {
  const params = useParams();
  const post = {
    id: params.id,
    title: params.title,
    clientId: CLIENTID,
    markdown: '# Loading...',
    createdAt: new Date().toISOString()
  }
  const [postState, dispatch] = useReducer(reducer, post);
  const [isEditing, updateIsEditing] = useState(false)

  function toggleMarkdown() {
    updateIsEditing(!isEditing)
  }

  useEffect(() => {
    const post = {
      ...postState,
      markdown: input
    }
    createNewPost(post, dispatch).then()
  }, [postState])

  function updateMarkdown(e: any) {
    dispatch({
      type: 'updateMarkdown',
      markdown: e.target.value,
    })
    const newPost = {
      id: post.id,
      markdown: e.target.value,
      clientId: CLIENTID,
      createdAt: post.createdAt,
      title: postState.title
    }
    debouncedUpdatePost(newPost).then()
  }

  function updatePostTitle(e: any) {
    dispatch({
      type: 'updateTitle',
      title: e.target.value
    })
    const newPost = {
      id: post.id,
      markdown: postState.markdown,
      clientId: CLIENTID,
      createdAt: post.createdAt,
      title: e.target.value
    }
    debouncedUpdatePost(newPost).then()
  }

  useEffect(() => {
    const subscriber = API.graphql(graphqlOperation(onUpdatePostWithId, {
      id: post.id
    })) as Observable<any>;
    const subscription = subscriber.subscribe({
      next: data => {
        if (CLIENTID === data.value.data.onUpdatePostWithId.clientId) return
        const postFromSub = data.value.data.onUpdatePostWithId
        dispatch({
          type: 'updatePost',
          post: postFromSub
        })
      }
    });
    return () => subscription.unsubscribe()
  }, [post.id])

  return (
    <Container>
      <div {...styles.header}>
        <Link to='/' {...styles.link}>
          <p {...styles.heading}><span role='img' aria-label='write'>✍️</span> Collabowriter</p>
        </Link>
      </div>
      <div {...styles.container}>
        <div {...styles.body}>
          <div {...styles.toggleButton}>
            <p {...styles.fancy} {...styles.toggleButtonText} onClick={toggleMarkdown}>
              {isEditing ? 'Done' : 'Edit'}
            </p>
          </div>
          {!isEditing && <h1 {...styles.postTitle}>{postState.title}</h1>}
          {!isEditing && <ReactMarkdown source={postState.markdown} />}
          {isEditing && (
            <input
              value={postState.title}
              onChange={updatePostTitle}
              {...styles.input}
              placeholder='Post Title'
            />
          )}
          {isEditing && <textarea {...styles.textarea} value={postState.markdown} onChange={updateMarkdown} />}
        </div>
      </div>
    </Container>
  )
}

export default Post;

const styles = {
  header: css({
    height: 70,
    boxShadow: '0px 0px 12px rgba(0, 0, 0, .2)',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 30,
  }),
  link: css({
    textDecoration: 'none',
    color: 'black'
  }),
  heading: css({
    margin: 0,
    fontFamily: "Francois One, sans-serif",
    fontSize: 28
  }),
  toggleButton: css({
    width: 80,
    cursor: 'pointer',
    backgroundColor: '#66e2d5',
    border: '2px solid black',
  }),
  toggleButtonText: css({
    textAlign: 'center',
    fontSize: 18,
    margin: '2px 0px'
  }),
  fancy: css({
    fontFamily: "Francois One, sans-serif"
  }),
  input: css({
    outline: 'none',
    border: 'none',
    fontFamily: "ZCOOL XiaoWei, serif",
    fontSize: 38,
    marginTop: 30,
    marginBottom: 8,
    color: 'rgba(0, 0, 0, .35)',
    width: '900px',
    '@media(max-width: 940px)': {
      width: 'calc(100% - 40px)',
      padding: '20px 20px 20px 0px'
    }
  }),
  textarea: css({
    width: 900,
    marginTop: 10,
    border: '3px solid black',
    minHeight: 'calc(100vh - 350px)',
    outline: 'none',
    fontSize: 18,
    '@media(max-width: 940px)': {
      width: 'calc(100% - 40px)',
      padding: '20px 20px'
    }
  }),
  postTitle: css({
    fontFamily: "ZCOOL XiaoWei, serif",
    fontSize: 66,
    '@media(max-width: 650px)': {
      fontSize: 50
    }
  }),
  container: css({
    overflowY: 'scroll',
    maxHeight: 'calc(100vh - 98px)',
  }),
  body: css({
    padding: '50px 0px 0px',
    width: '900px',
    margin: '0 auto',
    '@media(max-width: 940px)': {
      width: 'calc(100% - 40px)',
      padding: '20px 20px'
    }
  })
}
