import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx'
import { toSrtTime } from './segmentUtils.js'

function speakerMap(recording) {
  return Object.fromEntries((recording.speakers ?? []).map(s => [s.id, s.name]))
}

export function buildTxt(recording) {
  const names = speakerMap(recording)
  return (recording.segments ?? [])
    .map(seg => {
      const name = names[seg.speakerId] ?? 'Sprecher'
      const time = toSrtTime(seg.startSec).replace(',', '.')
      return `[${time}] ${name}: ${seg.text}`
    })
    .join('\n\n')
}

export function buildSrt(recording) {
  return (recording.segments ?? [])
    .map((seg, i) =>
      `${i + 1}\n${toSrtTime(seg.startSec)} --> ${toSrtTime(seg.endSec)}\n${seg.text}\n`
    )
    .join('\n')
}

export async function buildDocxBlob(recording) {
  const names = speakerMap(recording)
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: recording.title, heading: HeadingLevel.HEADING_1 }),
        ...(recording.segments ?? []).map(seg => {
          const name = names[seg.speakerId] ?? 'Sprecher'
          const time = toSrtTime(seg.startSec)
          return new Paragraph({
            children: [
              new TextRun({ text: `[${time}] ${name}: `, bold: true, font: 'Courier New', size: 18 }),
              new TextRun({ text: seg.text, size: 20 }),
            ],
            spacing: { after: 120 },
          })
        }),
      ],
    }],
  })
  return Packer.toBlob(doc)
}

export function printPdf(recording) {
  const names = speakerMap(recording)
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>${recording.title}</title>
  <style>
    @media print { @page { margin: 2cm; } }
    body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.6; color: #000; max-width: 680px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 18pt; margin-bottom: 1.5rem; }
    .seg { margin-bottom: 1rem; }
    .meta { font-size: 9pt; font-family: monospace; color: #555; margin-bottom: 0.2rem; }
  </style>
</head>
<body>
  <h1>${recording.title}</h1>
  ${(recording.segments ?? []).map(seg => `
    <div class="seg">
      <div class="meta">[${toSrtTime(seg.startSec)}] ${names[seg.speakerId] ?? 'Sprecher'}</div>
      <div>${seg.text}</div>
    </div>
  `).join('')}
</body>
</html>`
  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 400)
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadText(text, filename) {
  downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), filename)
}
