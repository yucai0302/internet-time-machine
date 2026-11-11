import type { ReactNode } from 'react'

/**
 * 三个 1995 年代感模拟网页。
 * 视觉语言：Times 衬线、纯文字链接、表格布局、访客计数器、Under Construction。
 * 品牌全部为自创假名，规避版权。
 */
export interface FakePage {
  url: string
  title: string
  render: (nav: (url: string) => void) => ReactNode
}

/* ---------- 简易元件 ---------- */

function Counter({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-[1px] font-mono" style={{ background: '#000', padding: 2 }}>
      {String(n).padStart(6, '0').split('').map((d, i) => (
        <span key={i} style={{ background: '#111', color: '#0f0', padding: '0 2px', fontSize: 12 }}>{d}</span>
      ))}
    </span>
  )
}

function UnderConstruction() {
  return (
    <div style={{ marginTop: 12, border: '2px solid #000' }}>
      <div
        style={{
          height: 22,
          background:
            'repeating-linear-gradient(45deg, #ffcc00 0 12px, #000 12px 24px)',
        }}
      />
      <div className="text-center" style={{ background: '#000', padding: '2px 0' }}>
        <span className="blink95 font-bold" style={{ color: '#ffcc00', fontFamily: "'Comic Sans MS', cursive" }}>
          THIS PAGE IS UNDER CONSTRUCTION!
        </span>
      </div>
    </div>
  )
}

function Hr() {
  return <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #808080' }} />
}

/* ---------- Page 1：Galaxy Directory（Yahoo 风格目录站） ---------- */

const galaxyPage: FakePage = {
  url: 'www.galaxy-directory.com',
  title: "Galaxy!! - Welcome to Galaxy Directory",
  render: nav => (
    <div style={{ padding: '20px 32px' }}>
      <div className="text-center">
        <h1 className="font-black tracking-wide" style={{ fontSize: 40, color: '#7b0f9e', textShadow: '2px 2px 0 #ffd700' }}>
          Galaxy<span style={{ color: '#0055aa' }}>!!</span>
        </h1>
        <div className="marquee95" style={{ color: '#cc0000', fontWeight: 'bold' }}>
          *** Welcome to the Galaxy Directory — your guide to the World Wide Web! Now indexing over 10,000 sites! ***
        </div>
      </div>
      <Hr />
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: '65%' }}>
          <b>What's New</b> · <span className="link95" onClick={() => nav('www.web-chronicle.com/news95.html')}>What's Cool</span> ·{' '}
          <span className="link95">Netizen's Picks</span>
          <Hr />
          <table style={{ width: '100%', fontSize: 14 }}>
            <tbody>
              <tr>
                <td>
                  <span className="link95" onClick={() => nav('www.geostars.com/~starpaw/home.html')}>Arts</span><br />
                  <span className="link95" onClick={() => nav('www.geostars.com/~starpaw/home.html')}>Computers and Internet</span><br />
                  <span className="link95">Entertainment</span><br />
                  <span className="link95">Science</span>
                </td>
                <td>
                  <span className="link95">Business</span><br />
                  <span className="link95" onClick={() => nav('www.web-chronicle.com/news95.html')}>News</span><br />
                  <span className="link95">Sports</span><br />
                  <span className="link95">Weather</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ width: '35%', borderLeft: '1px solid #808080', paddingLeft: 16 }}>
          <b>Search the Web</b>
          <div className="bevel-thin-in" style={{ marginTop: 6, display: 'flex' }}>
            <input style={{ width: '100%', border: 'none', outline: 'none', padding: '2px 4px', fontSize: 13 }} />
          </div>
          <button className="btn95 w95-font" style={{ marginTop: 6, padding: '2px 12px' }}>Search</button>
          <p style={{ marginTop: 10, fontSize: 12, color: '#606060' }}>
            Did you know? As of 1995, over 27 million people are connected to the Internet worldwide!
          </p>
        </div>
      </div>
      <Hr />
      <p className="text-center" style={{ fontSize: 12, color: '#606060' }}>
        Copyright © 1995 Galaxy Directory Corp. — Best viewed with WebSurfer 1.0 at 800x600
      </p>
    </div>
  ),
}

