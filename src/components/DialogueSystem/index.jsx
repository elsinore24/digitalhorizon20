import { useState, useEffect, useRef } from 'react'
import styles from './DialogueSystem.module.scss'
import useAudio from '../../hooks/useAudio'
import useDialogue from '../../hooks/useDialogue'
import AudioVisualizer from '../AudioVisualizer'

const DialogueSystem = () => {
  const { currentDialogue, isDialogueActive } = useDialogue()
  const { getAudioInstance } = useAudio()
  const [displayedText, setDisplayedText] = useState('')
  const [typingComplete, setTypingComplete] = useState(false)
  const [audioElement, setAudioElement] = useState(null)
  const typingInterval = useRef(null)
  
  useEffect(() => {
    if (currentDialogue?.id && isDialogueActive) {
      const audio = getAudioInstance(currentDialogue.id)
      setAudioElement(audio)
      
      setDisplayedText('')
      setTypingComplete(false)
      
      audio.addEventListener('play', startTypingEffect)
      
      return () => {
        audio.removeEventListener('play', startTypingEffect)
      }
    }
  }, [currentDialogue, isDialogueActive, getAudioInstance])
  
  const startTypingEffect = () => {
    if (typingInterval.current) {
      clearInterval(typingInterval.current)
    }
    
    const fullText = currentDialogue.text
    let charIndex = 0
    
    const typingSpeed = audioElement.duration * 1000 / (fullText.length * 1.1)
    
    typingInterval.current = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typingInterval.current)
        setTypingComplete(true)
      }
    }, typingSpeed)
  }
  
  if (!isDialogueActive || !currentDialogue) return null
  
  return (
    <div className={styles.dialogueContainer}>
      <div className={styles.dialogueBox}>
        <div className={styles.dialogueHeader}>
          <span className={styles.speakerName}>{currentDialogue.speaker}</span>
          
          {audioElement && (
            <div className={styles.visualizerContainer}>
              <AudioVisualizer audio={audioElement} />
            </div>
          )}
        </div>
        
        <div className={styles.dialogueText}>
          {displayedText}
          {!typingComplete && <span className={styles.cursor}>_</span>}
        </div>
      </div>
    </div>
  )
}

export default DialogueSystem
