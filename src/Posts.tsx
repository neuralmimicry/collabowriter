import React, { useState, useEffect, useReducer } from 'react'
import { css } from 'glamor'
import {Link, useNavigate} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { listPosts } from './graphql/queries'
import { onCreatePost } from './graphql/subscriptions'
import {API, graphqlOperation, Logger} from 'aws-amplify'
import {Observable} from 'zen-observable-ts'

const logger = new Logger('PostLogger', 'DEBUG');

async function fetchPosts(dispatch: any) {
  try {
    const postData: any = await API.graphql(graphqlOperation(listPosts))
    dispatch({
      type: 'fetchPostsSuccess',
      posts: postData.data.listPosts.items
    })
  } catch (err) {
    logger.error('error fetching posts...: ', err)
    dispatch({
      type: 'fetchPostsError',
    })
  }
}

const initialState = {
  posts: [],
  loading: true,
  error: false
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'fetchPostsSuccess':
      return {
        ...state,
        posts: action.posts,
        loading: false
      }
    case 'addPostFromSubscription':
      return {
        ...state,
        posts: [
          action.post,
          ...state.posts
        ]
      }
    case 'fetchPostsError':
      return {
        ...state,
        loading: false,
        error: true
      }
    default:
      throw new Error();
  }
}

const Posts = () => {
  const [isOpen, toggleModal] = useState(false)
  const [input, updateInput] = useState('')
  const [postsState, dispatch] = useReducer(reducer, initialState)
  const navigation = useNavigate()

  function toggle() { toggleModal(!isOpen) }
  function onChange(e: any) { updateInput(e.target.value) }

  function navigate() {
    if (input === '') return
    const id = uuidv4()
    const url = `/post/${id}/${input}`
    navigation(url)
  }

  useEffect(() => {
    fetchPosts(dispatch).then()
  }, [])

  useEffect(() => {
    const subscriber = API.graphql(graphqlOperation(onCreatePost)) as Observable<any>;
    const subscription = subscriber.subscribe({
      next: data => {
        const postFromSub = data.value.data.onCreatePost
        logger.info(JSON.stringify(postFromSub, null, 2))
        dispatch({
          type: 'addPostFromSubscription',
          post: postFromSub
        })
      }
    });
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div>
      <div {...styles.headingContainer}>
        <div>
          <h1 {...styles.heading}><span role='img' aria-label='write'>✍️</span> Collabowriter</h1>
          <div {...styles.taglineContainer}>
            <span
              {...styles.tagLineText}
            >Real-time collaborative blogging platform.</span>
          </div>
        </div>
        <div {...styles.buttonContainer}>
          <div {...styles.button} onClick={toggle}>
            <p {...styles.buttonText}>New Post</p>
          </div>
        </div>
      </div>
      <div {...styles.body}>
        {
          postsState.loading && (
            <div {...styles.loadingContainer}>
              <h1 {...styles.postTitle}>Loading..</h1>
            </div>
          )
        }
        <div {...styles.postList}>
          {
            postsState.posts.map((p: any, i: any) => (
              <div key={i}>
                <Link to={`/post/${p.id}/${p.title}`} {...styles.link}>
                  <h1 {...styles.postTitle}>{p.title}</h1>
                </Link>
              </div>
            ))
          }
        </div>
        <div {...styles.footer}>
          <p {...styles.footerText}>
          Built with &nbsp;
          <a
          target="_blank"
          rel="noreferrer"
          href="https://aws-amplify.github.io/" {...styles.footerLink}>AWS Amplify</a>
          &nbsp; &amp; &nbsp;
          <a
          target="_blank"
          rel="noreferrer"
          href="https://aws.amazon.com/appsync/" {...styles.footerLink}>AWS AppSync</a>. Deployed with the
          <a
          target="_blank"
          rel="noreferrer"
          href="https://aws.amazon.com/amplify/console/" {...styles.footerLink}>&nbsp;Amplify Console</a>
          .
          </p>
        </div>
      </div>
      {
        isOpen && (
          <Modal
            onChange={onChange}
            input={input}
            navigate={navigate}
            toggle={toggle}
          />
        )
      }
      
    </div>
  )
}

export default Posts

// @ts-ignore
const Modal = ({ onChange, input, navigate, toggle }) => (
  <div {...styles.modalContainer}>
    <input
      placeholder="Post Title"
      {...styles.input}
      onChange={onChange}
      value={input}
      key="input"
    />
    <div {...css(styles.modalButton)} onClick={navigate}>
      <p {...styles.modalButtonText}>Create Post</p>
    </div>
    <div onClick={toggle} {...styles.modalButton} {...styles.cancelButton}>
      <p
        {...styles.modalButtonText}>Cancel</p>
    </div>
  </div>
)

const styles = {
  heading: css({
    color: 'white', 
    margin: 0,
    '@media(max-width: 640px)': {
      fontSize: 30
    }
  }),
  taglineContainer: css({
    marginLeft: 65,
    paddingRight: 20,
    marginTop: -10,
    '@media(max-width: 640px)': {
      marginLeft: 37,
      marginTop: -3,
    }
  }),
  tagLineText: css({
    color: 'white'
  }),
  headingContainer: css({
    height: 130,
    backgroundColor: 'black', 
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 30
  }),
  buttonContainer: css({
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1
  }),
  button: css({
    padding: '8px 42px',
    backgroundColor: '#66e2d5',
    marginRight: 90,
    borderRadius: 3,
    cursor: 'pointer',
    minWidth: 56,
    '@media(max-width: 640px)': {
      marginRight: 20,
      padding: '4px 20px'
    }
  }),
  buttonText: css({
    fontSize: 20,
    marginTop: -2,
    marginBottom: 0,
    '@media(max-width: 640px)': {
      fontSize: 16
    }
  }),
  body: css({
    width: 'calc(100vw - 30px)',
    border: '15px solid #66e2d5',
    padding: '25px 0px',
    overflowY: 'scroll',
    '@media(max-width: 640px)': {
      paddingTop: 0,
      overflowY: 'none'
    }
  }),
  loadingContainer: css({
    paddingLeft: 50,
    paddingTop: 20
  }),
  postList: css({
    width: '900px',
    margin: '0 auto',
    padding: '0px 0px 20px',
    
    '@media(max-width: 940px)': {
      width: 'calc(100% - 40px)',
      padding: '10px 20px'
    }
  }),
  postTitle: css({
    marginTop: 10,
    borderBottom: '3px solid #66e2d5',
    paddingBottom: '3px',
    ':hover': {
      opacity: 0.7
    },
    '@media(max-width: 640px)': {
      fontSize: 32,
      marginTop: 5
    }
  }),
  link: css({
    textDecoration: 'none',
    color: 'black'
  }),
  modalContainer: css({
    position: 'fixed',
    left: '50%',
    top: '50%',
    marginLeft: '-250px',
    marginTop: '-150px',
    height: 210,
    border: '4px solid black',
    width: 500,
    backgroundColor: 'white',
    boxShadow: '1px 1px 12px rgba(0, 0, 0, .15)',
    zIndex: 1000,
    padding: 20,
    borderRadius: 3,
    '@media(max-width: 740px)': {
      width: '250px',
      marginLeft: '-150px',
    }
  }),
  input: css({
    height: 50,
    width: 300,
    fontSize: 22,
    outline: 'none',
    border: 'none',
    borderBottom: '3px solid #66e2d5',
    marginBottom: 15,
    '@media(max-width: 740px)': {
      width: '225px',
    }
  }),
  modalButton: css({
    backgroundColor: '#66e2d5',
    padding: '14px',
    
    cursor: 'pointer',
    width: 200,
    marginTop: 10,
  }),
  modalButtonText: css({
    textAlign: 'center',
    fontSize: 20,
    margin: '2px 0px'
  }),
  cancelButton: css({
    backgroundColor: '#ededed'
  }),
  footer: css({
    padding: '0px 20px'
  }),
  footerText: css({
    fontSize: 16,
    marginBottom: 0
  }),
  footerLink: css({
    textDecoration: 'none',
    color: '#00ceb8'
  })
}
