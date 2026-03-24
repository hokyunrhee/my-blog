import { useState, useEffect } from "react";

const c = {
  text: "#1A1A18",
  muted: "#6B6A65",
  light: "#9C9B96",
  border: "#D4D3CE",
  gh: "#24292F",
  ghBg: "#F6F8FA",
  ghBd: "#D0D7DE",
  ssm: "#7C3AED",
  ssmBg: "#F5F3FF",
  ssmBd: "#C4B5FD",
  ec2: "#1D4ED8",
  ec2Bg: "#EFF6FF",
  ec2Bd: "#93C5FD",
  green: "#15803D",
  greenBg: "#F0FDF4",
  red: "#DC2626",
  redBg: "#FEF2F2",
  redBd: "#FCA5A5",
  ic: "#0E7490",
  amber: "#B45309",
};

const font = "'IBM Plex Sans', system-ui, sans-serif";
const mono = "'IBM Plex Mono', monospace";

const entities = [
  {
    id: "gh",
    x: 80,
    label: "GitHub Actions",
    sub: "Kamal",
    color: c.gh,
    bg: c.ghBg,
    bd: c.ghBd,
  },
  {
    id: "ssm",
    x: 300,
    label: "SSM",
    sub: "Session Manager",
    color: c.ssm,
    bg: c.ssmBg,
    bd: c.ssmBd,
  },
  {
    id: "ec2",
    x: 520,
    label: "EC2",
    sub: "SSM Agent",
    color: c.ec2,
    bg: c.ec2Bg,
    bd: c.ec2Bd,
  },
];

const boxW = 120;
const boxH = 56;
const entityY = 40;
const lineY1 = entityY + boxH + 8;
const lineY2 = 280;

const steps = [
  {
    title: "초기 상태",
    desc: "SSM Agent가 Systems Manager로의 연결을 시작하므로, EC2에 인바운드 포트를 열 필요가 없다.",
    arrows: [
      {
        from: "ec2",
        to: "ssm",
        color: c.ssm,
        dash: true,
        label: "아웃바운드 연결",
      },
    ],
  },
  {
    title: "1. 공개키 임시 등록",
    desc: "proxy_command가 실행되면, 먼저 send-ssh-public-key로 일회성 공개키를 EC2 인스턴스 메타데이터에 등록한다. 이 키는 60초간만 유효하다.",
    arrows: [
      { from: "ec2", to: "ssm", color: c.ssm, dash: true, dim: true },
      {
        from: "gh",
        to: "ec2",
        color: c.ic,
        label: "send-ssh-public-key (60초)",
        animate: true,
      },
    ],
  },
  {
    title: "2. SSM 터널 요청",
    desc: "이어서 ssm start-session으로 Session Manager를 통해 SSH 터널을 연다.",
    arrows: [
      { from: "ec2", to: "ssm", color: c.ssm, dash: true, dim: true },
      { from: "gh", to: "ec2", color: c.ic, dim: true },
      {
        from: "gh",
        to: "ssm",
        color: c.amber,
        label: "ssm start-session",
        animate: true,
      },
    ],
  },
  {
    title: "3. 양방향 연결 수립",
    desc: "Session Manager가 SSM Agent에 양방향 연결을 열도록 요청한다. Agent가 연결을 시작하므로 인바운드 포트는 필요 없다.",
    arrows: [
      { from: "ec2", to: "ssm", color: c.ssm, dash: true, dim: true },
      { from: "gh", to: "ec2", color: c.ic, dim: true },
      { from: "gh", to: "ssm", color: c.amber, dim: true },
      {
        from: "ssm",
        to: "ec2",
        color: c.ec2,
        label: "양방향 연결 수립",
        animate: true,
      },
    ],
  },
  {
    title: "4. SSH 세션 수립",
    desc: "SSM 터널 위에서 SSH 세션이 맺어지고, Kamal은 이 세션을 통해 Docker 명령어를 실행한다. 인바운드 포트는 하나도 열리지 않는다.",
    arrows: [
      { from: "ec2", to: "ssm", color: c.ssm, dash: true, dim: true },
      { from: "gh", to: "ec2", color: c.ic, dim: true },
      { from: "gh", to: "ssm", color: c.amber, dim: true },
      { from: "ssm", to: "ec2", color: c.ec2, dim: true },
      {
        from: "gh",
        to: "ec2",
        color: c.green,
        label: "SSH over SSM",
        animate: true,
        thick: true,
        curved: true,
      },
    ],
  },
];

function AnimatedDot({ fromX, toX, y, color }) {
  return (
    <circle r="3.5" fill={color} opacity="0.85">
      <animate
        attributeName="cx"
        from={fromX}
        to={toX}
        dur="1.4s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="cy"
        values={`${y};${y}`}
        dur="1.4s"
        repeatCount="indefinite"
      />
    </circle>
  );
}

