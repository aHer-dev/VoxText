// Variant B — Studio (dark sidebar, pro tool)
// Black sidebar with file list, light center, prominent waveform.

const bW = 1280, bH = 820;

function StudioLogo() {
  return (
    <div style={{display:'flex',alignItems:'center',gap:9,fontFamily:'Geist, sans-serif'}}>
      <div style={{width:26,height:26,background:'#E84F1C',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
          <path d="M3 4v6M6 2v10M9 5v4M12 3v8"/>
        </svg>
      </div>
      <div style={{color:'#fff',fontWeight:600,fontSize:14,letterSpacing:'-0.01em'}}>VoxText <span style={{color:'#6b6b6b',fontWeight:400,marginLeft:4}}>Studio</span></div>
    </div>
  );
}

function StudioSidebar({ activeId }) {
  const items = [
    { id:'i1', title:'Interview Lukas Müller', meta:'Heute · 18:22', dur:'48:13', active: activeId==='i1' },
    { id:'i2', title:'Vorlesung — Anatomie III', meta:'Gestern', dur:'1:24:07' },
    { id:'i3', title:'Team Standup 24.10.', meta:'24. Okt', dur:'12:48' },
    { id:'i4', title:'Podcast Spektrum #14', meta:'22. Okt', dur:'32:14' },
    { id:'i5', title:'Brainstorm Q4 Roadmap', meta:'19. Okt', dur:'56:30' },
    { id:'i6', title:'Patientengespräch Reha', meta:'17. Okt', dur:'22:09' },
  ];
  return (
    <aside style={{width:280,background:'#0B0B0B',color:'#e5e5e5',display:'flex',flexDirection:'column',fontFamily:'Geist, sans-serif',borderRight:'1px solid #1a1a1a'}}>
      <div style={{padding:'20px 20px 18px',borderBottom:'1px solid #1a1a1a'}}>
        <StudioLogo />
      </div>

      <button style={{margin:'16px 20px 8px',background:'#E84F1C',border:0,color:'#fff',padding:'11px 14px',borderRadius:6,fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
        Neue Transkription
      </button>

      <div style={{padding:'18px 20px 8px',display:'flex',alignItems:'center',gap:8}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input placeholder="Durchsuchen…" style={{background:'transparent',border:0,outline:0,color:'#e5e5e5',fontSize:13,fontFamily:'inherit',flex:1}}/>
      </div>

      <div style={{padding:'14px 20px 6px',fontSize:10.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'#6b6b6b'}}>Bibliothek</div>

      <div style={{flex:1,overflow:'hidden',padding:'0 8px'}}>
        {items.map(it => (
          <div key={it.id} style={{padding:'10px 12px',borderRadius:5,marginBottom:1,background: it.active?'#1a1a1a':'transparent',cursor:'pointer',position:'relative'}}>
            {it.active && <span style={{position:'absolute',left:0,top:8,bottom:8,width:2,background:'#E84F1C',borderRadius:1}}/>}
            <div style={{fontSize:13,color: it.active?'#fff':'#d0d0d0',fontWeight:it.active?500:400,marginBottom:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.title}</div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#6b6b6b',fontFamily:'"Geist Mono", monospace'}}>
              <span>{it.meta}</span><span>{it.dur}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:'14px 20px',borderTop:'1px solid #1a1a1a',display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:28,height:28,borderRadius:'50%',background:'#E84F1C',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600}}>JS</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12.5,color:'#fff'}}>Jan Schmid</div>
          <div style={{fontSize:11,color:'#6b6b6b'}}>Pro · 2,4/10 Std</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.6"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </div>
    </aside>
  );
}

// ---------- B1: Upload ----------
function VariantB_Upload() {
  return (
    <div style={{width:bW,height:bH,background:'#0B0B0B',display:'flex',fontFamily:'Geist, sans-serif'}}>
      <StudioSidebar activeId="none" />

      <main style={{flex:1,background:'#FAF8F4',display:'flex',flexDirection:'column'}}>
        {/* Top bar */}
        <div style={{padding:'18px 32px',borderBottom:'1px solid #E6E4DF',display:'flex',alignItems:'center',justifyContent:'space-between',height:62}}>
          <div style={{fontSize:13,color:'#6B6B6B'}}>Neue Transkription</div>
          <div style={{display:'flex',gap:8,fontSize:12,color:'#6B6B6B'}}>
            <kbd style={{background:'#fff',border:'1px solid #E6E4DF',borderRadius:3,padding:'2px 6px',fontFamily:'"Geist Mono", monospace',fontSize:11}}>⌘N</kbd>
            <span style={{padding:'2px 0'}}>für neue Aufnahme</span>
          </div>
        </div>

        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:48}}>
          {/* Mode tabs */}
          <div style={{display:'flex',background:'#fff',border:'1px solid #E6E4DF',borderRadius:8,padding:4,marginBottom:36,gap:2}}>
            {[['Datei','file',true],['URL einfügen','url',false],['Aufnehmen','rec',false,true]].map(([label,id,active,disabled]) => (
              <button key={id} style={{padding:'9px 18px',borderRadius:5,border:0,background:active?'#0E0E0E':'transparent',color:active?'#fff':disabled?'#b8b8b8':'#0E0E0E',fontSize:13,fontWeight:active?500:400,cursor:disabled?'default':'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:7}}>
                {label}
                {disabled && <span style={{fontSize:9.5,background:'#EDE9E1',color:'#8a8a8a',padding:'1px 5px',borderRadius:3,letterSpacing:'0.04em',marginLeft:2}}>BALD</span>}
              </button>
            ))}
          </div>

          {/* Drop zone — large, central */}
          <div style={{width:640,background:'#fff',border:'2px dashed #D9D6CE',borderRadius:10,padding:'56px 40px',textAlign:'center'}}>
            <div style={{margin:'0 auto 24px',width:64,height:64,borderRadius:14,background:'#0E0E0E',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E84F1C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M8 15V9l4 3 4-3v6"/>
              </svg>
            </div>
            <div style={{fontSize:22,fontWeight:500,marginBottom:8,letterSpacing:'-0.01em'}}>Datei hierher ziehen</div>
            <div style={{fontSize:13.5,color:'#6B6B6B',marginBottom:24}}>oder per Klick auswählen</div>
            <button style={{background:'#E84F1C',color:'#fff',border:0,borderRadius:6,padding:'12px 28px',fontSize:13.5,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Datei auswählen</button>

            <div style={{marginTop:32,display:'flex',justifyContent:'center',gap:24,fontSize:11.5,color:'#8a8a8a'}}>
              {[['MP3','WAV','M4A','FLAC'],['MP4','MOV','MKV','WEBM']].map((row,i) => (
                <div key={i} style={{display:'flex',gap:6}}>
                  <span style={{color:i===0?'#E84F1C':'#0E0E0E',fontWeight:500,marginRight:2}}>{i===0?'Audio':'Video'}</span>
                  {row.map(f => <span key={f} style={{padding:'2px 7px',background:'#FAF8F4',borderRadius:3,fontFamily:'"Geist Mono", monospace',fontSize:10.5}}>{f}</span>)}
                </div>
              ))}
            </div>
          </div>

          {/* Options row */}
          <div style={{width:640,marginTop:24,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
            {[
              ['Sprache','Auto-Erkennung'],
              ['Sprecher','2 erwartet'],
              ['Zeitstempel','Pro Satz'],
            ].map(([label,val],i) => (
              <div key={i} style={{background:'#fff',border:'1px solid #E6E4DF',borderRadius:6,padding:'10px 14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:10.5,letterSpacing:'0.1em',color:'#8a8a8a',textTransform:'uppercase',marginBottom:2}}>{label}</div>
                  <div style={{fontSize:13,color:'#0E0E0E',fontWeight:500}}>{val}</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------- B2: Transcript ----------
function VariantB_Transcript() {
  const segs = [
    { t:'00:00:04', sp:'A', name:'Moderator', text:'Willkommen zum Spektrum Podcast. Heute sprechen wir über die Zukunft der Physiotherapie.' },
    { t:'00:00:21', sp:'B', name:'Dr. Kessler', text:'Vielen Dank für die Einladung. Was ich besonders spannend finde, ist die Verschmelzung von klassischer Manualtherapie und datengetriebener Rehabilitation.' },
    { t:'00:00:42', sp:'A', name:'Moderator', text:'Können Sie ein konkretes Beispiel geben?' },
    { t:'00:00:48', sp:'B', name:'Dr. Kessler', text:'Nehmen Sie die Schulterrehabilitation nach einer Rotatorenmanschettenruptur. Vor zehn Jahren hat man nach Gefühl entschieden, wann ein Patient die nächste Belastungsstufe verträgt.' },
    { t:'00:01:12', sp:'B', name:'Dr. Kessler', text:'Heute haben wir tragbare Sensoren, die Bewegungsamplitude und Symmetrie in Echtzeit messen.' },
  ];
  return (
    <div style={{width:bW,height:bH,background:'#0B0B0B',display:'flex',fontFamily:'Geist, sans-serif'}}>
      <StudioSidebar activeId="i1" />

      <main style={{flex:1,background:'#FAF8F4',display:'flex',flexDirection:'column'}}>
        {/* Top bar */}
        <div style={{padding:'14px 32px',borderBottom:'1px solid #E6E4DF',display:'flex',alignItems:'center',justifyContent:'space-between',height:62,background:'#fff'}}>
          <div>
            <div style={{fontSize:11,color:'#8a8a8a',marginBottom:3}}>Bibliothek / Interviews</div>
            <div style={{fontSize:15,fontWeight:500,color:'#0E0E0E'}}>Interview Lukas Müller</div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button style={{background:'#fff',border:'1px solid #E6E4DF',borderRadius:5,padding:'7px 12px',fontSize:12,cursor:'pointer',fontFamily:'inherit',color:'#0E0E0E',display:'flex',alignItems:'center',gap:6}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0E0E0E" strokeWidth="1.8"><path d="M12 16V4M12 4l-4 4M12 4l4 4"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/></svg>
              <span>Export</span>
              <span style={{marginLeft:6,padding:'1px 5px',background:'#FAF8F4',borderRadius:2,fontSize:10,fontFamily:'"Geist Mono", monospace'}}>TXT · SRT · DOCX · PDF</span>
            </button>
            <button style={{background:'#0E0E0E',color:'#fff',border:0,borderRadius:5,padding:'8px 14px',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Bearbeiten</button>
          </div>
        </div>

        {/* Transcript */}
        <div style={{flex:1,overflow:'hidden',padding:'24px 32px',display:'flex',gap:24}}>
          <div style={{flex:1,background:'#fff',border:'1px solid #E6E4DF',borderRadius:8,padding:'8px 8px 8px 8px',display:'flex',flexDirection:'column'}}>
            <div style={{padding:'10px 16px 8px',display:'flex',gap:14,borderBottom:'1px solid #EDE9E1',fontSize:12,color:'#6B6B6B'}}>
              <span style={{color:'#0E0E0E',fontWeight:500,position:'relative',paddingBottom:8}}>Transkript<span style={{position:'absolute',left:0,right:0,bottom:-9,height:2,background:'#E84F1C'}}/></span>
              <span style={{paddingBottom:8}}>Zusammenfassung</span>
              <span style={{paddingBottom:8}}>Kapitel</span>
              <span style={{paddingBottom:8}}>Sprecher (2)</span>
              <span style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#8a8a8a'}}>
                <span style={{width:6,height:6,background:'#1B8C5A',borderRadius:'50%'}}/> Synchronisiert
              </span>
            </div>
            <div style={{flex:1,overflow:'hidden',padding:'14px 20px 14px'}}>
              {segs.map((s,i) => (
                <div key={i} style={{display:'flex',gap:14,padding:'10px 6px',borderRadius:5,background: i===3?'#FDF1EB':'transparent',marginBottom:2}}>
                  <div style={{width:26,height:26,borderRadius:'50%',background: s.sp==='A'?'#0E0E0E':'#E84F1C',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,flexShrink:0,marginTop:2}}>{s.sp}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',gap:10,alignItems:'baseline',marginBottom:3}}>
                      <span style={{fontSize:12.5,fontWeight:500,color:'#0E0E0E'}}>{s.name}</span>
                      <span style={{fontSize:10.5,fontFamily:'"Geist Mono", monospace',color:'#8a8a8a'}}>{s.t}</span>
                    </div>
                    <p style={{margin:0,fontSize:14,lineHeight:1.55,color:'#1a1a1a'}}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right pane: notes */}
          <div style={{width:240,display:'flex',flexDirection:'column',gap:14}}>
            <div style={{background:'#fff',border:'1px solid #E6E4DF',borderRadius:8,padding:'14px 16px'}}>
              <div style={{fontSize:10.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'#8a8a8a',marginBottom:10}}>Statistik</div>
              {[['Dauer','48:13'],['Wörter','6 248'],['Sprecher','2'],['Sprache','Deutsch']].map(([k,v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',fontSize:12.5}}>
                  <span style={{color:'#6B6B6B'}}>{k}</span><span style={{color:'#0E0E0E',fontFamily:'"Geist Mono", monospace'}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',border:'1px solid #E6E4DF',borderRadius:8,padding:'14px 16px',flex:1}}>
              <div style={{fontSize:10.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'#8a8a8a',marginBottom:10}}>Lesezeichen</div>
              {[['00:04:12','Hauptthese'],['00:18:30','Studie zitiert'],['00:31:08','Patientenbeispiel']].map(([t,l],i) => (
                <div key={i} style={{display:'flex',gap:8,padding:'7px 0',borderBottom:i<2?'1px solid #EDE9E1':0}}>
                  <span style={{width:2,background:'#E84F1C',borderRadius:1}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:10.5,fontFamily:'"Geist Mono", monospace',color:'#8a8a8a'}}>{t}</div>
                    <div style={{fontSize:12.5,color:'#0E0E0E'}}>{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Player — pro waveform */}
        <div style={{borderTop:'1px solid #E6E4DF',padding:'14px 32px',background:'#0E0E0E',color:'#fff',display:'flex',alignItems:'center',gap:18}}>
          <div style={{display:'flex',gap:6}}>
            <button style={{width:32,height:32,borderRadius:'50%',background:'#1a1a1a',border:0,color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M19 20l-9-8 9-8M5 19V5"/></svg>
            </button>
            <button style={{width:36,height:36,borderRadius:'50%',background:'#E84F1C',border:0,color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="#fff"><path d="M0 0l12 7-12 7V0z"/></svg>
            </button>
            <button style={{width:32,height:32,borderRadius:'50%',background:'#1a1a1a',border:0,color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M5 4l9 8-9 8M19 5v14"/></svg>
            </button>
          </div>
          <div style={{fontFamily:'"Geist Mono", monospace',fontSize:11,color:'#9a9a9a',minWidth:96}}>00:00:48 <span style={{color:'#5a5a5a'}}>/ 48:13</span></div>

          <div style={{flex:1,position:'relative',height:44,display:'flex',alignItems:'center',gap:1.5}}>
            {Array.from({length:160}).map((_,i) => {
              const h = 4 + Math.abs(Math.sin(i*0.31 + Math.cos(i*0.22)*2))*32 + (i%7===0?6:0);
              const played = i < 16;
              return <div key={i} style={{flex:1,height:Math.min(h,36),background:played?'#E84F1C':'#3a3a3a',borderRadius:1}}/>;
            })}
            {/* timeline ticks */}
            <div style={{position:'absolute',inset:'auto 0 -6px 0',display:'flex',justifyContent:'space-between',fontSize:9.5,color:'#5a5a5a',fontFamily:'"Geist Mono", monospace'}}>
              {['00:00','10:00','20:00','30:00','40:00','48:00'].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>

          <div style={{display:'flex',gap:6,fontSize:11,color:'#9a9a9a',alignItems:'center'}}>
            <button style={{background:'#1a1a1a',border:0,color:'#fff',borderRadius:4,padding:'5px 9px',cursor:'pointer',fontFamily:'"Geist Mono", monospace',fontSize:10.5}}>1.0×</button>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="1.6"><path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7"/></svg>
          </div>
        </div>
      </main>
    </div>
  );
}

window.VariantB_Upload = VariantB_Upload;
window.VariantB_Transcript = VariantB_Transcript;
