/** iPod 曲目（虚构，封面用色相渐变绘制；播放为模拟状态） */
export interface Track {
  id: string
  title: string
  artist: string
  album: string
  /** 时长（秒） */
  dur: number
  hue: number
}

export const TRACKS: Track[] = [
  { id: 't1', title: 'City Lights', artist: 'Midnight Radio', album: 'Neon Stories', dur: 204, hue: 215 },
  { id: 't2', title: 'Rainy Avenue', artist: '林小夏', album: '南方站台', dur: 245, hue: 160 },
  { id: 't3', title: 'Dial-Up Memories', artist: 'Modem Kids', album: '56K', dur: 178, hue: 275 },
  { id: 't4', title: 'Sunset Runner', artist: 'The Pixels', album: '8-Bit Sunrise', dur: 221, hue: 25 },
]

export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
