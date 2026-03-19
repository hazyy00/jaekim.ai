import { useState, useEffect, useRef, useCallback } from 'react';
import { CONFIG } from './config';
import { STYLES } from './styles';
import { useParticleSystem } from './useParticleSystem';
import NacreBorder from './NacreBorder';
import './styles.css';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [dotHovered, setDotHovered] = useState(false);
  const [closeDotHovered, setCloseDotHovered] = useState(false);
  const [backArrowHovered, setBackArrowHovered] = useState(false);
  const [emailRevealed, setEmailRevealed] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const canvasRef = useRef(null);
  const cursorCanvasRef = useRef(null);
  const panelOpenRef = useRef(false);
  const navDotRef = useRef(null);
  const closeDotRef = useRef(null);
  const backArrowRef = useRef(null);

  // Touch detection
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // Particle system + magnetic snap (desktop only)
  const { snappedRef, snappedCloseRef, snappedBackRef } = useParticleSystem({
    isTouchDevice,
    canvasRef,
    cursorCanvasRef,
    navDotRef,
    closeDotRef,
    backArrowRef,
    panelOpenRef,
    setDotHovered,
    setCloseDotHovered,
    setBackArrowHovered,
  });

  const openPanel = useCallback(() => { setPanelOpen(true); panelOpenRef.current = true; }, []);
  const closePanel = useCallback(() => {
    setPanelOpen(false);
    panelOpenRef.current = false;
  }, []);

  // Reset timeline index when section changes
  useEffect(() => {
    if (activeSection?.timeline) setActiveTimelineIdx(0);
    if (activeSection?.cards) setFlippedCards({});
  }, [activeSection]);

  // Arrow key navigation for timeline dots
  useEffect(() => {
    if (!activeSection?.timeline) return;
    const len = activeSection.timeline.length;
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') setActiveTimelineIdx(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setActiveTimelineIdx(prev => Math.min(len - 1, prev + 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeSection]);

  // Wait for critical assets before revealing site
  useEffect(() => {
    const fontReady = document.fonts.ready;
    const imgReady = new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = '/signature.png';
    });
    const minDelay = new Promise((resolve) => setTimeout(resolve, 400));
    Promise.all([fontReady, imgReady, minDelay]).then(() => setLoaded(true));
  }, []);

  // Click while magnetically snapped
  useEffect(() => {
    const handleSnapClick = () => {
      if (snappedRef.current && !panelOpenRef.current) openPanel();
      if (snappedCloseRef.current && panelOpenRef.current) closePanel();
      if (snappedBackRef.current) setActiveSection(null);
    };
    window.addEventListener('click', handleSnapClick);
    return () => window.removeEventListener('click', handleSnapClick);
  }, [openPanel, closePanel]);

  const handleNavKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPanel();
      }
    },
    [openPanel]
  );

  // ─── DYNAMIC STYLES ────────────────────────────────────────────────────
  const containerStyle = {
    ...STYLES.container,
    cursor: isTouchDevice ? 'auto' : 'none',
  };
  const backdropStyle = {
    ...STYLES.backdrop,
    opacity: panelOpen ? 1 : 0,
    pointerEvents: panelOpen ? 'auto' : 'none',
  };
  const panelStyle = {
    ...STYLES.panel,
    transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
  };
  const closeDotStyle = {
    ...STYLES.closeDot,
    opacity: panelOpen ? 1 : 0,
    pointerEvents: panelOpen ? 'auto' : 'none',
    transition: panelOpen
      ? 'transform 0.3s ease, opacity 0.3s ease 0.2s'
      : 'transform 0.3s ease, opacity 0.05s ease',
  };

  return (
    <>
      <div className={isTouchDevice ? '' : 'hide-cursor'} style={{...containerStyle, opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease'}}>
        {/* Particle canvas */}
        {!isTouchDevice && (
          <canvas ref={canvasRef} style={STYLES.canvas} />
        )}
        {/* Cursor canvas (above cards) */}
        {!isTouchDevice && (
          <canvas ref={cursorCanvasRef} style={{...STYLES.canvas, zIndex: 50}} />
        )}

        {/* Signature watermark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: panelOpen ? '36vw' : '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'left 450ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s ease',
          zIndex: 1,
          pointerEvents: 'none',
          width: 'clamp(300px, 50vw, 700px)',
          opacity: activeSection?.cards ? 0 : 1,
        }}>
          <img
            src="/signature.png"
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              opacity: 0.4,
            }}
          />
        </div>

        {/* Top left - Name & Role / Active section title */}
        <div
          className="top-left-responsive"
          style={STYLES.topLeft}
        >
          {/* Normal name/role */}
          <div style={{
            opacity: activeSection ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}>
            <div style={STYLES.nameLabel}>{CONFIG.name}</div>
            <div style={STYLES.roleLabel}>{CONFIG.role}</div>
            <div style={STYLES.roleLabel}>Data Science</div>
          </div>
          {/* Active section title */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: panelOpen ? 'calc(100vw - 28vw - 80px)' : 'calc(100vw - 80px)',
            opacity: activeSection ? 1 : 0,
            transition: 'opacity 0.3s ease, width 450ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}>
            <div style={{
              fontSize: 'clamp(60px, 8vw, 110px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}>
              <span
                ref={backArrowRef}
                onClick={() => setActiveSection(null)}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                  marginRight: '16px',
                  opacity: backArrowHovered ? 1 : 0.6,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'auto',
                  fontSize: 'clamp(40px, 5vw, 70px)',
                  verticalAlign: 'middle',
                }}
                role="button"
                aria-label="Back to main"
              >←</span>
              {activeSection?.title}
            </div>
            {/* Timeline rendered below the Experience title */}
            {activeSection?.timeline && (
              <div className="timeline-container" style={{
                marginTop: '40px',
                width: '100%',
                animation: 'fadeInUp 0.4s ease forwards',
                pointerEvents: 'auto',
              }}>
                <div className="timeline-line" />
                <div className="timeline-dots">
                  {activeSection.timeline.map((entry, i) => (
                    <div
                      key={i}
                      className={`timeline-dot-wrapper${activeTimelineIdx === i ? ' active' : ''}`}
                      onClick={() => setActiveTimelineIdx(i)}
                    >
                      <span className="timeline-date">{entry.date}</span>
                      <div className="timeline-dot" />
                      <span className="timeline-org">{entry.org}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation dot */}
        <div
          ref={navDotRef}
          className={`nav-dot nav-dot-responsive${dotHovered ? ' nav-dot-active' : ''}`}
          style={STYLES.navDot}
          onClick={openPanel}
          onKeyDown={handleNavKeyDown}
          role="button"
          aria-label="Open navigation panel"
          tabIndex={0}
        >
          <span className="nav-dot-label">open</span>
        </div>

        {/* Close dot outside panel */}
        <div
          ref={closeDotRef}
          className={`close-dot${closeDotHovered ? ' close-dot-active' : ''}`}
          style={closeDotStyle}
          onClick={closePanel}
          role="button"
          aria-label="Close navigation panel"
          tabIndex={panelOpen ? 0 : -1}
        >
          <span className="close-dot-label">close</span>
        </div>

        {/* Backdrop */}
        <div
          style={backdropStyle}
          onClick={closePanel}
          aria-hidden="true"
        />

        {/* Card deck — rendered directly on page */}
        {activeSection?.cards && (
          <div style={{
            position: 'fixed',
            inset: 0,
            right: panelOpen ? 'max(28vw, 320px)' : '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'right 450ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            zIndex: 21,
            pointerEvents: 'none',
            animation: 'fadeInUp 0.4s ease forwards',
          }}>
            <div className="card-fan">
              {activeSection.cards.map((card, i) => {
                const angle = (i - Math.floor(activeSection.cards.length / 2)) * 10;
                return (
                  <div key={i} className="card-flip"
                       style={{ transform: `rotate(${angle}deg)` }}
                       onClick={() => setFlippedCards(prev => ({...prev, [i]: !prev[i]}))}>
                    <div className={`card-inner ${flippedCards[i] ? 'flipped' : ''}`}>
                      <div className="card-front">
                        <NacreBorder id={`nf${i}`} />
                        <div className="card-front-border">
                          <img src="/signature.png" alt="" className="card-signature" />
                        </div>
                      </div>
                      <div className="card-back">
                        <NacreBorder id={`nb${i}`} />
                        <div className="card-back-border">
                          <div className="card-suit-top">{card.suit}</div>
                          <div className="card-fact">{card.fact}</div>
                          <div className="card-suit-bottom">{card.suit}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section detail popup — full-height split */}
        {activeSection && !activeSection.cards && (!activeSection.timeline || activeTimelineIdx !== null) && (
          <div
            className="detail-popup panel-content liquid-glass"
            style={{
              position: 'fixed',
              top: activeSection.timeline ? '420px' : '200px',
              left: '40px',
              maxWidth: panelOpen ? 'calc(100vw - 28vw - 80px)' : 'calc(100vw - 80px)',
              maxHeight: 'calc(100vh - 240px)',
              overflowY: 'auto',
              borderRadius: '20px',
              color: CONFIG.theme.text,
              padding: '36px',
              zIndex: 6,
              animation: 'fadeInUp 0.3s ease forwards',
              width: 'fit-content',
              minWidth: activeSection.timeline ? 'min(400px, calc(100vw - 100px))' : undefined,
            }}
          >
            <div
              onClick={() => setActiveSection(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: CONFIG.theme.text,
                cursor: 'pointer',
                opacity: 0.25,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                zIndex: 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.5)'; e.currentTarget.style.opacity = '0.5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.25'; }}
              role="button"
              aria-label="Close detail popup"
              tabIndex={0}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              {activeSection.timeline ? (
                activeSection.timeline[activeTimelineIdx] && (
                  <div className="timeline-detail" key={activeTimelineIdx}>
                    <p style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      margin: '0',
                      opacity: 0.9,
                      color: CONFIG.theme.text,
                      lineHeight: 1.2,
                    }}>
                      {activeSection.timeline[activeTimelineIdx].org}
                    </p>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 400,
                      margin: '4px 0 16px',
                      opacity: 0.6,
                      color: CONFIG.theme.text,
                    }}>
                      {activeSection.timeline[activeTimelineIdx].role}
                    </p>
                    <p style={{
                      fontSize: '22px',
                      fontWeight: 400,
                      lineHeight: 1.7,
                      whiteSpace: 'pre-line',
                      margin: 0,
                      opacity: 0.85,
                    }}>
                      {activeSection.timeline[activeTimelineIdx].description}
                    </p>
                  </div>
                )
              ) : (
                <p style={{
                  fontSize: '22px',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                  margin: 0,
                  opacity: 0.85,
                }}>
                  {activeSection.content}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Side panel */}
        <div
          className="panel-responsive panel-content"
          style={panelStyle}
        >
          {panelOpen && (
            <div
              className="panel-inner-responsive"
              style={STYLES.panelInner}
            >
              {/* Name */}
              <div
                style={{
                  ...STYLES.panelName,
                  animation: 'fadeInUp 0.4s ease forwards',
                  opacity: 0,
                  animationDelay: '0ms',
                }}
              >
                {CONFIG.name}
              </div>

              {/* Bio */}
              <div
                style={{
                  ...STYLES.panelBio,
                  animation: 'fadeInUp 0.4s ease forwards',
                  opacity: 0,
                  animationDelay: '50ms',
                  marginTop: '16px',
                }}
              >
                {CONFIG.bio}
              </div>

              {/* Bottom section */}
              <div style={STYLES.panelBottom}>

              {/* Background */}
              <div
                style={{
                  animation: 'fadeInUp 0.4s ease forwards',
                  opacity: 0,
                  animationDelay: '200ms',
                }}
              >
                <div style={STYLES.sectionTitle}>Background</div>
                {CONFIG.projects.map((project, i) => (
                  <div
                    key={i}
                    style={{
                      ...STYLES.projectItem,
                      cursor: 'pointer',
                      backgroundColor: activeSection === project ? 'rgba(26, 26, 26, 0.05)' : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }}
                    onClick={() => setActiveSection(activeSection === project ? null : project)}
                  >
                    <div className="project-link">
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="project-title">
                          {project.title}
                        </span>
                        <span className="project-arrow">↗</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div
                style={{
                  ...STYLES.contactSection,
                  animation: 'fadeInUp 0.4s ease forwards',
                  opacity: 0,
                  animationDelay: '250ms',
                }}
              >
                <div style={STYLES.sectionTitle}>Contact</div>
                {CONFIG.contact.map((link, i) =>
                  link.email ? (
                    <span
                      key={i}
                      className="contact-link project-link"
                      style={{ ...STYLES.contactLink, cursor: 'pointer', padding: '10px 0' }}
                      onClick={() => setEmailRevealed(!emailRevealed)}
                    >
                      <span className="project-title">
                        {emailRevealed ? link.email : link.label}
                      </span>
                    </span>
                  ) : (
                    <a
                      key={i}
                      className="contact-link project-link"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ ...STYLES.contactLink, padding: '10px 0' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="project-title">{link.label}</span>
                        <span className="project-arrow">↗</span>
                      </span>
                    </a>
                  )
                )}
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
