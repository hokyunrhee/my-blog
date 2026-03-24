import React from "react";

const c = {
  border: "#D4D3CE",
  text: "#1A1A18",
  muted: "#6B6A65",
  cf: "#EA580C",
  cfBg: "#FFF7ED",
  cfBd: "#FDBA74",
  ec2: "#1D4ED8",
  ec2Bg: "#EFF6FF",
  ec2Bd: "#93C5FD",
  ssm: "#7C3AED",
  ssmBg: "#F5F3FF",
  ssmBd: "#C4B5FD",
  red: "#DC2626",
  redBg: "#FEF2F2",
  redBd: "#FCA5A5",
  green: "#15803D",
  greenBg: "#F0FDF4",
  greenBd: "#86EFAC",
  cyan: "#0E7490",
  cyanBg: "#ECFEFF",
  cyanBd: "#67E8F9",
};

const font = "'IBM Plex Sans', system-ui, sans-serif";
const mono = "'IBM Plex Mono', monospace";

function Box({ x, y, w, h, bg, bd, title, sub, rx = 8 }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={bg}
        stroke={bd}
        strokeWidth={1}
      />
      <text
        x={x + w / 2}
        y={y + (sub ? h / 2 - 7 : h / 2)}
        textAnchor="middle"
        dominantBaseline="central"
        fill={c.text}
        style={{ fontSize: 12.5, fontWeight: 600, fontFamily: font }}
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fill={c.muted}
          style={{ fontSize: 10.5, fontFamily: font }}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Pill({ x, y, text, color, bg }) {
  const w = text.length * 6.2 + 18;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 10}
        width={w}
        height={20}
        rx={10}
        fill={bg}
        stroke={color}
        strokeWidth={0.5}
      />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        style={{
          fontSize: 9.5,
          fontWeight: 600,
          fontFamily: font,
          letterSpacing: "0.02em",
        }}
      >
        {text}
      </text>
    </g>
  );
}

