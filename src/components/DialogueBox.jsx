import { useState, useEffect, useCallback } from 'react'
import styles from './DialogueBox.module.scss'

export default function DialogueBox({ dialogue, onComplete }) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const typeText = useCallback((text) => {
    let currentIndex = 0
    setDisplayText('')
    setIsTyping(true)

    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(timer)
        setIsTyping(false)
        if (onComplete) {
          setTimeout(onComplete, 1000)
        }
      }
    }, 30)

    return () => clearInterval(timer)
  }, [onComplete])

  useEffect(() => {
    if (!dialogue?.text) return
    
    const cleanup = typeText(dialogue.text)
    return cleanup
  }, [dialogue, typeText])

  if (!dialogue) return null

  return (
    <div className={styles.dialogueBox}>
      <div className={styles.speaker}>{dialogue.speaker}</div>
      <div className={styles.text}>
        {displayText}
        {isTyping && <span className={styles.cursor}>_</span>}
      </div>
    </div>
  )
}
