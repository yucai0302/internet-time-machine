/** 记事本 —— 显示 Welcome.txt 等静态文档 */
export default function NotepadApp({ text }: { text: string }) {
  return (
    <div className="w95-font h-full bg-[#c0c0c0] p-1">
      <div className="bevel-thin-in h-full overflow-y-auto bg-white p-2">
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-black">{text}</pre>
      </div>
    </div>
  )
}

export const WELCOME_TEXT = `=================================================
   WELCOME TO TIMEOS 95  (Internet Time Machine)
=================================================

You have traveled back to November 8, 1995.

HOW TO EXPLORE:
  1. Double-click "Connect to the Internet"
     -> press CONNECT and listen to your modem!
  2. Double-click "WebSurfer 1.0"
     -> browse the World Wide Web (all 3 pages of it)
  3. Drag windows by their title bar.
     Close them with the [x] button.

TIPS:
  * The Internet is SLOW here. Pages load at
    28,800 bits per second. Please be patient!
  * When you are done, use the Start button ->
    "Return to Time Machine".

              -- The Management
`
