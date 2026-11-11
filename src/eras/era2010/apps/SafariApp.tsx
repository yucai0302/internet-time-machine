import { useEffect, useRef, useState } from 'react'
import { NavBar } from '../components/NavBar'

type PageId = 'portal' | 'blog' | 'search'

interface PageDef {
  id: PageId
  url: string
  title: string
}

const PAGES: Record<PageId, PageDef> = {
  portal: { id: 'portal', url: 'http://news.sina10.com.cn', title: '新浪新闻 2010' },
  blog: { id: 'blog', url: 'http://blog.geek10.com/laoxu', title: '老徐的数码博客' },
  search: { id: 'search', url: 'http://www.search10.com', title: '搜索' },
}

/** 2010 风格模拟网页 */
function PortalPage({ go }: { go: (p: PageId) => void }) {
  return (
    <div className="web10">
      <div className="masthead">
        <h1>新网新闻</h1>
        <small>xinwang10.com · 2010年11月11日 星期四</small>
      </div>
      <div className="navrow">
        <span className="lk" onClick={() => go('blog')}>博客</span>
        <span>微博</span>
        <span>体育</span>
        <span>财经</span>
        <span>科技</span>
        <span>汽车</span>
      </div>
      <div className="marq">
        <span>【快讯】iPhone 4 今日国内正式发售 · 球迷彻夜排队 · 《阿凡达》重映加场 · 世博圆满闭幕后首个周末客流平稳 · 更多精彩尽在新网新闻</span>
      </div>
      <ul className="newslist">
        <li>
          <span className="lk" onClick={() => go('blog')}>iPhone 4 今日开售：Retina 屏幕与 Facetime 成最大卖点</span>
          <br />
          <span className="dt">2010-11-11 09:20 · 科技频道</span>
        </li>
        <li>
          <span className="lk">3G 用户突破 4000 万，运营商流量资费竞争加剧</span>
          <br />
          <span className="dt">2010-11-11 08:45 · 财经频道</span>
        </li>
        <li>
          <span className="lk">《让子弹飞》定档贺岁档，网友期待值爆棚</span>
          <br />
          <span className="dt">2010-11-11 08:02 · 娱乐频道</span>
        </li>
        <li>
          <span className="lk">团购买菜模式兴起，一天三顿换着团购</span>
          <br />
          <span className="dt">2010-11-10 22:10 · 生活频道</span>
        </li>
      </ul>
      <div className="colwrap">
        <div className="side">
          <b>热门排行</b>
          1. iPhone 4<br />2. 阿凡达<br />3. 世博<br />4. 3G<br />5. 团购
        </div>
        <div style={{ flex: 1, fontSize: 11, lineHeight: 1.6 }}>
          <b style={{ color: '#345' }}>编辑推荐</b>
          <p style={{ margin: '4px 0' }}>智能手机正在改变我们的生活：地铁上、餐桌上，人人都低头刷着手机。有人说这是"低头族"时代的开始……</p>
          <span className="lk">查看全文 &gt;</span>
        </div>
      </div>
    </div>
  )
}

function BlogPage() {
  return (
    <div className="web10 blog10">
      <div className="bhead">
        <h1>老徐的数码博客</h1>
        <p>记录关于电脑、手机与互联网的一切 · since 2006</p>
      </div>
      <div className="bpost">
        <h2>iPhone 4 开箱：这就是未来吗？</h2>
        <div className="bm">2010-11-10 · 数码 · 评论(32)</div>
        <p>
          拿到 iPhone 4 的第一时间，我被这块 Retina 屏幕震住了——300 ppi，肉眼完全看不到像素点。玻璃与不锈钢边框的工业设计堪称艺术品，虽然"死亡之握"的信号问题确实存在……
        </p>
      </div>
      <div className="bpost">
        <h2>纪念一下：我用过的那些手机</h2>
        <div className="bm">2010-11-06 · 随笔 · 评论(18)</div>
        <p>
          从诺基亚 3100 到摩托罗拉 V3，再到今天的 iPhone 4。十年间手机从"能打电话的砖头"变成了"能装进口袋的电脑"。下一个十年又会怎样？
        </p>
      </div>
      <div className="bpost">
        <h2>微博时代的博客会死吗？</h2>
        <div className="bm">2010-11-02 · 观点 · 评论(56)</div>
        <p>
          140 字的碎片化表达正在分流长文读者，但我相信深度内容永远有市场。就像电视没有杀死广播，微博也不会杀死博客。
        </p>
      </div>
    </div>
  )
}

