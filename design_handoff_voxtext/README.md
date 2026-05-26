# Handoff: VoxText (Variante B · Studio)

## Overview
**VoxText** ist eine Web-App, die Audio- und Videodateien (sowie URLs zu YouTube/Vimeo) in Text transkribiert. Sie liefert Zeitstempel, Sprecher-Erkennung und Exporte in TXT / SRT / DOCX / PDF.

Diese Übergabe beschreibt **Variante B („Studio")** — die vom Stakeholder gewählte Richtung: eine professionelle Tool-Anwendung mit dunkler Sidebar (Bibliothek + Account), hellem Hauptbereich (Editor) und einem prominenten Player am unteren Rand.

## About the Design Files
Die Dateien in diesem Bundle sind **Design-Referenzen in HTML / React (Babel)** — Prototypen, die das angestrebte Look-and-Feel und Verhalten zeigen. Sie sind **kein** Production-Code, der 1:1 übernommen werden soll.

Die Aufgabe ist es, diese HTML-Mockups in der bestehenden Codebasis (React/Next, Vue, etc.) mit den vorhandenen Patterns und Bibliotheken **nachzubauen**. Falls noch keine Codebasis existiert, sollte das passendste Framework gewählt werden (Empfehlung: Next.js + Tailwind oder Vite + React).

Die HTML-Datei `source/preview-variant-b.html` lokal im Browser öffnen, um die Designs „live" zu sehen. `source/variant-b-studio.jsx` enthält die exakten Strukturen und Inline-Styles.

## Fidelity
**Hi-fi.** Pixel-genaue Mockups mit finalen Farben, Typografie, Spacing und Komponenten-Details. Hover/Active-Zustände sind teilweise als statische Varianten angedeutet — Entwickler sollten sie konsistent ergänzen.

## Design Tokens

### Farben
| Token | Hex | Verwendung |
|---|---|---|
| `--vx-orange` | `#E84F1C` | Primäre Akzentfarbe (CTAs, aktive Zustände, Sprecher B, Highlights) |
| `--vx-orange-soft` | `#FDE7DD` | Hintergrund für aktiv markierte Segmente |
| `--vx-ink` | `#0E0E0E` | Primärtext, sekundäre Buttons, Player-Hintergrund |
| `--vx-ink-2` | `#1A1A1A` | Sidebar aktiver Eintrag, Player-Sub-Buttons |
| `--vx-sidebar-bg` | `#0B0B0B` | Sidebar-Hintergrund |
| `--vx-sidebar-divider` | `#1A1A1A` | Trennlinien innerhalb der Sidebar |
| `--vx-sidebar-text` | `#E5E5E5` | Primärtext in der Sidebar |
| `--vx-sidebar-muted` | `#6B6B6B` | Sekundärtext in der Sidebar |
| `--vx-paper` | `#FFFFFF` | Karten, Top-Bar im Hauptbereich |
| `--vx-cream` | `#FAF8F4` | Hauptbereich-Hintergrund |
| `--vx-line` | `#E6E4DF` | Trennlinien im hellen Bereich |
| `--vx-line-2` | `#EDE9E1` | Subtilere Trennlinien innerhalb von Karten |
| `--vx-muted` | `#6B6B6B` | Sekundärtext im hellen Bereich |
| `--vx-muted-2` | `#8A8A8A` | Tertiärtext, Captions |
| `--vx-success` | `#1B8C5A` | Status-Dot „Synchronisiert" / „Abgeschlossen" |
| `--vx-waveform-played` | `#E84F1C` | Bereits abgespielter Wellenform-Teil |
| `--vx-waveform-unplayed` | `#3A3A3A` | Ungespielter Wellenform-Teil (auf dunklem Player) |
| `--vx-waveform-light` | `#D9D6CE` | Wellenform-Bars auf hellem Hintergrund |

### Typografie
- **Sans:** `Geist` (300, 400, 500, 600, 700) — Standard für alles
- **Mono:** `Geist Mono` (400, 500) — Zeitstempel, Metadaten, Tasten-Shortcuts, KPI-Zahlen

| Token | Größe / Weight | Verwendung |
|---|---|---|
| `text-xs` | 10.5px / 400 | Sub-Labels, Caps-Tracking-Headlines (mit `letter-spacing: 0.14em`, uppercase) |
| `text-mono-sm` | 11px / 400 (Mono) | Zeitstempel, Sub-Metadaten |
| `text-sm` | 12.5px / 400 | Sekundärtext, Captions |
| `text-base` | 13px / 400 | Body-Text, Buttons, Sidebar-Items |
| `text-md` | 14px / 400 | Transkript-Text |
| `text-lg` | 15px / 500 | Page-Titel in Top-Bar |
| `text-xl` | 22px / 500 (mit `letter-spacing: -0.01em`) | Hero-Headline auf Upload-Screen |

### Spacing
4px-Grid. Häufig verwendet: `4`, `6`, `8`, `10`, `14`, `16`, `18`, `20`, `24`, `28`, `32`, `48`, `56`.

### Border Radius
| Token | Wert | Verwendung |
|---|---|---|
| `radius-sm` | 3-4px | Tasten-Shortcuts (kbd), Format-Pills, Buttons in der Top-Bar |
| `radius-md` | 5-6px | Buttons, Card-Tabs, Sidebar-Items |
| `radius-lg` | 8px | Hauptkarten (Transkript-Container, Notiz-Karten) |
| `radius-xl` | 10px | Drop-Zone auf Upload-Screen |
| `radius-full` | 50% | Avatare, Player-Buttons |

### Shadows
Sehr zurückhaltend. Hauptsächlich `border: 1px solid var(--vx-line)` statt Shadows.

## Layout-Struktur (gilt für beide Screens)

```
┌────────────────────────────────────────────────────────────┐
│ Sidebar (280px, #0B0B0B)  │ Main (flex:1, #FAF8F4)        │
│                            ├────────────────────────────────┤
│   Logo                     │ Top-Bar (62px, #FFFFFF)       │
│   ─────                    │                                │
│   [+ Neue Transkription]   │                                │
│   🔍 Suchen                │ Content                        │
│                            │                                │
│   BIBLIOTHEK               │                                │
│   • Item 1                 │                                │
│   • Item 2 (aktiv)         │                                │
│   • …                      │                                │
│   ─────                    │                                │
│                            │                                │
│   👤 User · Plan           │                                │
└────────────────────────────────────────────────────────────┘
```

- **Sidebar:** 280px fix breit, volle Höhe, dunkel.
- **Main-Bereich:** Flexibel, hell, mit eigener Top-Bar (62px) und scrollbarem Inhalt.
- **Auf Transcript-Screen:** unten zusätzlich ein **dunkler Player** (≈ 76px) mit Waveform.

---

## Screen 1 — Upload (Neue Transkription)

### Zweck
Quelle wählen: Datei hochladen / URL einfügen / (zukünftig) aufnehmen — und Transkriptions-Optionen vorab einstellen.

### Sidebar (gleich auf beiden Screens)
- **Logo-Block (oben):** orange Box 26×26px (radius 6px), darin weißes Wellen-Icon (5 vertikale Striche unterschiedlicher Höhe). Daneben „VoxText" (600, 14px, weiß) + „Studio" (400, 14px, #6B6B6B).
- **Primärer CTA:** Button „+ Neue Transkription" — `background: #E84F1C`, weißer Text, radius 6px, padding 11×14px, Plus-Icon links.
- **Suchfeld:** Lupen-Icon + Input („Durchsuchen…") — transparent auf Sidebar.
- **Section-Label:** „BIBLIOTHEK" — 10.5px, letter-spacing 0.14em, uppercase, `#6B6B6B`.
- **Bibliotheks-Items (Liste):** Jedes Item:
  - Titel (13px, `#D0D0D0`, 500 wenn aktiv)
  - Meta-Zeile (11px Mono, `#6B6B6B`): Datum links, Dauer rechts.
  - **Aktiver Eintrag:** Hintergrund `#1A1A1A`, radius 5px, 2px breiter orange Strich am linken Rand.
- **User-Block (unten):** Avatar 28px (Initialen auf #E84F1C), Name + Plan, Drei-Punkte-Menü rechts. Border-Top `#1A1A1A`.

### Top-Bar (Hauptbereich)
- Höhe 62px, Hintergrund weiß, Border-Bottom `#E6E4DF`, Padding 18×32px.
- **Links:** „Neue Transkription" (13px, `#6B6B6B`).
- **Rechts:** Tastenkürzel-Hinweis: `<kbd>⌘N</kbd>` (Mono, weißer Hintergrund, 1px border) + „für neue Aufnahme".

### Mode-Tabs (Pillen-Toggle)
- Container: weiß, 1px border, radius 8px, padding 4px, drei Buttons:
  - **Datei** (aktiv) — schwarzer Hintergrund, weißer Text, radius 5px, padding 9×18px
  - **URL einfügen** — transparent, schwarzer Text
  - **Aufnehmen** — disabled, mit kleinem „BALD"-Badge (cream Hintergrund, 9.5px)

### Drop-Zone (Hauptelement)
- Karte 640px breit, weiß, 2px dashed `#D9D6CE`, radius 10px, padding 56×40px, zentriert.
- **Icon:** 64×64px schwarze Box (radius 14px), darin Datei-Icon mit orangem Stroke (1.6px).
- **Headline:** „Datei hierher ziehen" (22px, 500, letter-spacing -0.01em).
- **Subtitle:** „oder per Klick auswählen" (13.5px, `#6B6B6B`).
- **Button:** „Datei auswählen" — `#E84F1C` Hintergrund, weiß, radius 6px, padding 12×28px.
- **Format-Reihe (unten):** Zwei Gruppen nebeneinander:
  - „Audio" Label (orange, 500) + Chips: `MP3 WAV M4A FLAC`
  - „Video" Label (schwarz, 500) + Chips: `MP4 MOV MKV WEBM`
  - Chips: 10.5px Mono, cream Hintergrund, padding 2×7, radius 3.

### Options-Grid (unter Drop-Zone)
- 640px breit, 3 Spalten, gap 10px, jede Karte:
  - **Label** (10.5px, Caps, `#8A8A8A`)
  - **Value** (13px, 500, schwarz)
  - Chevron-down rechts
  - Weiß, 1px border, radius 6px, padding 10×14px
- Default-Werte: „Sprache: Auto-Erkennung" · „Sprecher: 2 erwartet" · „Zeitstempel: Pro Satz"

### Interaktionen (Upload-Screen)
- Tabs klickbar → wechseln zwischen Datei / URL / Aufnehmen (letzteres disabled).
- Drop-Zone:
  - Hover/Drag-over: border-color → `#E84F1C`, background → `#FDF1EB`.
  - Klick → öffnet nativen File-Picker.
  - Drop → startet Upload, geht zu „Processing"-State (siehe State Management).
- Options-Karten klickbar → öffnen Dropdown mit Auswahl.
- CTA-Button: Hover → background `#D14416` (-10% lightness).

---

## Screen 2 — Transcript (Bibliothek / [Item])

### Sidebar
Identisch zu Screen 1. Aktiver Eintrag: „Interview Lukas Müller" (oder das aktuell offene Item).

### Top-Bar
- 62px hoch, weiß.
- **Links:**
  - Breadcrumb (11px, `#8A8A8A`): „Bibliothek / Interviews"
  - Titel (15px, 500): „Interview Lukas Müller"
- **Rechts (3 Elemente, gap 8px):**
  - **Export-Button** (sekundär): weiß, 1px border, radius 5px. Inhalt: Download-Icon + „Export" + kleines Pill `TXT · SRT · DOCX · PDF` (10px Mono, cream Hintergrund).
  - **Bearbeiten-Button** (primär): schwarz, weißer Text, radius 5px.

### Content-Bereich
Zwei Spalten, gap 24px, Padding 24×32px, voll überlappende Höhe.

#### Linke Spalte (flex:1) — Transkript-Karte
- Weiß, 1px border `#E6E4DF`, radius 8px.
- **Tab-Leiste (oben):** Padding 10×16, Border-Bottom `#EDE9E1`, 12px Text:
  - „Transkript" (aktiv: schwarz/500, 2px orange Underline)
  - „Zusammenfassung" / „Kapitel" / „Sprecher (2)" (grau)
  - Rechts: Status-Dot grün + „Synchronisiert" (11px, `#8A8A8A`)
- **Transkript-Liste:** Padding 14×20.
  - **Jedes Segment** ist eine Zeile mit:
    - **Avatar-Bubble** 26×26 (radius 50%): Sprecher A → schwarz, Sprecher B → orange. Initial weiß, 11px, 600.
    - **Header-Zeile:** Name (12.5px, 500) + Zeitstempel (10.5px Mono, `#8A8A8A`).
    - **Text:** 14px, line-height 1.55, `#1A1A1A`.
  - **Aktives Segment** (gerade abgespielt): Hintergrund `#FDF1EB`, radius 5px.
  - Gap zwischen Segmenten: 2px.

#### Rechte Spalte (240px fix) — Sidebar mit Karten

**Statistik-Karte** (weiß, 1px border, radius 8px, padding 14×16):
- Label „STATISTIK" (10.5px Caps tracked)
- Key-Value-Zeilen (12.5px): Dauer / Wörter / Sprecher / Sprache. Value rechtsbündig in Mono.

**Lesezeichen-Karte** (flex:1):
- Label „LESEZEICHEN"
- Liste von Marken: 2px breiter oranger Strich links + Zeitstempel (10.5px Mono) + Label (12.5px). Trennlinien zwischen Einträgen.

### Player-Leiste (unten, voll breit)
- Border-Top `#E6E4DF`, Padding 14×32, Hintergrund `#0E0E0E`, weißer Text.
- **Transport (links):** 3 runde Buttons:
  - Skip-back (32×32, `#1A1A1A`)
  - Play (36×36, `#E84F1C`, weißes Dreieck)
  - Skip-forward (32×32, `#1A1A1A`)
- **Zeit:** „00:00:48 / 48:13" (11px Mono, weiß / `#5A5A5A`).
- **Wellenform (flex:1, Höhe 44px):**
  - 160 Bars, gap 1.5px, deterministische Höhen (Sinus-Mischung).
  - Bereits gespielte Bars: `#E84F1C`, ungespielte: `#3A3A3A`.
  - Unter den Bars: Timeline-Ticks („00:00 · 10:00 · 20:00 · 30:00 · 40:00 · 48:00", 9.5px Mono, `#5A5A5A`).
- **Rechts:** Speed-Toggle „1.0×" (Mono, schwarzer Button mit weißem Text) + Volume-Icon.

### Interaktionen (Transcript-Screen)
- **Sidebar-Items:** Klick → lädt anderes Transkript.
- **Tabs:** Klick → wechselt zwischen Transkript / Zusammenfassung / Kapitel / Sprecher.
- **Segment-Klick:** springt im Player zum Zeitstempel + scrollt das Segment ins Sichtfeld + setzt aktiven Highlight.
- **Hover über Segment:** kleine Action-Icons (Bearbeiten / Lesezeichen setzen / Kopieren) erscheinen rechts.
- **Player:**
  - Play/Pause toggelt Icon.
  - Wellenform klickbar → Scrub auf Position.
  - Während Abspielens: aktives Segment im Transkript synchron updated.
- **Export-Button:** öffnet Dropdown mit den 4 Formaten + „Optionen…" (Zeitstempel ein/aus, Sprecher-Namen, etc.).
- **Bearbeiten-Button:** schaltet Inline-Editing für Segment-Texte und Sprecher-Namen frei.
- **Suche** (⌘F): Inline-Suche im Transkript mit Highlight + n/m-Counter.

---

## State Management

### Globaler App-State
```ts
type Recording = {
  id: string
  title: string
  createdAt: string
  durationSec: number
  language: string
  speakers: Speaker[]
  segments: Segment[]
  bookmarks: Bookmark[]
  status: 'uploading' | 'processing' | 'ready' | 'error'
  progress?: number   // 0-100 wenn uploading/processing
}

type Speaker = { id: string; name: string; colorIndex: 0 | 1 }   // 0 = schwarz, 1 = orange

type Segment = {
  id: string
  speakerId: string
  startSec: number
  endSec: number
  text: string
}

type Bookmark = { id: string; atSec: number; label: string }
```

### Upload-Screen State
- `mode: 'file' | 'url' | 'record'`
- `file: File | null` / `url: string`
- `options: { language: 'auto' | string; speakers: number; timestamps: 'sentence' | 'word' | 'paragraph' | 'none' }`
- `dragActive: boolean`
- Beim Drop / Klick „Datei auswählen" → POST `/api/transcribe`, Rückgabe `recordingId`, Routing zu Processing-View dann Transcript-View.

### Transcript-Screen State
- `currentRecording: Recording`
- `playback: { playing: boolean; positionSec: number; speed: 1 | 1.25 | 1.5 | 2 }`
- `activeSegmentId: string` — abgeleitet aus `positionSec` (Binary Search über Segments).
- `activeTab: 'transcript' | 'summary' | 'chapters' | 'speakers'`
- `searchQuery: string`
- `editMode: boolean`
- `exportMenuOpen: boolean`

### Datenfluss
- **Player → Transkript:** Während `playing`, ein `requestAnimationFrame`-Loop updated `positionSec`; `activeSegmentId` neu berechnet → CSS-Klasse auf entsprechendem Segment.
- **Segment-Klick → Player:** Setzt `positionSec` auf `segment.startSec`.

## Animationen & Transitions
- **Tab-Wechsel:** 150ms ease-out für Underline-Position.
- **Aktives Segment:** Hintergrund-Wechsel mit 200ms ease.
- **Hover-Aktionen auf Segment:** Opacity 0 → 1 in 120ms.
- **Player Play/Pause-Icon:** Cross-Fade 100ms.
- **Drop-Zone Dragover:** Border + Background-Transition 150ms.
- Generell zurückhaltend — keine springenden Effekte.

## Responsive Verhalten
- **Desktop (≥1280px):** Layout wie beschrieben.
- **Tablet (768-1279px):** Sidebar → 220px; rechte Spalte (Stats/Lesezeichen) kollabierbar in Tab; Player-Wellenform behält volle Breite.
- **Mobile (<768px):** Sidebar → Off-Canvas (Hamburger oben); rechte Spalte verschwindet; Player vereinfacht (nur Play + Zeit + scrub-fähige Wellenform); Transkript-Karte volle Breite.

## Empfohlener Tech-Stack
- **Framework:** Next.js (App Router) + React 18
- **Styling:** Tailwind CSS (Design Tokens als CSS-Variablen in `globals.css`)
- **Komponenten:** shadcn/ui für Buttons/Dropdowns/Dialogs als Basis, eigene Komponenten für Player & Waveform
- **Wellenform-Rendering:** `wavesurfer.js` (regions plugin für Sprecher-Marker) **oder** custom canvas/SVG (für volle Design-Kontrolle, wie im Mock)
- **Transkriptions-API:** OpenAI Whisper, AssemblyAI, oder Deepgram (alle liefern Wort-Level Timestamps + Diarization)
- **State:** Zustand oder Jotai für Player-State; React Query für Recording-Daten

## Files (in diesem Bundle)
- `README.md` — diese Datei
- `source/variant-b-studio.jsx` — vollständige React-Komponenten der zwei Screens, mit allen Inline-Styles als Referenz für Werte
- `source/preview-variant-b.html` — eigenständige HTML-Datei zum lokalen Öffnen (skaliert beide Screens auf Browserbreite)
- `source/index-full-exploration.html` — die vollständige Design-Exploration mit allen 4 Varianten (A/B/C/D), zur Kontext-Referenz

## Offene Punkte (vor Implementierung klären)
1. **Backend:** Welche Transkriptions-API wird genutzt? Selbst gehostet (Whisper) oder Cloud?
2. **Auth:** Welches Auth-System? (Beeinflusst User-Block in Sidebar.)
3. **Storage:** Wo werden Originaldateien + Transkripte gespeichert? (S3 / Supabase / etc.)
4. **Datenschutz:** DSGVO-Anforderungen — werden Audiodateien nach Transkription gelöscht?
5. **Limits:** Maximale Dateigröße und Dauer pro Upload?
6. **Sprecher-Erkennung:** Genauigkeit der Diarization-API klären — Sprecher-Namen sind in Mocks vorgegeben, in der Realität müssten Nutzer sie nach Erstellung benennen.
7. **Echtzeit-Sync:** Wenn mehrere Browser-Tabs offen sind, soll Bearbeitung live syncen? (Beeinflusst Statusanzeige „Synchronisiert".)
8. **Fehlende Screens:** Leerer Zustand (Bibliothek leer), Processing-View, Fehler-States, Einstellungen, Export-Dialog — werden im nächsten Design-Sprint nachgeliefert.

## Assets
Keine externen Assets — alle Icons sind inline SVGs in der `variant-b-studio.jsx` (Stroke-Width 1.6-2px). Schriftarten via Google Fonts (Geist Familie).

Für Production sollten Icons aus einer einheitlichen Library (z.B. Lucide oder Phosphor) bezogen werden.
