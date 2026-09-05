import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QUICK_ASK_PORT, type ChatMessageDto, type QuickAskResponse, type WebSourceDto } from "../../shared/types";
import {
  DEFAULT_GREETING_SUBTITLE,
  DEFAULT_GREETING_TITLE,
  getGreetingSubtitle,
  getGreetingTitle,
} from "../../shared/storage";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  streaming?: boolean;
  sources?: WebSourceDto[];
}

export default function Chat({ onModeChange }: { onModeChange: (chatMode: boolean) => void }) {
  const [greetingTitle, setGreetingTitle] = useState(DEFAULT_GREETING_TITLE);
  const [greetingSubtitle, setGreetingSubtitle] = useState(DEFAULT_GREETING_SUBTITLE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [grounded, setGrounded] = useState(false);
  const [status, setStatus] = useState<"idle" | "streaming" | "error">("idle");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getGreetingTitle().then((v) => {
      if (v) setGreetingTitle(v);
    });
    getGreetingSubtitle().then((v) => {
      if (v) setGreetingSubtitle(v);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    const trimmed = prompt.trim();
    if (!trimmed || status === "streaming") return;

    const history: ChatMessageDto[] = messages.map((m) => ({ role: m.role, text: m.text }));
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text: trimmed };
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "model", text: "", streaming: true }]);
    setPrompt("");
    setError("");
    setStatus("streaming");
    onModeChange(true);

    const port = chrome.runtime.connect({ name: QUICK_ASK_PORT });

    port.onMessage.addListener((message: QuickAskResponse) => {
      if (message.type === "chunk") {
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, text: m.text + message.text } : m)));
      } else if (message.type === "done") {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, streaming: false, sources: message.sources } : m)),
        );
        setStatus("idle");
        port.disconnect();
      } else if (message.type === "error") {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError(message.message);
        setStatus("error");
        port.disconnect();
      }
    });

    port.postMessage({ prompt: trimmed, grounded, history });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <div className="greeting">
        <h1 className="greeting-title">{greetingTitle}</h1>
        <p className="greeting-subtitle">{greetingSubtitle}</p>
      </div>

      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble chat-bubble--${m.role}`}>
            {m.role === "model" ? (
              <div className="markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text || (m.streaming ? "" : "…")}</ReactMarkdown>
                {m.streaming && <span className="chat-bubble__cursor" aria-hidden="true" />}
              </div>
            ) : (
              m.text
            )}
            {m.sources && m.sources.length > 0 && (
              <div className="chat-bubble__sources">
                <strong>Kaynaklar</strong>
                <ol>
                  {m.sources.map((s) => (
                    <li key={s.uri}>
                      <a href={s.uri} target="_blank" rel="noreferrer">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hızlı bir soru sor... (Enter ile gönder)"
          rows={2}
        />

        <div className="chat-input__row">
          <label className="chat-input__toggle">
            <input type="checkbox" checked={grounded} onChange={(e) => setGrounded(e.target.checked)} />
            🌐 Web'de ara
          </label>
          <button
            className="icon-btn icon-btn--accent"
            onClick={send}
            disabled={!prompt.trim() || status === "streaming"}
            title="Gönder"
            aria-label="Gönder"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>

        {status === "error" && (
          <p className="error-text">
            {error}{" "}
            <a href="#" onClick={() => chrome.runtime.openOptionsPage()}>
              Ayarları aç
            </a>
          </p>
        )}
      </div>
    </>
  );
}
