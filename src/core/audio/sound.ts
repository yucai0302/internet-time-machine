/**
 * 程序化合成音效引擎（Web Audio API）。
 * 不依赖任何音频素材文件，规避版权问题。
 * 1995 年代包：UI 点击、启动和弦、拨号音、DTMF、振铃、调制解调器握手全序列。
 */
class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private sources: AudioScheduledSourceNode[] = []
  muted = false

  private ensure(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.6
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  private tone(
    freq: number,
    start: number,
    dur: number,
    opts: { type?: OscillatorType; vol?: number } = {},
  ) {
    const ctx = this.ensure()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = opts.type ?? 'sine'
    osc.frequency.setValueAtTime(freq, start)
    const vol = opts.vol ?? 0.15
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(vol, start + 0.015)
    gain.gain.setValueAtTime(vol, start + dur - 0.02)
    gain.gain.linearRampToValueAtTime(0, start + dur)
    osc.connect(gain).connect(this.master!)
    osc.start(start)
    osc.stop(start + dur + 0.05)
    this.sources.push(osc)
  }

  private noiseBuffer(dur: number): AudioBuffer {
    const ctx = this.ensure()
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  private noise(
    start: number,
    dur: number,
    opts: { vol?: number; freq?: number; q?: number; wobble?: boolean } = {},
  ) {
    const ctx = this.ensure()
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuffer(dur)
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = opts.freq ?? 1800
    filter.Q.value = opts.q ?? 0.8
    const gain = ctx.createGain()
    const vol = opts.vol ?? 0.12
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(vol, start + 0.05)
    if (opts.wobble) {
      // 幅度抖动 —— 模拟载波训练序列的"哐哐"声
      const steps = Math.ceil(dur / 0.08)
      for (let i = 1; i <= steps; i++) {
        const t = start + i * 0.08
        gain.gain.linearRampToValueAtTime(vol * (0.4 + Math.random() * 0.9), t)
      }
    }
    gain.gain.linearRampToValueAtTime(0, start + dur)
    src.connect(filter).connect(gain).connect(this.master!)
    src.start(start)
    src.stop(start + dur + 0.05)
    this.sources.push(src)
  }

  // ------- 通用 UI 音效 -------

  click() {
    if (this.muted) return
    const ctx = this.ensure()
    this.tone(1800, ctx.currentTime, 0.03, { type: 'square', vol: 0.05 })
  }

  /** 启动和弦 —— 上升琶音，避免与任何商业系统音雷同 */
  chime() {
    if (this.muted) return
    const ctx = this.ensure()
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((f, i) => {
      this.tone(f, ctx.currentTime + i * 0.13, 0.6, { type: 'sine', vol: 0.1 })
      this.tone(f * 2, ctx.currentTime + i * 0.13, 0.3, { type: 'sine', vol: 0.03 })
    })
  }

  // ------- 1995 拨号音效 -------

  /** 拨号音：350Hz + 440Hz */
  dialTone(dur = 1) {
    if (this.muted) return
    const ctx = this.ensure()
    const t = ctx.currentTime
    this.tone(350, t, dur, { vol: 0.1 })
    this.tone(440, t, dur, { vol: 0.1 })
  }

  private static DTMF: Record<string, [number, number]> = {
    '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
    '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
    '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
    '0': [941, 1336],
  }

  /** DTMF 双音频拨号：依次拨出号码 */
  dtmfDial(digits: string, startDelay = 0) {
    if (this.muted) return
    const ctx = this.ensure()
    let t = ctx.currentTime + startDelay
    for (const d of digits) {
      const pair = SoundEngine.DTMF[d]
      if (pair) {
        this.tone(pair[0], t, 0.09, { vol: 0.12 })
        this.tone(pair[1], t, 0.09, { vol: 0.12 })
      }
      t += 0.2
    }
    return t - ctx.currentTime
  }

  /** 振铃回音：440 + 480 */
  ringback(dur = 1.6) {
    if (this.muted) return
    const ctx = this.ensure()
    const t = ctx.currentTime
    this.tone(440, t, dur, { vol: 0.07 })
    this.tone(480, t, dur, { vol: 0.07 })
  }

  /**
   * 完整调制解调器握手序列（约 10 秒）：
   * 呼叫音 → 应答音(2100Hz) → 载波啁啾 → 训练噪声 → 数据链路嘶嘶声
   */
  modemHandshake() {
    if (this.muted) return
    const ctx = this.ensure()
    const t0 = ctx.currentTime + 0.05

    // 应答音 2100Hz（对方调制解调器摘机）
    this.tone(2100, t0, 1.3, { vol: 0.09 })
    // 应答音相位反转的"嘟—嘟"感
    this.tone(2100, t0 + 1.3, 0.5, { vol: 0.07 })

    // 载波啁啾：两组音频之间来回扫描
    const chirp = (t: number, f1: number, f2: number, dur: number, vol = 0.08) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f1, t)
      const steps = 10
      for (let i = 1; i <= steps; i++) {
        osc.frequency.linearRampToValueAtTime(i % 2 ? f2 : f1, t + (i * dur) / steps)
      }
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(vol, t + 0.02)
      gain.gain.linearRampToValueAtTime(0, t + dur)
      osc.connect(gain).connect(this.master!)
      osc.start(t)
      osc.stop(t + dur + 0.05)
      this.sources.push(osc)
    }
    chirp(t0 + 1.9, 1200, 2250, 0.9)
    chirp(t0 + 2.9, 2250, 1200, 0.9)

    // 训练序列：带宽噪声 + 幅度抖动（经典"咔咔咔"声）
    this.noise(t0 + 3.9, 2.4, { vol: 0.11, freq: 1800, wobble: true })
    this.noise(t0 + 6.3, 1.2, { vol: 0.09, freq: 2400, wobble: false })

    // 两次低沉的 V.8 "bong" 音
    this.tone(550, t0 + 7.6, 0.25, { vol: 0.1 })
    this.tone(2000, t0 + 7.85, 0.2, { vol: 0.06 })
    this.tone(550, t0 + 8.15, 0.25, { vol: 0.1 })

    // 数据链路建立：持续嘶嘶声渐弱
    this.noise(t0 + 8.6, 1.6, { vol: 0.05, freq: 1200 })
  }

  // ------- 时间穿越 / 年代主题音效 -------

  /** 年代提示音：拖动时间轴切换年代时，每个时代一个专属音色 */
  eraBlip(flavor: 'beep' | 'midi' | 'im' | 'sms' | 'notif' | 'ai') {
    if (this.muted) return
    const ctx = this.ensure()
    const t = ctx.currentTime
    switch (flavor) {
      case 'beep': // 1995：PC 喇叭方波
        this.tone(880, t, 0.06, { type: 'square', vol: 0.05 })
        this.tone(1320, t + 0.08, 0.06, { type: 'square', vol: 0.05 })
        break
      case 'midi': // 2000：MIDI 琶音
        ;[523, 659, 784].forEach((f, i) => this.tone(f, t + i * 0.07, 0.12, { type: 'triangle', vol: 0.07 }))
        break
      case 'im': // 2005：IM 经典"滴滴"
        this.tone(880, t, 0.05, { vol: 0.08 })
        this.tone(1245, t + 0.07, 0.07, { vol: 0.08 })
        break
      case 'sms': // 2010：短信三连音
        this.tone(1318, t, 0.06, { vol: 0.08 })
        this.tone(1568, t + 0.08, 0.1, { vol: 0.08 })
        break
      case 'notif': // 2020：柔和通知双音
        this.tone(440, t, 0.1, { vol: 0.07 })
        this.tone(554, t + 0.1, 0.14, { vol: 0.07 })
        break
      case 'ai': // 2026：AI 晶体泛音
        this.tone(1244, t, 0.16, { vol: 0.05 })
        this.tone(1661, t + 0.02, 0.2, { vol: 0.04 })
        this.tone(2489, t + 0.05, 0.14, { vol: 0.02 })
        break
    }
  }

  /** 穿越音效：噪声扫频 + 低频滑升，随后接目标年代提示音（约 2.2 秒） */
  whoosh(flavor?: 'beep' | 'midi' | 'im' | 'sms' | 'notif' | 'ai') {
    if (this.muted) return
    const ctx = this.ensure()
    const t0 = ctx.currentTime
    // 带通噪声：频率从低到高再回落，模拟隧道加速感
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuffer(2.4)
    const filt = ctx.createBiquadFilter()
    filt.type = 'bandpass'
    filt.Q.value = 1.1
    filt.frequency.setValueAtTime(280, t0)
    filt.frequency.exponentialRampToValueAtTime(3600, t0 + 1.6)
    filt.frequency.exponentialRampToValueAtTime(700, t0 + 2.2)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(0.15, t0 + 0.5)
    gain.gain.setValueAtTime(0.11, t0 + 1.6)
    gain.gain.linearRampToValueAtTime(0, t0 + 2.2)
    src.connect(filt).connect(gain).connect(this.master!)
    src.start(t0)
    src.stop(t0 + 2.3)
    this.sources.push(src)
    // 低频滑音：增加推进感
    const osc = ctx.createOscillator()
    const og = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, t0)
    osc.frequency.exponentialRampToValueAtTime(640, t0 + 1.8)
    og.gain.setValueAtTime(0, t0)
    og.gain.linearRampToValueAtTime(0.07, t0 + 0.6)
    og.gain.linearRampToValueAtTime(0, t0 + 2.1)
    osc.connect(og).connect(this.master!)
    osc.start(t0)
    osc.stop(t0 + 2.2)
    this.sources.push(osc)
    // 落地年代提示音
    if (flavor) this.eraBlip(flavor)
  }

  /** 停止所有正在播放的音（关闭拨号窗口 / 断开连接时调用） */
  stopAll() {
    this.sources.forEach(s => {
      try {
        s.stop()
      } catch {
        /* 已停止则忽略 */
      }
    })
    this.sources = []
  }
}

export const sound = new SoundEngine()
