import type { PageState } from '../state'
import { AVATARS, BACKGROUNDS, COLOR_THEMES, DECORS } from '../components/GifDecor'
import { sound } from '../../../core/audio/sound'

interface Props {
  page: PageState
  patch: (p: Partial<PageState>) => void
  onDeleteEntry: (index: number) => void
  onClearGuestbook: () => void
  onResetCounter: () => void
}

/** 分组框 */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="gb2k" style={{ border: '1px solid #808080' }}>
      <legend className="gb2k-title px-1 text-[11px]">{title}</legend>
      {children}
    </fieldset>
  )
}

/** 编辑器面板：所有控件的修改实时写入 page 状态 */
export default function HomepageBuilder({ page, patch, onDeleteEntry, onClearGuestbook, onResetCounter }: Props) {
  const click = () => sound.click()
  const toggleGif = (id: string) => {
    click()
    patch({
      gifs: page.gifs.includes(id) ? page.gifs.filter(g => g !== id) : [...page.gifs, id],
    })
  }

  return (
    <div className="y2k-font h-full overflow-y-auto bg-[#d4d0c8] px-3 py-2">
      <div className="mb-1 text-[11px] font-bold text-[#0a246a]">✎ HomePage Studio 2000 — Edit Your Page</div>

      {/* 1. 标题 */}
      <Group title="1. Page Title">
        <label className="mb-0.5 block text-[10px] text-[#404040]">Title:</label>
        <input
          data-testid="inp-title"
          className="inp2k w-full"
          value={page.title}
          maxLength={60}
          onChange={e => patch({ title: e.target.value })}
        />
        <label className="mb-0.5 mt-2 block text-[10px] text-[#404040]">Subtitle:</label>
        <input
          className="inp2k w-full"
          value={page.subtitle}
          maxLength={80}
          onChange={e => patch({ subtitle: e.target.value })}
        />
      </Group>

      {/* 2. 关于我 */}
      <Group title="2. About Me & Avatar">
        <textarea
          data-testid="inp-intro"
          className="inp2k h-20 w-full resize-none"
          value={page.intro}
          maxLength={500}
          onChange={e => patch({ intro: e.target.value })}
        />
        <div className="mb-1 mt-2 text-[10px] text-[#404040]">Pick your avatar:</div>
        <div className="flex flex-wrap gap-1.5">
          {AVATARS.map(a => (
            <button
              key={a}
              onClick={() => {
                click()
                patch({ avatar: a })
              }}
              className={`bev-btn flex h-9 w-9 items-center justify-center text-[22px] ${
                page.avatar === a ? 'bev-in' : ''
              }`}
              style={page.avatar === a ? { outline: '2px solid #ff8c00' } : undefined}
              title={a}
            >
              {a}
            </button>
          ))}
        </div>
      </Group>

      {/* 3. 背景 */}
      <Group title="3. Background">
        <div className="grid grid-cols-3 gap-1.5">
          {BACKGROUNDS.map(b => (
            <button
              key={b.id}
              onClick={() => {
                click()
                patch({ background: b.id })
              }}
              className="bev-btn p-[3px]"
              style={page.background === b.id ? { outline: '2px solid #ff8c00' } : undefined}
            >
              <div className={`h-9 w-full ${b.className}`} />
              <div className="mt-0.5 text-center text-[9px] leading-3">{b.name}</div>
            </button>
          ))}
        </div>
      </Group>

      {/* 4. 主题配色 */}
      <Group title="4. Color Theme">
        <div className="flex flex-wrap gap-1.5">
          {COLOR_THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => {
                click()
                patch({ theme: t.id })
              }}
              className="bev-btn flex items-center gap-1 px-1.5 py-1"
              style={page.theme === t.id ? { outline: '2px solid #ff8c00' } : undefined}
            >
              <span className="inline-block h-3.5 w-3.5 border border-black" style={{ background: t.link }} />
              <span className="inline-block h-3.5 w-3.5 border border-black" style={{ background: t.accent }} />
              <span className="text-[9px]">{t.name}</span>
            </button>
          ))}
        </div>
      </Group>

      {/* 5. GIF 装饰 */}
      <Group title="5. Cool GIFs (click to add/remove)">
        <div className="grid grid-cols-3 gap-1.5">
          {DECORS.map(d => {
            const on = page.gifs.includes(d.id)
            return (
              <button
                key={d.id}
                onClick={() => toggleGif(d.id)}
                className="bev-btn flex flex-col items-center gap-1 p-1.5"
                style={on ? { outline: '2px solid #ff8c00' } : undefined}
              >
                <span className="flex h-11 items-center justify-center">{d.render()}</span>
                <span className="text-[9px] leading-3">{d.label}</span>
                <span className={`text-[8px] font-bold ${on ? 'text-[#008000]' : 'text-[#808080]'}`}>
                  {on ? '✓ ON' : 'OFF'}
                </span>
              </button>
            )
          })}
        </div>
      </Group>

      {/* 6. 特效开关 */}
      <Group title="6. Extras">
        <label className="flex cursor-pointer items-center gap-2 py-0.5">
          <input
            type="checkbox"
            data-testid="chk-uc"
            checked={page.underConstruction}
            onChange={e => {
              click()
              patch({ underConstruction: e.target.checked })
            }}
          />
          <span className="text-[11px]">Show "Under Construction" animation</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 py-0.5">
          <input
            type="checkbox"
            data-testid="chk-midi"
            checked={page.midi}
            onChange={e => {
              click()
              if (e.target.checked) sound.eraBlip('midi')
              patch({ midi: e.target.checked })
            }}
          />
          <span className="text-[11px]">Embed MIDI music ♫ (my_tune.mid)</span>
        </label>
      </Group>

      {/* 7. 访客计数器 */}
      <Group title="7. Visitor Counter">
        <div className="flex items-center gap-2">
          <span className="counter2k text-[16px]">{String(page.counter).padStart(7, '0')}</span>
          <button
            data-testid="btn-reset-counter"
            className="bev-btn px-2 py-1 text-[10px]"
            onClick={() => {
              click()
              onResetCounter()
            }}
          >
            Reset to 0
          </button>
        </div>
        <div className="mt-1 text-[9px] text-[#606060]">+1 per browser session, counts real visits.</div>
      </Group>

      {/* 8. 留言板管理 */}
      <Group title="8. Guestbook Manager">
        {page.guestbook.length === 0 && <div className="text-[10px] text-[#606060]">No entries. Visitors sign from your live page →</div>}
        <div className="max-h-36 overflow-y-auto">
          {page.guestbook.map((g, i) => (
            <div key={i} className="mb-1 flex items-start gap-1 bg-white px-1.5 py-1" data-testid="gb-manage-entry">
              <span className="min-w-0 flex-1">
                <span className="font-bold text-[#0a246a]">{g.name}</span>
                <span className="ml-1 text-[9px] text-gray-500">{g.date}</span>
                <div className="truncate text-[10px] text-black">{g.msg}</div>
              </span>
              <button
                data-testid="gb-delete"
                className="bev-btn px-1.5 py-0.5 text-[9px] text-[#a00]"
                onClick={() => {
                  click()
                  onDeleteEntry(i)
                }}
              >
                Del
              </button>
            </div>
          ))}
        </div>
        {page.guestbook.length > 0 && (
          <button
            className="bev-btn mt-1.5 px-2 py-1 text-[10px]"
            onClick={() => {
              click()
              onClearGuestbook()
            }}
          >
            Clear All Entries
          </button>
        )}
      </Group>

      <div className="py-3 text-center text-[9px] text-[#606060]">
        ※ All changes auto-save to this computer ※
      </div>
    </div>
  )
}
