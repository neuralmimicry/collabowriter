import React, { ReactNode } from 'react'
import { css } from 'glamor'

type Props = {
  children: ReactNode;
  style?: React.CSSProperties;
};

const Container = ({ children, style }: Props) => {
  return (
    <div {...styles.container} style={style}>
      { children }
    </div>
  )
}

const styles = {
  container: css({
    border: '14px solid #66e2d5',
    height: 'calc(100vh - 28px)',
    width: 'calc(100vw - 28px)',
  })
}

export default Container
