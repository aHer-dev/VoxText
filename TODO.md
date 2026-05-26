# VoxTex — Feature-Roadmap

## Priorität 1 — Sofort nützlich für Lehrkräfte

### KI-Prompt Generator (Bewertungshilfe)
- Transkript wird in einen kopierbaren Prompt verwandelt
- Nutzer wählt Bewertungskontext (z.B. Referat, Präsentation, Diskussion, Prüfungsgespräch)
- Optionale Eingabe: Bewertungskriterien (z.B. Inhalt 40%, Sprache 30%, Struktur 30%)
- Ergebnis: fertiger Prompt → "Kopieren"-Button → in ChatGPT / Claude einfügen
- Prompt-Vorlagen je Fach (Deutsch, Englisch, Geschichte, …)
- Kein API-Key nötig, alles clientseitig

Beispiel-Output:
> "Bitte bewerte das folgende Schülerreferat anhand dieser Kriterien:
> Inhalt (40%): Vollständigkeit, Richtigkeit
> Sprache (30%): Ausdruck, Grammatik
> Struktur (30%): Roter Faden, Einleitung/Schluss
>
> Transkript: [...]"

---

## Priorität 2 — Technische Verbesserungen

### Cloudflare Pages Deployment
- `public/_headers` Datei mit COOP/COEP-Headern
- Git-Repository einrichten
- Kollegen können App ohne Installation nutzen

### URL-Transkription (YouTube / Links)
- Tab "URL" aktivieren (aktuell als "Demnächst" gesperrt)
- Audio via yt-dlp oder ähnlichem extrahieren (server-seitig nötig)
- Alternative: direkt mit MediaStream falls öffentlich zugänglich

### Mikrofon-Aufnahme
- Tab "Aufnehmen" aktivieren
- MediaRecorder API → direkt in Transkriptions-Flow
- Live-Aufnahme von Schülerpräsentationen möglich

---

## Priorität 3 — Komfort & Export

### Schnellere Transkription (optional, opt-in)
- OpenAI Whisper API als optionaler Modus
- Klarer Hinweis: "Audio wird an OpenAI übermittelt — nicht für Schülerdaten"
- Für eigene Notizen ca. 10× schneller

### Zusammenfassung per Prompt
- Ähnlich wie Bewertungshelfer: Zusammenfassungs-Prompt kopierbar machen
- Kapitel automatisch vorschlagen (via Prompt → KI-Output manuell einfügen)

### Exportverbesserungen
- PDF: sauberes Print-CSS (aktuell rudimentär)
- DOCX: Sprechernamen als Überschriften
- CSV-Export für Zeitstempel-Analysen

---

## Ideen / Langfristig

- Mehrere Dateien gleichzeitig (Batch-Transkription)
- Notizen-Feld pro Transkript
- Lesezeichen exportierbar
- Farbkodierung pro Sprecher wählbar
- Schul-/Klassenordner (mehrere Transkripte gruppieren)
- Offline-PWA (App installierbar auf Schullaptops)
