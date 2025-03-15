import { useEffect, useRef } from 'react'
import styles from './AudioVisualizer.module.scss'

const AudioVisualizer = ({ audio }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const analyzerRef = useRef(null)
  
  useEffect(() => {
    if (!audio || !canvasRef.current) return
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const analyzer = audioContext.createAnalyser()
    const audioSource = audioContext.createMediaElementSource(audio)
    
    analyzer.fftSize = 64
    audioSource.connect(analyzer)
    analyzer.connect(audioContext.destination)
    
    analyzerRef.current = analyzer
    
    const bufferLength = analyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const draw = () => {
      const WIDTH = canvas.width
      const HEIGHT = canvas.height
      
      analyzerRef.current.getByteFrequencyData(dataArray)
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      
      const barWidth = (WIDTH / bufferLength) * 2.5
      let barHeight
      let x = 0
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * HEIGHT
        
        const hue = 180 // Cyan color
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`
        
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)
        x += barWidth + 1
      }
      
      animationRef.current = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      audioSource.disconnect()
      analyzer.disconnect()
    }
  }, [audio])
  
  return (
    <canvas 
      ref={canvasRef} 
      className={styles.visualizer}
      width="200"
      height="40"
    />
  )
}

export default AudioVisualizer