/* ---------- Page 2：Starpaw's HomePage（个人主页） ---------- */

const starpawPage: FakePage = {
  url: 'www.geostars.com/~starpaw/home.html',
  title: "Starpaw's Home Page!!!",
  render: nav => (
    <div
      style={{
        padding: '16px 24px',
        background: '#000',
        color: '#fff',
        fontFamily: "'Comic Sans MS', 'Comic Sans', cursive, sans-serif",
        minHeight: '100%',
      }}
    >
      <div
        style={{
          background:
            'radial-gradient(circle at 20% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 0.5px, transparent 1px), radial-gradient(circle at 40% 80%, #fff 0.5px, transparent 1px), #000',
          backgroundSize: '80px 80px, 120px 120px, 100px 100px',
        }}
      >
        <h1 className="text-center" style={{ fontSize: 34, color: '#ff69b4', textShadow: '0 0 8px #ff1493, 2px 2px 0 #800080' }}>
          ~*~ Starpaw's Home Page ~*~
        </h1>
        <div className="text-center" style={{ color: '#00ff00' }}>
          <span className="blink95">*** NEW! ***</span> <span style={{ color: '#ffff00' }}>Updated 11/08/95</span>
        </div>
        <Hr />
        <p className="marquee95" style={{ color: '#00ffff' }}>
          Hi everyone!! Welcome 2 my page on the Information Superhighway!! Sign my guestbook!! ^_^
        </p>
        <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
          <div style={{ width: 120, height: 120, flexShrink: 0, border: '3px ridge #ff69b4', background: 'linear-gradient(135deg,#4b0082,#ff69b4)' }} className="pixelated flex items-center justify-center text-center" >
            <span style={{ fontSize: 10 }}>My Photo<br />(loading... 46%)</span>
          </div>
          <div>
            <p><span style={{ color: '#ff69b4' }}>About me:</span> I'm a cat who loves the Internet! My hobbies include chasing the mouse (the computer kind!) and chasing the mouse (the squeaky kind!)</p>
            <p style={{ marginTop: 8 }}>
              <span style={{ color: '#ff69b4' }}>My cool links:</span><br />
              » <span className="link95" onClick={() => nav('www.galaxy-directory.com')}>Galaxy Directory</span> — find every site on the web!<br />
              » <span className="link95" onClick={() => nav('www.web-chronicle.com/news95.html')}>The Web Chronicle</span> — daily internet news!<br />
              » <span className="link95">My MIDI collection (56 songs!)</span>
            </p>
          </div>
        </div>
        <UnderConstruction />
        <div className="text-center" style={{ marginTop: 16, fontSize: 13 }}>
          <span style={{ color: '#ffff00' }}>You are visitor number:</span>
          <div style={{ marginTop: 4 }}><Counter n={1995} /></div>
          <div style={{ marginTop: 10, color: '#00ff00', fontSize: 12 }}>
            ♪ Now playing: midis/tune95.mid ♪
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: '#aaa' }}>
            This page is part of the <span className="link95">GeoStars Neighborhood</span> webring · <span className="link95">[Prev]</span> · <span className="link95">[Next]</span> · <span className="link95">[Random]</span>
          </div>
        </div>
      </div>
    </div>
  ),
}

/* ---------- Page 3：The Web Chronicle（新闻页） ---------- */

