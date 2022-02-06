import React from 'react'
import ReactDOM from 'react-dom'
import { ProgressWithShadowChart } from './progress-with-shadow-chart'
import { css } from '@emotion/css';

ReactDOM.render(
  <React.StrictMode>
    <div className={css({ margin: 32 })}>
      <ProgressWithShadowChart percentValue={80}/>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)