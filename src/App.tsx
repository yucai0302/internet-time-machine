import { useRef, useState } from 'react'
import HomePage from './home/HomePage'
import ComingSoon from './home/ComingSoon'
import TimeTravelTransition from './core/transition/TimeTravelTransition'
import { ERA_MAP } from './core/eras/eraThemes'
import { ERAS } from './eras/registry'

type Stage =
  | { kind: 'home' }
  | { kind: 'era'; id: string }
  | { kind: 'soon'; id: string }

/**
 * 顶层状态机：首页/时代页 →（TimeTravelTransition 五阶段穿越）→ 时代桌面 / 时代预告页。
 * 转场期间旧舞台保持挂载（被 itm-collapse 坍缩动画吸走）；
 * land 时刻切换到目标时代并加 itm-landing 显影动画，转场层再独立淡出 —— 全程无白屏/黑屏闪烁。
 */
export default function App() {
  const [stage, setStage] = useState<Stage>({ kind: 'home' })
  const [travel, setTravel] = useState<{ from: string; to: string } | null>(null)
  const [landing, setLanding] = useState(false)
  const travellingRef = useRef(false)
  // 记录最近一次穿越的年代：返回首页时时光机停在该年代而非复位到 1995
  const [lastEra, setLastEra] = useState('1995')

  const startTravel = (to: string) => {
    if (travellingRef.current) return // 防止重复点击叠加多个转场
    travellingRef.current = true
    setLastEra(to)
    setTravel({ from: stage.kind === 'home' ? 'home' : stage.id, to })
  }

  /** Phase4→5 交界（t=3.2s）：切换到目标时代真实页面，转场层继续负责淡出 */
  const handleLand = () => {
    if (!travel) return
    setLanding(true)
    if (ERAS[travel.to]) setStage({ kind: 'era', id: travel.to })
    else setStage({ kind: 'soon', id: travel.to })
  }

  /** 转场完全结束（t=4.0s）：卸载转场层，恢复交互 */
  const handleDone = () => {
    travellingRef.current = false
    setTravel(null)
    setLanding(false)
  }

  const stageKey = stage.kind === 'home' ? 'home' : `${stage.kind}-${stage.id}`
  // landing 优先：land 之后舞台切换为新元素并播放显影动画
  const stageClass = landing ? 'itm-stage itm-landing' : travel ? 'itm-stage itm-travelling' : 'itm-stage'

  const renderStage = () => {
    switch (stage.kind) {
      case 'era': {
        const EraComponent = ERAS[stage.id].component
        return <EraComponent onExit={() => setStage({ kind: 'home' })} />
      }
      case 'soon':
        return <ComingSoon theme={ERA_MAP[stage.id]} onBack={() => setStage({ kind: 'home' })} />
      default:
        return <HomePage onTravel={startTravel} initialEra={lastEra} />
    }
  }

  return (
    <div className="h-full w-full bg-itm-bg">
      <div key={stageKey} className={`${stageClass} h-full w-full`}>
        {renderStage()}
      </div>
      {travel && (
        <TimeTravelTransition
          key="time-travel"
          fromEra={travel.from}
          toEra={travel.to}
          onLand={handleLand}
          onDone={handleDone}
        />
      )}
    </div>
  )
}