function Arr({
  x1,
  y1,
  x2,
  y2,
  color = c.muted,
  dash = false,
  label = null,
  blocked = false,
}) {
  const dx = x2 - x1,
    dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len,
    uy = dy / len;
  const ex = x2 - ux * 6,
    ey = y2 - uy * 6;
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={blocked ? x2 : ex}
        y2={blocked ? y2 : ey}
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray={dash ? "5 3" : "none"}
      />
      {!blocked && (
        <polygon
          points={`${x2},${y2} ${ex - ux * 7 + uy * 4},${ey - uy * 7 + ux * 4} ${ex - ux * 7 - uy * 4},${ey - uy * 7 - ux * 4}`}
          fill={color}
        />
      )}
      {blocked && (
        <g>
          <line
            x1={x2 - 5}
            y1={y2 - 5}
            x2={x2 + 5}
            y2={y2 + 5}
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <line
            x1={x2 + 5}
            y1={y2 - 5}
            x2={x2 - 5}
            y2={y2 + 5}
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
      )}
      {label && (
        <text
          x={mx}
          y={my - 7}
          textAnchor="middle"
          fill={color}
          style={{ fontSize: 10, fontFamily: font }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function Diagram() {
  return (
    <div
      style={{
        fontFamily: font,
        margin: "2rem auto",
        padding: "1.5rem",
        background: "#fafafa",
        borderRadius: 8,
        border: "1px solid #212147",
      }}
    >
      <svg viewBox="0 0 700 490" width="100%">
        {/* EC2 container */}
        <rect
          x={220}
          y={72}
          width={250}
          height={370}
          rx={14}
          fill={c.ec2Bg}
          stroke={c.ec2Bd}
          strokeWidth={1}
        />
        <text
          x={345}
          y={96}
          textAnchor="middle"
          fill={c.ec2}
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: mono,
          }}
        >
          EC2 · PUBLIC SUBNET
        </text>

        {/* Security Group border */}
        <rect
          x={214}
          y={66}
          width={262}
          height={382}
          rx={18}
          fill="none"
          stroke={c.green}
          strokeWidth={2}
          strokeDasharray="6 4"
          opacity={0.6}
        />
        <g>
          <rect
            x={267}
            y={55}
            width={76}
            height={22}
            rx={11}
            fill={c.greenBg}
            stroke={c.greenBd}
            strokeWidth={0.5}
          />
          <text
            x={305}
            y={67}
            textAnchor="middle"
            dominantBaseline="central"
            fill={c.green}
            style={{ fontSize: 9.5, fontWeight: 600, fontFamily: mono }}
          >
            보안 그룹
          </text>
        </g>
        <g>
          <rect
            x={349}
            y={55}
            width={90}
            height={22}
            rx={11}
            fill={c.greenBg}
            stroke={c.greenBd}
            strokeWidth={0.5}
          />
          <text
            x={394}
            y={67}
            textAnchor="middle"
            dominantBaseline="central"
            fill={c.green}
            style={{ fontSize: 9.5, fontWeight: 600, fontFamily: mono }}
          >
            443 only
          </text>
        </g>

        {/* User */}
        <Box
          x={18}
          y={100}
          w={140}
          h={48}
          bg="#fff"
          bd={c.cfBd}
          title="사용자"
          sub="웹 브라우저"
        />

        {/* CloudFront */}
        <Box
          x={18}
          y={200}
          w={140}
          h={50}
          bg={c.cfBg}
          bd={c.cfBd}
          title="CloudFront"
          sub="HTTPS (443)"
        />

        {/* User → CF */}
        <Arr x1={88} y1={148} x2={88} y2={200} color={c.cf} label="HTTPS" />

        {/* CF → SG → App */}
        <Arr x1={158} y1={225} x2={214} y2={230} color={c.cf} />
        <Arr x1={222} y1={230} x2={260} y2={230} color={c.green} />
        <Pill
          x={190}
          y={212}
          text="custom header 검증"
          color={c.ec2}
          bg={c.ec2Bg}
        />

        {/* App */}
        <g>
          <rect
            x={260}
            y={196}
            width={170}
            height={68}
            rx={8}
            fill="#fff"
            stroke={c.ec2Bd}
            strokeWidth={1}
          />
          <text
            x={345}
            y={214}
            textAnchor="middle"
            dominantBaseline="central"
            fill={c.text}
            style={{ fontSize: 12.5, fontWeight: 600, fontFamily: font }}
          >
            어플리케이션
          </text>
          <text
            x={345}
            y={232}
            textAnchor="middle"
            dominantBaseline="central"
            fill={c.muted}
            style={{ fontSize: 10.5, fontFamily: font }}
          >
            kamal-proxy ↔ app
          </text>
          <text
            x={345}
            y={248}
            textAnchor="middle"
            dominantBaseline="central"
            fill={c.muted}
            style={{ fontSize: 10.5, fontFamily: font }}
          >
            bridge network
          </text>
        </g>

        {/* IMDSv2 */}
        <Box
          x={260}
          y={316}
          w={170}
          h={50}
          bg={c.cyanBg}
          bd={c.cyanBd}
          title="IMDSv2 강제"
          sub="PUT 필수 · hop limit 1"
        />

        {/* SSRF 차단 badge */}
        <Pill x={410} y={310} text="SSRF 차단" color={c.cyan} bg={c.cyanBg} />

        {/* SSM Agent */}
        <Box
          x={260}
          y={384}
          w={170}
          h={46}
          bg={c.ssmBg}
          bd={c.ssmBd}
          title="SSM Agent"
          sub="아웃바운드 HTTPS"
        />

        {/* AWS SSM endpoint */}
        <Box
          x={540}
          y={384}
          w={142}
          h={46}
          bg={c.ssmBg}
          bd={c.ssmBd}
          title="AWS SSM"
          sub="엔드포인트"
        />

        {/* SSM Agent → AWS SSM */}
        <Arr
          x1={430}
          y1={407}
          x2={538}
          y2={407}
          color={c.ssm}
          label="아웃바운드"
        />

        {/* Developer */}
        <Box
          x={540}
          y={300}
          w={142}
          h={50}
          bg="#fff"
          bd={c.border}
          title="개발자"
          sub="IAM 인증"
        />

        {/* Developer → AWS SSM */}
        <Arr x1={611} y1={350} x2={611} y2={382} color={c.ssm} />

        {/* AWS SSM → EC2 via existing conn */}
        <path
          d="M 538 414 Q 504 414 490 420 Q 476 426 432 420"
          fill="none"
          stroke={c.ssm}
          strokeWidth={1.5}
          strokeDasharray="5 3"
        />
        <polygon points="430,420 440,415 440,425" fill={c.ssm} />
        <text
          x={496}
          y={436}
          textAnchor="middle"
          fill={c.ssm}
          style={{ fontSize: 9.5, fontFamily: font }}
        >
          기존 연결로 전달
        </text>

        {/* Blocked: direct access */}
        <Box
          x={18}
          y={335}
          w={140}
          h={42}
          bg={c.redBg}
          bd={c.redBd}
          title="직접 접근 시도"
          sub="SSH · 임의 포트"
        />
        <Arr x1={158} y1={356} x2={212} y2={356} color={c.red} blocked={true} />
        <Pill x={186} y={338} text="차단" color={c.red} bg={c.redBg} />

        {/* Legend */}
        <g transform="translate(18, 460)">
          <line
            x1={0}
            y1={12}
            x2={20}
            y2={12}
            stroke={c.green}
            strokeWidth={2}
          />
          <text
            x={26}
            y={16}
            fill={c.muted}
            style={{ fontSize: 10, fontFamily: font }}
          >
            허용
          </text>

          <line
            x1={70}
            y1={12}
            x2={90}
            y2={12}
            stroke={c.red}
            strokeWidth={2}
          />
          <text
            x={93}
            y={6}
            fill={c.red}
            style={{ fontSize: 9, fontWeight: 600 }}
          >
            ✕
          </text>
          <text
            x={106}
            y={16}
            fill={c.muted}
            style={{ fontSize: 10, fontFamily: font }}
          >
            차단
          </text>

          <line
            x1={150}
            y1={12}
            x2={170}
            y2={12}
            stroke={c.ssm}
            strokeWidth={1.5}
            strokeDasharray="5 3"
          />
          <text
            x={176}
            y={16}
            fill={c.muted}
            style={{ fontSize: 10, fontFamily: font }}
          >
            SSM 연결
          </text>

          <line
            x1={250}
            y1={12}
            x2={270}
            y2={12}
            stroke={c.cyan}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <text
            x={276}
            y={16}
            fill={c.muted}
            style={{ fontSize: 10, fontFamily: font }}
          >
            IMDSv2 방어
          </text>
        </g>
      </svg>
    </div>
  );
}
