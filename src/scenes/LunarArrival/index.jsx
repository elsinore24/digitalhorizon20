import { useEffect, useState } from 'react'
import useGameState from '../../hooks/useGameState'
import useAudio from '../../hooks/useAudio'
import useDialogue from '../../hooks/useDialogue'
import TemporalEcho from '../../components/TemporalEcho'
import Scene3D from '../../components/Scene3D'
import DataPerceptionOverlay from '../../components/DataPerceptionOverlay'
import ObjectiveTracker from '../../components/ObjectiveTracker'
import DialogueSystem from '../../components/DialogueSystem'
import styles from './LunarArrival.module.scss'

const LunarArrival = ({ dataPerceptionMode }) => {
  const { gameState, visitScene } = useGameState()
  const { playNarration } = useAudio()
  const { setDialogue, clearDialogue } = useDialogue()
  const [introComplete, setIntroComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!gameState) return // Add null check

    const isFirstVisit = !gameState.scenesVisited?.includes('lunar_arrival')
    if (isFirstVisit) {
      playIntroSequence()
      visitScene('lunar_arrival')
    }

    return () => {
      clearDialogue()
    }
  }, [gameState, visitScene, clearDialogue])

  const playIntroSequence = () => {
    setIsPlaying(true)
    
    const introDialogue = {
      id: 'lunar_arrival_intro',
      speaker: 'ALARA',
      text: "Professor Thorne? Can you hear me? Your neural connection is stabilizing... There you are. The transfer was rougher than anticipated."
    }
    
    setDialogue(introDialogue)
    playNarration('lunar_arrival_intro')
    
    setTimeout(() => {
      setIntroComplete(true)
      setIsPlaying(false)
    }, 8000)
  }

  if (!gameState) return null // Add null check

  return (
    <div className={styles.sceneContainer}>
      <div className={styles.lunarSurface}>
        <div className={styles.stars} />
        <div className={styles.horizon} />
        <div className={styles.lunarGround} />
      </div>

      <Scene3D dataPerceptionMode={dataPerceptionMode} />
      <DataPerceptionOverlay active={dataPerceptionMode} />
      
      <ObjectiveTracker 
        objective="DR. KAI'S RESEARCH FRGM"
        progress={{
          RESEARCH_LOG: gameState.discoveredEchoes?.filter(id => id.startsWith('research_')).length || 0,
          PERSONAL_MEMORY: gameState.discoveredEchoes?.filter(id => id.startsWith('memory_')).length || 0,
          ANOMALY: gameState.discoveredEchoes?.filter(id => id.startsWith('anomaly_')).length || 0
        }}
      />
      
      <div className={styles.environment}>
        {dataPerceptionMode && (
          <div className={styles.dataElements}>
            <TemporalEcho 
              id="research_001"
              type="RESEARCH_LOG"
              position={{ x: 25, y: 40 }}
            />
            <TemporalEcho 
              id="memory_001"
              type="PERSONAL_MEMORY"
              position={{ x: 75, y: 60 }}
            />
            <TemporalEcho 
              id="anomaly_001"
              type="ANOMALY"
              position={{ x: 50, y: 30 }}
            />
          </div>
        )}
      </div>

      <DialogueSystem />
    </div>
  )
}

export default LunarArrival
