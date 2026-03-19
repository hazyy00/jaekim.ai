import { useEffect, useRef } from 'react';
import { CONFIG } from './config';
import { Particle, CURSOR_RADIUS, PARTICLE_DENSITY } from './Particle';

const SNAP_DIST = 50;
const CURSOR_DRAW_RADIUS = 5;

function checkSnap(ref, mouse, snappedRef, setHovered) {
  if (!ref.current) return { snapped: false, cx: 0, cy: 0 };
  const rect = ref.current.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const d = Math.sqrt((mouse.x - cx) ** 2 + (mouse.y - cy) ** 2);
  const threshold = snappedRef.current ? SNAP_DIST * 1.2 : SNAP_DIST;
  const snapped = d < threshold;
  if (snapped !== snappedRef.current) setHovered(snapped);
  snappedRef.current = snapped;
  return { snapped, cx, cy };
}

function clearSnap(snappedRef, setHovered) {
  if (snappedRef.current) {
    snappedRef.current = false;
    setHovered(false);
  }
}

export function useParticleSystem({
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
}) {
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const prevMouseRef = useRef({ x: -100, y: -100 });
  const mouseHistoryRef = useRef([]);
  const animationFrameRef = useRef(null);
  const cursorRadiusRef = useRef(5);
  const snappedRef = useRef(false);
  const snappedCloseRef = useRef(false);
  const snappedBackRef = useRef(false);

  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const initParticles = (w, h) => {
      const count = Math.floor(w * h * PARTICLE_DENSITY);
      const particles = new Array(count);
      for (let i = 0; i < count; i++) {
        particles[i] = new Particle(Math.random() * w, Math.random() * h);
      }
      particlesRef.current = particles;
    };

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      initParticles(window.innerWidth, window.innerHeight);
    };

    resize();

    const handleResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.fillStyle = CONFIG.theme.text;
      const mouse = mouseRef.current;
      const prevMouse = prevMouseRef.current;
      const particles = particlesRef.current;

      // Build interpolated mouse points using Catmull-Rom spline
      const history = mouseHistoryRef.current;
      history.push({ x: mouse.x, y: mouse.y });
      if (history.length > 4) history.shift();

      const dx = mouse.x - prevMouse.x;
      const dy = mouse.y - prevMouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let mousePoints;
      if (history.length >= 4 && dist > 0.5) {
        const [p0, p1, p2, p3] = history;
        const segLen = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
        const steps = Math.max(1, Math.ceil(segLen / (CURSOR_RADIUS * 0.4)));
        mousePoints = new Array(steps);
        for (let s = 0; s < steps; s++) {
          const t = steps === 1 ? 1 : s / (steps - 1);
          const t2 = t * t;
          const t3 = t2 * t;
          mousePoints[s] = {
            x: 0.5 * ((-p0.x + 3*p1.x - 3*p2.x + p3.x)*t3 + (2*p0.x - 5*p1.x + 4*p2.x - p3.x)*t2 + (-p0.x + p2.x)*t + 2*p1.x),
            y: 0.5 * ((-p0.y + 3*p1.y - 3*p2.y + p3.y)*t3 + (2*p0.y - 5*p1.y + 4*p2.y - p3.y)*t2 + (-p0.y + p2.y)*t + 2*p1.y),
          };
        }
      } else {
        const steps = Math.max(1, Math.ceil(dist / (CURSOR_RADIUS * 0.5)));
        mousePoints = new Array(steps);
        for (let s = 0; s < steps; s++) {
          const t = steps === 1 ? 1 : s / (steps - 1);
          mousePoints[s] = { x: prevMouse.x + dx * t, y: prevMouse.y + dy * t };
        }
      }

      const isMoving = dist > 0.5;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(isMoving ? mousePoints : [], CURSOR_RADIUS);
        particles[i].draw(ctx);
      }

      prevMouseRef.current.x = mouse.x;
      prevMouseRef.current.y = mouse.y;

      // Magnetic snap
      let cursorX = mouse.x;
      let cursorY = mouse.y;

      // Snap to open dot
      let anySnapped = false;
      if (navDotRef.current && !panelOpenRef.current) {
        const { snapped, cx, cy } = checkSnap(navDotRef, mouse, snappedRef, setDotHovered);
        if (snapped) { cursorX = cx; cursorY = cy; anySnapped = true; }
      } else {
        clearSnap(snappedRef, setDotHovered);
      }

      // Snap to close dot
      if (closeDotRef.current && panelOpenRef.current && !anySnapped) {
        const { snapped, cx, cy } = checkSnap(closeDotRef, mouse, snappedCloseRef, setCloseDotHovered);
        if (snapped) { cursorX = cx; cursorY = cy; anySnapped = true; }
      } else {
        clearSnap(snappedCloseRef, setCloseDotHovered);
      }

      // Snap to back arrow
      if (backArrowRef.current && !anySnapped) {
        const { snapped, cx, cy } = checkSnap(backArrowRef, mouse, snappedBackRef, setBackArrowHovered);
        if (snapped) { cursorX = cx; cursorY = cy; anySnapped = true; }
      } else {
        clearSnap(snappedBackRef, setBackArrowHovered);
      }

      // Animate cursor radius
      const targetRadius = anySnapped ? 8 : CURSOR_DRAW_RADIUS;
      cursorRadiusRef.current += (targetRadius - cursorRadiusRef.current) * 0.15;

      ctx.globalAlpha = 1;

      // Draw custom cursor on separate canvas (above cards)
      const cursorCanvas = cursorCanvasRef.current;
      if (cursorCanvas) {
        const cctx = cursorCanvas.getContext('2d');
        if (cursorCanvas.width !== canvas.width || cursorCanvas.height !== canvas.height) {
          cursorCanvas.width = canvas.width;
          cursorCanvas.height = canvas.height;
          cursorCanvas.style.width = canvas.style.width;
          cursorCanvas.style.height = canvas.style.height;
          cctx.scale(dpr, dpr);
        }
        cctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (mouse.x > 0 && mouse.y > 0) {
          const panelW = Math.max(window.innerWidth * 0.28, 320);
          const overPanel = panelOpenRef.current && mouse.x >= window.innerWidth - panelW;
          cctx.fillStyle = overPanel ? '#1A1A1A' : CONFIG.theme.text;
          cctx.globalAlpha = 0.8;
          cctx.beginPath();
          cctx.arc(cursorX, cursorY, cursorRadiusRef.current, 0, Math.PI * 2);
          cctx.fill();
          cctx.globalAlpha = 1;
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTouchDevice]);

  return { snappedRef, snappedCloseRef, snappedBackRef };
}
