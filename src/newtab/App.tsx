import EmailDigest from "./components/EmailDigest";
import QuickAsk from "./components/QuickAsk";

export default function App() {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "#1a1a1a",
        background: "#fafafa",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 24,
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ margin: 0 }}>AI New Tab</h1>
        <QuickAsk />
      </section>

      <aside
        style={{
          width: 440,
          maxWidth: "40vw",
          borderLeft: "1px solid #e5e5e5",
          padding: 24,
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <EmailDigest />
      </aside>
    </main>
  );
}
