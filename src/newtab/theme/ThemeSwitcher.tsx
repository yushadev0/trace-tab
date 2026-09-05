import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered, faMoon, faPalette, faSun } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { THEMES } from "./themes";
import { useTheme } from "./ThemeContext";
import type { Point, ThemeId } from "../../shared/types";
import { getThemeSwitcherPosition, setThemeSwitcherPosition } from "../../shared/storage";

const ICONS: Record<ThemeId, IconDefinition> = {
  dark: faMoon,
  light: faSun,
  f1: faFlagCheckered,
};

const MARGIN = 90;
const SATELLITE_RADIUS = 64;

function clampToViewport(point: Point): Point {
  const maxX = Math.max(MARGIN, window.innerWidth - MARGIN);
  const maxY = Math.max(MARGIN, window.innerHeight - MARGIN);
  return {
    x: Math.min(Math.max(point.x, MARGIN), maxX),
    y: Math.min(Math.max(point.y, MARGIN), maxY),
  };
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  dragging: boolean;
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [pos, setPos] = useState<Point | null>(null);
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    getThemeSwitcherPosition().then((saved) => {
      setPos(clampToViewport(saved ?? { x: window.innerWidth - MARGIN, y: window.innerHeight - MARGIN }));
    });
  }, []);

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!pos) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
      dragging: false,
    };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.dragging && Math.hypot(dx, dy) < 4) return;
    drag.dragging = true;
    setPos(clampToViewport({ x: drag.originX + dx, y: drag.originY + dy }));
  }

  function onPointerUp() {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.dragging && pos) {
      void setThemeSwitcherPosition(pos);
    }
  }

  if (!pos) return null;

  return (
    <div className="theme-switcher" style={{ left: pos.x, top: pos.y }}>
      <button
        type="button"
        className="theme-switcher__handle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="Tema seç (sürükleyebilirsin)"
        title="Tema seç — sürükleyebilirsin"
      >
        <FontAwesomeIcon icon={faPalette} />
      </button>

      <div className="theme-switcher__fan" role="radiogroup" aria-label="Tema seç">
        {THEMES.map((t, i) => {
          const angle = ((-90 + (360 / THEMES.length) * i) * Math.PI) / 180;
          const style = {
            "--dx": `${Math.cos(angle) * SATELLITE_RADIUS}px`,
            "--dy": `${Math.sin(angle) * SATELLITE_RADIUS}px`,
          } as CSSProperties;

          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={theme === t.id}
              aria-label={t.label}
              title={t.label}
              className={`theme-switcher__btn${theme === t.id ? " theme-switcher__btn--active" : ""}`}
              style={style}
              onClick={() => setTheme(t.id)}
            >
              <FontAwesomeIcon icon={ICONS[t.id]} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
