import { useState, useEffect, useRef } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import corto1 from './assets/corto1.jpeg'

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState(``)
  const [leftWidth, setLeftWidth] = useState(50)
  const dragging = useRef(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    const response = await axios.post('http://localhost:3000/ai/get-review', { code })
    setReview(response.data)
  }

  // Handle drag for resizing
  function onMouseDown(e) {
    dragging.current = true
    document.body.style.cursor = 'col-resize'
  }
  function onMouseMove(e) {
    if (!dragging.current) return
    const main = document.querySelector('main')
    const rect = main.getBoundingClientRect()
    let percent = ((e.clientX - rect.left) / rect.width) * 100
    percent = Math.max(20, Math.min(80, percent))
    setLeftWidth(percent)
  }
  function onMouseUp() {
    dragging.current = false
    document.body.style.cursor = ''
  }
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  })

  return (
    <>
      <header className="cortexa-header">
        <img src={corto1} alt="Cortexa Logo" className="logo" />
        <h1>Cortexa</h1>
      </header>
      <main>
        <div className="left" style={{ flexBasis: `${leftWidth}%` }}>
          <div className="welcome-message">
            <h2>Welcome to Cortexa!</h2>
            <p>
              Add your code below and click <b>Review</b> to get instant, AI-powered feedback.<br />
              
            </p>
          </div>
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div
          className="divider"
          onMouseDown={onMouseDown}
          title="Drag to resize"
        />
        <div className="right" style={{ flexBasis: `${100 - leftWidth}%` }}>
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review || "Your review will appear here."}
          </Markdown>
        </div>
      </main>
    </>
  )
}

export default App