function SearchPage({ kw, go }: { kw?: string; go: (p: PageId) => void }) {
  const results = [
    { t: 'iPhone 4 官方介绍 - 苹果官网', u: 'www.apple10.com/iphone4', d: 'Retina 显示屏 · Facetime 视频通话 · 双面玻璃设计，了解 iPhone 4 的一切。' },
    { t: 'iPhone 4 评测汇总 - 新网数码', u: 'tech.xinwang10.com/iphone4-review', d: '信号门、天线条、价格对比，出发前必读的 10 篇深度评测。' },
    { t: '老徐的数码博客', u: 'blog.geek10.com/laoxu', d: '持续更新 iPhone 4 开箱与使用心得，欢迎订阅。' },
  ]
  return (
    <div className="web10">
      <div className="search10">
        <h1>搜一搜</h1>
        <div className="sinput">
          <input defaultValue={kw} placeholder="输入关键词" id="s10kw" />
          <button onClick={() => { /* 已在结果页 */ void document.getElementById('s10kw') }}>搜一下</button>
        </div>
        {kw && <p style={{ fontSize: 10, color: '#888', marginTop: 10 }}>约 1,180,000 条结果（0.21 秒）</p>}
      </div>
      {kw && (
        <div className="sres">
          {results.map((r) => (
            <div key={r.u}>
              <h3 onClick={() => go(r.t.includes('老徐') ? 'blog' : 'portal')}>{r.t}</h3>
              <div className="gu">{r.u}</div>
              <p>{r.d}</p>
            </div>
          ))}
        </div>
      )}
      {!kw && <p style={{ textAlign: 'center', color: '#999', fontSize: 11, paddingBottom: 20 }}>试试搜 "iPhone 4"</p>}
    </div>
  )
}

/** 经典 Safari：地址栏 + 底部工具栏 + 前进/后退/刷新 + 2010 老网页 */
export default function SafariApp() {
  const [hist, setHist] = useState<PageId[]>(['portal'])
  const [idx, setIdx] = useState(0)
  const [query, setQuery] = useState('')
  const [addr, setAddr] = useState(PAGES.portal.url)
  const [loading, setLoading] = useState(false)
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const page = PAGES[hist[idx]]

  const navigate = (id: PageId, kw?: string) => {
    setLoading(true)
    if (loadTimer.current) clearTimeout(loadTimer.current)
    loadTimer.current = setTimeout(() => setLoading(false), 900)
    setHist((h) => [...h.slice(0, idx + 1), id])
    setIdx(idx + 1)
    setAddr(kw ? `${PAGES.search.url}?q=${encodeURIComponent(kw)}` : PAGES[id].url)
  }

  useEffect(() => {
    // 后退/前进时同步地址栏与加载条
    setLoading(true)
    if (loadTimer.current) clearTimeout(loadTimer.current)
    loadTimer.current = setTimeout(() => setLoading(false), 700)
    setAddr(page.url)
    return () => { if (loadTimer.current) clearTimeout(loadTimer.current) }
  }, [idx]) // eslint-disable-line react-hooks/exhaustive-deps

  const go = (id: PageId) => navigate(id)

  return (
    <div className="app4">
      <div className="addr4">
        <input
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            const v = e.currentTarget.value.trim()
            if (!v) return
            if (v.includes('blog') || v.includes('geek')) go('blog')
            else if (v.includes('search') || v.includes('?q=')) { setQuery(decodeURIComponent(v.split('?q=')[1] || '')); navigate('search', decodeURIComponent(v.split('?q=')[1] || '')) }
            else go('portal')
          }}
        />
      </div>
      {loading && <div className="loading-bar" style={{ flex: 'none' }} />}
      <div className="page4 scroll4">
        {page.id === 'portal' && <PortalPage go={go} />}
        {page.id === 'blog' && <BlogPage />}
        {page.id === 'search' && <SearchPage kw={query} go={(id) => { setQuery(''); go(id) }} />}
        <p style={{ textAlign: 'center', color: '#bbb', fontSize: 10, padding: '14px 0' }}>— 2010 · 模拟网页 · 由 Safari 渲染 —</p>
      </div>
      <div className="tools4">
        <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} title="后退">◀</button>
        <button disabled={idx >= hist.length - 1} onClick={() => setIdx(idx + 1)} title="前进">▶</button>
        <button title="书签" onClick={() => go('blog')}>📖</button>
        <button
          title="刷新"
          onClick={() => {
            setLoading(true)
            if (loadTimer.current) clearTimeout(loadTimer.current)
            loadTimer.current = setTimeout(() => setLoading(false), 900)
          }}
        >
          ↻
        </button>
        <button title="搜索" onClick={() => { setQuery(''); go('search') }}>🔍</button>
      </div>
    </div>
  )
}