export default function ProxyCommandFlow() {
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [step]);

  const getX = (id) => {
    const e = entities.find((e) => e.id === id);
    return e.x + boxW / 2;
  };

  const currentStep = steps[step];

  return (
    <div
      style={{
        fontFamily: font,
        margin: "2rem auto",
        padding: "1.5rem",
        background: "#fafafa",
        borderRadius: 8,
        border: "1px solid #e4e4e7",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <svg key={animKey} viewBox="0 0 700 310" width="100%">
        {/* Entity boxes */}
        {entities.map((e) => (
          <g key={e.id}>
            <rect
              x={e.x}
              y={entityY}
              width={boxW}
              height={boxH}
              rx={8}
              fill={e.bg}
              stroke={e.bd}
              strokeWidth={1}
            />
            <text
              x={e.x + boxW / 2}
              y={entityY + 22}
              textAnchor="middle"
              dominantBaseline="central"
              fill={e.color}
              style={{ fontSize: 12, fontWeight: 600, fontFamily: font }}
            >
              {e.label}
            </text>
            <text
              x={e.x + boxW / 2}
              y={entityY + 40}
              textAnchor="middle"
              dominantBaseline="central"
              fill={c.muted}
              style={{ fontSize: 10.5, fontFamily: font }}
            >
              {e.sub}
            </text>
          </g>
        ))}

        {/* EC2 port badge */}
        <g>
          <rect
            x={entities[2].x + 15}
            y={entityY + boxH + 12}
            width={90}
            height={20}
            rx={10}
            fill={step === 4 ? c.greenBg : c.redBg}
            stroke={step === 4 ? c.green : c.redBd}
            strokeWidth={0.5}
          />
          <text
            x={entities[2].x + 60}
            y={entityY + boxH + 23}
            textAnchor="middle"
            dominantBaseline="central"
            fill={step === 4 ? c.green : c.red}
            style={{ fontSize: 9, fontWeight: 600, fontFamily: mono }}
          >
            {step === 4 ? "SSH over SSM" : "포트 22 닫힘"}
          </text>
        </g>

        {/* Lifelines */}
        {entities.map((e) => (
          <line
            key={e.id + "-line"}
            x1={e.x + boxW / 2}
            y1={lineY1}
            x2={e.x + boxW / 2}
            y2={lineY2}
            stroke={c.border}
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.4}
          />
        ))}

        {/* Arrows */}
        {currentStep.arrows.map((arrow, i) => {
          const fromX = getX(arrow.from);
          const toX = getX(arrow.to);
          const arrowY = 140 + i * 40;
          const opacity = arrow.dim ? 0.18 : 1;
          const sw = arrow.thick ? 2.5 : 1.5;
          const dir = toX > fromX ? 1 : -1;

          if (arrow.curved) {
            const midX = (fromX + toX) / 2;
            const curveY = arrowY - 24;
            return (
              <g key={i} opacity={opacity}>
                <path
                  d={`M${fromX},${arrowY} Q${midX},${curveY} ${toX},${arrowY}`}
                  fill="none"
                  stroke={arrow.color}
                  strokeWidth={sw}
                />
                <polygon
                  points={`${toX},${arrowY} ${toX - 8},${arrowY - 4} ${toX - 8},${arrowY + 4}`}
                  fill={arrow.color}
                />
                {arrow.label && (
                  <text
                    x={midX}
                    y={curveY - 7}
                    textAnchor="middle"
                    fill={arrow.color}
                    style={{ fontSize: 10, fontWeight: 500, fontFamily: font }}
                  >
                    {arrow.label}
                  </text>
                )}
                {arrow.animate && (
                  <circle r="4" fill={arrow.color} opacity="0.8">
                    <animateMotion
                      dur="1.6s"
                      repeatCount="indefinite"
                      path={`M${fromX},${arrowY} Q${midX},${curveY} ${toX},${arrowY}`}
                    />
                  </circle>
                )}
              </g>
            );
          }

          const endX = toX - dir * 6;
          return (
            <g key={i} opacity={opacity}>
              <line
                x1={fromX}
                y1={arrowY}
                x2={endX}
                y2={arrowY}
                stroke={arrow.color}
                strokeWidth={sw}
                strokeDasharray={arrow.dash ? "5 3" : "none"}
              />
              <polygon
                points={`${toX},${arrowY} ${toX - dir * 8},${arrowY - 4} ${toX - dir * 8},${arrowY + 4}`}
                fill={arrow.color}
              />
              {arrow.label && (
                <text
                  x={(fromX + toX) / 2}
                  y={arrowY - 9}
                  textAnchor="middle"
                  fill={arrow.color}
                  style={{ fontSize: 9.5, fontWeight: 500, fontFamily: font }}
                >
                  {arrow.label}
                </text>
              )}
              {arrow.animate && (
                <AnimatedDot
                  fromX={fromX}
                  toX={toX}
                  y={arrowY}
                  color={arrow.color}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Step description */}
      <div
        style={{
          padding: "14px 18px",
          background: c.ghBg,
          borderRadius: 10,
          border: `1px solid ${c.ghBd}`,
          marginTop: 4,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: c.text,
            marginBottom: 4,
          }}
        >
          {currentStep.title}
        </div>
        <div style={{ fontSize: 12.5, color: c.muted, lineHeight: 1.6 }}>
          {currentStep.desc}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{
            padding: "6px 16px",
            fontSize: 12,
            fontFamily: font,
            fontWeight: 500,
            border: `1px solid ${c.border}`,
            borderRadius: 6,
            background: step === 0 ? c.ghBg : "#fff",
            color: step === 0 ? c.light : c.text,
            cursor: step === 0 ? "default" : "pointer",
          }}
        >
          이전
        </button>

        <div style={{ display: "flex", gap: 6 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === step ? c.ec2 : c.border,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          style={{
            padding: "6px 16px",
            fontSize: 12,
            fontFamily: font,
            fontWeight: 500,
            border: `1px solid ${step === steps.length - 1 ? c.border : c.ec2}`,
            borderRadius: 6,
            background: step === steps.length - 1 ? c.ghBg : c.ec2,
            color: step === steps.length - 1 ? c.light : "#fff",
            cursor: step === steps.length - 1 ? "default" : "pointer",
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
