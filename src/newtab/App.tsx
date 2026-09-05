import { useState } from "react";
import Chat from "./components/Chat";
import EmailDigest from "./components/EmailDigest";
import ThemeSwitcher from "./theme/ThemeSwitcher";

export default function App() {
  const [chatMode, setChatMode] = useState(false);

  return (
    <main className={`app-root${chatMode ? " app-root--chat" : ""}`}>
      <section className={`hero-pane${chatMode ? " hero-pane--chat" : ""}`}>
        <div className={`hero-card panel${chatMode ? " hero-card--chat" : ""}`}>
          <div className="flag-strip" aria-hidden="true" />
          <Chat onModeChange={setChatMode} />
        </div>
      </section>

      <EmailDigest hidden={chatMode} />

      <ThemeSwitcher />
    </main>
  );
}
