import { useState } from "react";

const STEPS = [
  {
    id: 0,
    title: "두 request가 동시에 도착",
    description:
      "Puma의 thread pool에서 두 thread가 각각 하나의 request를 처리한다. 각 thread는 독립된 Current 인스턴스를 가진다.",
    a: { phase: "idle", session: null, user: null },
    b: { phase: "idle", session: null, user: null },
  },
  {
    id: 1,
    title: "각 thread에서 인증 수행",
    description:
      "두 thread가 독립적으로 require_authentication을 실행한다. Thread A에는 Alice의 세션이, Thread B에는 Bob의 세션이 설정된다.",
    a: { phase: "active", session: "Session#42", user: "Alice" },
    b: { phase: "active", session: "Session#87", user: "Bob" },
  },
  {
    id: 2,
    title: "동시 실행 — 값이 섞이지 않는다",
    description:
      "두 thread가 동시에 비즈니스 로직을 실행한다. Thread A에서 Current.user는 Alice, Thread B에서 Current.user는 Bob이다. 같은 클래스 메서드를 호출하지만 각 thread의 인스턴스가 다르므로 간섭하지 않는다.",
    a: { phase: "active", session: "Session#42", user: "Alice" },
    b: { phase: "active", session: "Session#87", user: "Bob" },
  },
  {
    id: 3,
    title: "Thread A 완료",
    description:
      "Thread A의 request가 먼저 완료된다. to_complete에서 clear_all이 호출되어 Thread A의 Current가 정리된다. Thread B는 여전히 실행 중이며 영향받지 않는다.",
    a: { phase: "done", session: null, user: null },
    b: { phase: "active", session: "Session#87", user: "Bob" },
  },
  {
    id: 4,
    title: "Thread B 완료",
    description:
      "Thread B의 request도 완료된다. clear_all이 호출되어 Thread B의 Current도 정리된다. 전체 과정에서 두 thread의 값이 단 한 번도 섞이지 않았다.",
    a: { phase: "done", session: null, user: null },
    b: { phase: "done", session: null, user: null },
  },
];

const colors = {
  a: {
    bar: "#2563eb",
    activeBorder: "#93bbfd",
    valueBg: "#eff6ff",
    valueText: "#1d4ed8",
  },
  b: {
    bar: "#e11d48",
    activeBorder: "#fda4af",
    valueBg: "#fff1f2",
    valueText: "#be123c",
  },
};

function StateRow({ label, value, isDelegate, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px 0",
      }}
    >
      <span style={{ fontSize: 12, fontFamily: "monospace", color: "#737373" }}>
        {label}
        {isDelegate && (
          <span style={{ color: "#d4d4d4", marginLeft: 3 }}>(delegate)</span>
        )}
      </span>
      <span
        style={{
          fontSize: 12,
          fontFamily: "monospace",
          fontWeight: 600,
          padding: "2px 6px",
          borderRadius: 4,
          backgroundColor: value ? color.valueBg : "#f5f5f5",
          color: value ? color.valueText : "#a3a3a3",
          fontStyle: value ? "normal" : "italic",
        }}
      >
        {value ?? "nil"}
      </span>
    </div>
  );
}

function ThreadCard({ label, state, color }) {
  const isActive = state.phase === "active";
  const isDone = state.phase === "done";

  return (
    <div
      style={{
        borderRadius: 8,
        border: `1px solid ${isActive ? color.activeBorder : "#e5e5e5"}`,
        overflow: "hidden",
        transition: "all 0.3s ease",
        opacity: isDone ? 0.5 : 1,
      }}
    >
      <div
        style={{
          backgroundColor: color.bar,
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 11,
            fontFamily: "monospace",
            padding: "2px 6px",
            borderRadius: 4,
            backgroundColor: "rgba(255,255,255,0.15)",
            color:
              isDone || state.phase === "idle"
                ? "rgba(255,255,255,0.6)"
                : "#fff",
          }}
        >
          {isActive ? "실행 중" : isDone ? "완료" : "대기"}
        </span>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <StateRow
          label="session"
          value={state.session}
          color={color}
          isDelegate={false}
        />
        <StateRow
          label="user"
          value={state.user}
          isDelegate={!!state.user}
          color={color}
        />
      </div>
    </div>
  );
}

export default function ThreadSafety() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isOverlap = step === 1 || step === 2;

  return (
    <div
      style={{
        width: "100%",
        padding: "24px",
        background: "#fafafa",
        borderRadius: 8,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#262626",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Thread-Safety
        </h3>
        <p style={{ fontSize: 14, color: "#737373", margin: "4px 0 0" }}>
          동시 request에서 Current 인스턴스가 격리되는 과정
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backgroundColor:
                i === step ? "#262626" : i < step ? "#d4d4d4" : "#e5e5e5",
            }}
          />
        ))}
      </div>

      {/* Description */}
      <div
        style={{
          borderRadius: 8,
          border: "1px solid #e5e5e5",
          backgroundColor: "#fff",
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              padding: "2px 6px",
              borderRadius: 4,
              backgroundColor: "#f5f5f5",
              color: "#737373",
            }}
          >
            {step + 1}/{STEPS.length}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#262626" }}>
            {current.title}
          </span>
        </div>
        <p
          style={{ fontSize: 14, color: "#525252", lineHeight: 1.6, margin: 0 }}
        >
          {current.description}
        </p>
      </div>

      {/* Two threads */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        <ThreadCard
          label="Thread A — Alice"
          state={current.a}
          color={colors.a}
        />
        <ThreadCard label="Thread B — Bob" state={current.b} color={colors.b} />
      </div>

      {/* Isolation indicator */}
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          transition: "opacity 0.3s ease",
          opacity: isOverlap ? 1 : 0,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#737373",
            backgroundColor: "#f5f5f5",
            padding: "4px 10px",
            borderRadius: 12,
          }}
        >
          동시 실행 중 — 각 thread의 Current는 독립적
        </span>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: step === 0 ? "#d4d4d4" : "#525252",
            backgroundColor: "transparent",
            border: "none",
            cursor: step === 0 ? "not-allowed" : "pointer",
            padding: "6px 12px",
            borderRadius: 6,
            transition: "color 0.2s ease",
          }}
        >
          ← 이전
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: step === STEPS.length - 1 ? "#d4d4d4" : "#525252",
            backgroundColor: "transparent",
            border: "none",
            cursor: step === STEPS.length - 1 ? "not-allowed" : "pointer",
            padding: "6px 12px",
            borderRadius: 6,
            transition: "color 0.2s ease",
          }}
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
