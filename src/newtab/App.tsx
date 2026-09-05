import { useState } from "react";
import Chat from "./components/Chat";
import EmailDigest from "./components/EmailDigest";
import EmailProgress from "./components/EmailProgress";
import { useEmailDigest } from "./hooks/useEmailDigest";

export default function App() {
  const [chatMode, setChatMode] = useState(false);
  const digest = useEmailDigest();

  return (
    <main className={`app-root${chatMode ? " app-root--chat" : ""}`}>
      <section className={`hero-pane${chatMode ? " hero-pane--chat" : ""}`}>
        <div className={`hero-card panel${chatMode ? " hero-card--chat" : ""}`}>
          <div className="flag-strip" aria-hidden="true" />
          <Chat onModeChange={setChatMode} />
          <EmailProgress status={digest.status} statusMessage={digest.statusMessage} progress={digest.progress} />
        </div>
      </section>

      <EmailDigest
        hidden={chatMode}
        cards={digest.cards}
        statusMessage={digest.statusMessage}
        status={digest.status}
        error={digest.error}
        refresh={digest.refresh}
      />
    </main>
  );
}