const chroniclePage: FakePage = {
  url: 'www.web-chronicle.com/news95.html',
  title: 'The Web Chronicle — Daily News for the Information Age',
  render: nav => (
    <div style={{ padding: '16px 32px' }}>
      <div className="text-center" style={{ borderBottom: '3px double #000', paddingBottom: 8 }}>
        <h1 style={{ fontSize: 32, fontFamily: "'Times New Roman', serif", letterSpacing: 1 }}>
          The Web Chronicle
        </h1>
        <div style={{ fontSize: 12, color: '#404040' }}>
          Daily News for the Information Age — Wednesday, November 8, 1995 — Vol. 1 No. 214
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
        <div style={{ width: '68%' }}>
          <h2 style={{ fontSize: 22, marginTop: 8 }}>The "Information Superhighway": Hype or Future?</h2>
          <p style={{ marginTop: 8, lineHeight: 1.5 }}>
            WASHINGTON — Five years ago, almost nobody had heard of the "Internet." Today, more than 27 million
            people in 150 countries use this worldwide network of computers to send electronic mail, read news,
            and even do their shopping.
          </p>
          <p style={{ marginTop: 8, lineHeight: 1.5 }}>
            Connecting to the network still requires patience: a home computer, a <b>modem</b>, and a telephone
            line. The characteristic screeching sound made during connection — known as a "handshake" — has become
            the anthem of a generation of early adopters.
          </p>
          <p style={{ marginTop: 8, lineHeight: 1.5 }}>
            "I think this World Wide Web thing is going to be big," said one analyst. "Maybe even bigger than the
            fax machine."
          </p>
          <p style={{ marginTop: 12, fontSize: 13, color: '#606060' }}>
            Related: <span className="link95" onClick={() => nav('www.galaxy-directory.com')}>A beginner's guide to the Web</span> ·{' '}
            <span className="link95" onClick={() => nav('www.geostars.com/~starpaw/home.html')}>Meet the webmasters: personal home pages boom</span>
          </p>
        </div>
        <div style={{ width: '32%', borderLeft: '1px solid #808080', paddingLeft: 16 }}>
          <b>In This Issue</b>
          <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 13 }}>
            <li><span className="link95">Modem prices fall below $200</span></li>
            <li><span className="link95">Is 28.8k worth the upgrade?</span></li>
            <li><span className="link95">E-mail etiquette: the dos and don'ts</span></li>
            <li><span className="link95">Web pages: 10 tips for beginners</span></li>
          </ul>
          <div className="bevel-thin-in" style={{ marginTop: 12, padding: 8, background: '#ffffcc', fontSize: 12 }}>
            <b style={{ color: '#cc0000' }}>ADVERTISEMENT</b>
            <div style={{ marginTop: 4 }}>
              <span className="blink95 font-bold">NEW!</span> 28,800 bps modems from only $189! Call 1-800-TIME-NET today!
            </div>
          </div>
        </div>
      </div>
      <Hr />
      <p className="text-center" style={{ fontSize: 12, color: '#606060' }}>
        © 1995 The Web Chronicle. All rights reserved. · <span className="link95">Back to top</span>
      </p>
    </div>
  ),
}

/** 未连接互联网时的错误页 */
export function offlinePage(nav: (url: string) => void) {
  return (
    <div className="page95" style={{ padding: '32px 40px' }}>
      <h2 style={{ fontSize: 20 }}>WebSurfer Alert</h2>
      <Hr />
      <p>
        <b>A network connection could not be established.</b>
      </p>
      <p style={{ marginTop: 8 }}>
        The Internet is a dial-up service. Please double-click{' '}
        <b>"Connect to the Internet"</b> on the desktop first, then return here.
      </p>
      <p style={{ marginTop: 12 }}>
        <span className="link95" onClick={() => nav('about:blank')}>
          Try again
        </span>
      </p>
    </div>
  )
}

export const FAKE_PAGES: FakePage[] = [galaxyPage, starpawPage, chroniclePage]

export const HOME_URL = galaxyPage.url

export function findPage(url: string): FakePage | undefined {
  return FAKE_PAGES.find(p => p.url === url)
}
