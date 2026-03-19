const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function NacreBorder({ id }) {
  const g = `url(#${id})`;
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 220 330" fill="none">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d0c0e0"/>
          <stop offset="25%" stopColor="#a8d4c8"/>
          <stop offset="50%" stopColor="#e0d4b8"/>
          <stop offset="75%" stopColor="#d8b8c8"/>
          <stop offset="100%" stopColor="#b0c8d8"/>
          <animate attributeName="x1" values="0%;100%;100%;0%;0%" dur="10s" repeatCount="indefinite"/>
          <animate attributeName="y1" values="0%;0%;100%;100%;0%" dur="10s" repeatCount="indefinite"/>
          <animate attributeName="x2" values="100%;0%;0%;100%;100%" dur="10s" repeatCount="indefinite"/>
          <animate attributeName="y2" values="100%;100%;0%;0%;100%" dur="10s" repeatCount="indefinite"/>
        </linearGradient>
      </defs>

      {/* Double frame */}
      <rect x="3" y="3" width="214" height="324" rx="12" stroke={g} strokeWidth="1.25" opacity="1"/>
      <rect x="14" y="14" width="192" height="302" rx="7" stroke={g} strokeWidth="0.75" opacity="0.85"/>

      {/* Vine scrollwork — 당초문 */}
      <path d="M 25,8 Q 37.5,2 50,8 Q 62.5,14 75,8 Q 87.5,2 100,8 Q 112.5,14 125,8 Q 137.5,2 150,8 Q 162.5,14 175,8 Q 187.5,2 195,8" stroke={g} strokeWidth="1.4" opacity="1"/>
      <path d="M 25,322 Q 37.5,328 50,322 Q 62.5,316 75,322 Q 87.5,328 100,322 Q 112.5,316 125,322 Q 137.5,328 150,322 Q 162.5,316 175,322 Q 187.5,328 195,322" stroke={g} strokeWidth="1.4" opacity="1"/>
      <path d="M 8,25 Q 2,45 8,65 Q 14,85 8,105 Q 2,125 8,145 Q 14,165 8,185 Q 2,205 8,225 Q 14,245 8,265 Q 2,285 8,305" stroke={g} strokeWidth="1.4" opacity="1"/>
      <path d="M 212,25 Q 218,45 212,65 Q 206,85 212,105 Q 218,125 212,145 Q 206,165 212,185 Q 218,205 212,225 Q 206,245 212,265 Q 218,285 212,305" stroke={g} strokeWidth="1.4" opacity="1"/>

      {/* Leaves — top edge */}
      {[37.5, 87.5, 137.5, 187.5].map(x => (
        <path key={`lt${x}`} d={`M ${x},6 Q ${x-3.5},0 ${x},-1.5 Q ${x+3.5},0 ${x},6 Z`} fill={g} opacity="0.9"/>
      ))}
      {[62.5, 112.5, 162.5].map(x => (
        <path key={`lt2${x}`} d={`M ${x},10 Q ${x-3.5},16 ${x},17.5 Q ${x+3.5},16 ${x},10 Z`} fill={g} opacity="0.9"/>
      ))}

      {/* Leaves — bottom edge */}
      {[37.5, 87.5, 137.5, 187.5].map(x => (
        <path key={`lb${x}`} d={`M ${x},324 Q ${x-3.5},330 ${x},331.5 Q ${x+3.5},330 ${x},324 Z`} fill={g} opacity="0.9"/>
      ))}
      {[62.5, 112.5, 162.5].map(x => (
        <path key={`lb2${x}`} d={`M ${x},320 Q ${x-3.5},314 ${x},312.5 Q ${x+3.5},314 ${x},320 Z`} fill={g} opacity="0.9"/>
      ))}

      {/* Leaves — left edge */}
      {[45, 125, 205, 285].map(y => (
        <path key={`ll${y}`} d={`M 6,${y} Q 0,${y-3.5} -1.5,${y} Q 0,${y+3.5} 6,${y} Z`} fill={g} opacity="0.9"/>
      ))}
      {[85, 165, 245].map(y => (
        <path key={`ll2${y}`} d={`M 10,${y} Q 16,${y-3.5} 17.5,${y} Q 16,${y+3.5} 10,${y} Z`} fill={g} opacity="0.9"/>
      ))}

      {/* Leaves — right edge */}
      {[45, 125, 205, 285].map(y => (
        <path key={`lr${y}`} d={`M 214,${y} Q 220,${y-3.5} 221.5,${y} Q 220,${y+3.5} 214,${y} Z`} fill={g} opacity="0.9"/>
      ))}
      {[85, 165, 245].map(y => (
        <path key={`lr2${y}`} d={`M 210,${y} Q 204,${y-3.5} 202.5,${y} Q 204,${y+3.5} 210,${y} Z`} fill={g} opacity="0.9"/>
      ))}

      {/* Chrysanthemum flowers — corners (국화) */}
      {[[8.5,8.5],[211.5,8.5],[8.5,321.5],[211.5,321.5]].map(([cx,cy]) => (
        <g key={`fc${cx}${cy}`} transform={`translate(${cx} ${cy})`}>
          <circle r="2" fill={g} opacity="1"/>
          {PETAL_ANGLES.map(a => (
            <ellipse key={a} rx="1.2" ry="3.5" fill={g} opacity="0.8" transform={`rotate(${a}) translate(0 -4)`}/>
          ))}
        </g>
      ))}

      {/* Chrysanthemum flowers — edge centers */}
      {[[110,8],[110,322],[8,165],[212,165]].map(([cx,cy]) => (
        <g key={`fe${cx}${cy}`} transform={`translate(${cx} ${cy})`}>
          <circle r="2.5" fill={g} opacity="1"/>
          {PETAL_ANGLES.map(a => (
            <ellipse key={a} rx="1.5" ry="4.2" fill={g} opacity="0.85" transform={`rotate(${a}) translate(0 -4.8)`}/>
          ))}
        </g>
      ))}

      {/* Corner vine tendrils */}
      <path d="M 20,3 C 14,3 8,5 4,9" stroke={g} strokeWidth="1" opacity="0.9"/>
      <path d="M 3,20 C 3,14 5,8 9,4" stroke={g} strokeWidth="1" opacity="0.9"/>
      <path d="M 200,3 C 206,3 212,5 216,9" stroke={g} strokeWidth="1" opacity="0.9"/>
      <path d="M 217,20 C 217,14 215,8 211,4" stroke={g} strokeWidth="1" opacity="0.9"/>
      <path d="M 20,327 C 14,327 8,325 4,321" stroke={g} strokeWidth="1" opacity="0.9"/>
      <path d="M 3,310 C 3,316 5,322 9,326" stroke={g} strokeWidth="1" opacity="0.9"/>
      <path d="M 200,327 C 206,327 212,325 216,321" stroke={g} strokeWidth="1" opacity="0.9"/>
      <path d="M 217,310 C 217,316 215,322 211,326" stroke={g} strokeWidth="1" opacity="0.9"/>

      {/* Small pearl dots between vine waves */}
      {[30,55,80,105,130,155,180].map(x => (
        <circle key={`dt${x}`} cx={x} cy="8" r="1" fill={g} opacity="0.7"/>
      ))}
      {[30,55,80,105,130,155,180].map(x => (
        <circle key={`db${x}`} cx={x} cy="322" r="1" fill={g} opacity="0.7"/>
      ))}
      {[35,55,75,95,115,135,155,175,195,215,235,255,275,295].map(y => (
        <circle key={`dl${y}`} cx="8" cy={y} r="1" fill={g} opacity="0.7"/>
      ))}
      {[35,55,75,95,115,135,155,175,195,215,235,255,275,295].map(y => (
        <circle key={`dr${y}`} cx="212" cy={y} r="1" fill={g} opacity="0.7"/>
      ))}
    </svg>
  );
}
