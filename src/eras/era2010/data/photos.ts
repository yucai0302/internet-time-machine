/** 相机胶卷示例照片与壁纸（本地生成素材） */
import wGrass from '../assets/wallpaper-grass.jpg'
import wDrops from '../assets/wallpaper-drops.jpg'
import wBokeh from '../assets/wallpaper-bokeh.jpg'
import p1 from '../assets/photo-1.jpg'
import p2 from '../assets/photo-2.jpg'
import p3 from '../assets/photo-3.jpg'
import p4 from '../assets/photo-4.jpg'
import p5 from '../assets/photo-5.jpg'
import p6 from '../assets/photo-6.jpg'

export interface Photo {
  id: string
  src: string
  title: string
}

export const PHOTOS: Photo[] = [
  { id: 'p1', src: p1, title: '火锅之夜' },
  { id: 'p2', src: p2, title: '窗台上的橘座' },
  { id: 'p3', src: p3, title: '演唱会现场' },
  { id: 'p4', src: p4, title: '海边木栈道' },
  { id: 'p5', src: p5, title: '雨后拉面馆' },
  { id: 'p6', src: p6, title: '奶茶和芝士蛋糕' },
]

export interface Wallpaper {
  name: string
  src: string
}

export const WALLPAPERS: Wallpaper[] = [
  { name: '晨露青草', src: wGrass },
  { name: '水滴黑玻璃', src: wDrops },
  { name: '夜色光斑', src: wBokeh },
]
