"use client";

import { useEffect, useRef, useState } from "react";
import { FileVideo2, ImageIcon, Paperclip, Send, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/demo-accounts";
import type { DemoChatAttachment, DemoChatMessage } from "@/lib/demo-session";

type ChatPanelProps = {
  channel: "support" | "unit";
  initialMessages: DemoChatMessage[];
  currentUserId: string;
  locale: Locale;
  suggestions?: string[];
  compact?: boolean;
};

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];
const imageMax = 5 * 1024 * 1024;
const videoMax = 25 * 1024 * 1024;

function attachmentView(attachment: DemoChatAttachment) {
  if (attachment.kind === "image") {
    return <a href={attachment.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-md"><img src={attachment.url} alt={attachment.name} className="max-h-64 w-full object-cover" /></a>;
  }
  return <video src={attachment.url} controls preload="metadata" className="max-h-64 w-full rounded-md bg-black" aria-label={attachment.name} />;
}

export function ChatPanel({ channel, initialMessages, currentUserId, locale, suggestions = [], compact = false }: ChatPanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const ar = locale === "ar";

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [messages]);

  function addFiles(selected: FileList | null) {
    if (!selected) return;
    const incoming = Array.from(selected);
    if (files.length + incoming.length > 3) {
      setError(ar ? "يمكن إرفاق 3 ملفات فقط في الرسالة." : "You can attach up to 3 files per message.");
      return;
    }
    for (const file of incoming) {
      if (!allowedTypes.includes(file.type)) {
        setError(ar ? "المتاح: JPG وPNG وWebP وMP4 وWebM فقط." : "Allowed: JPG, PNG, WebP, MP4, and WebM only.");
        return;
      }
      const max = file.type.startsWith("image/") ? imageMax : videoMax;
      if (file.size > max) {
        setError(ar ? `الصور بحد أقصى 5MB والفيديو 25MB.` : "Images are limited to 5MB and videos to 25MB.");
        return;
      }
    }
    setError("");
    setFiles((current) => [...current, ...incoming]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function sendMessage(messageText = text) {
    const cleanText = messageText.trim();
    if ((!cleanText && files.length === 0) || pending) return;

    setPending(true);
    setError("");
    const formData = new FormData();
    formData.set("channel", channel);
    formData.set("text", cleanText);
    files.forEach((file) => formData.append("attachments", file));

    const response = await fetch("/api/demo/chat", { method: "POST", body: formData });
    const result = (await response.json()) as { messages?: DemoChatMessage[]; error?: string };

    if (!response.ok || !result.messages) {
      setError(result.error === "media_too_large"
        ? (ar ? "حجم الملف أكبر من الحد المسموح." : "A file exceeds the allowed size.")
        : (ar ? "تعذر إرسال الرسالة أو المرفق. حاول مرة أخرى." : "The message or attachment could not be sent."));
      setPending(false);
      return;
    }

    setMessages((current) => [...current, ...result.messages!]);
    setText("");
    setFiles([]);
    setPending(false);
  }

  return (
    <div className={`flex flex-col ${compact ? "h-full min-h-0" : "min-h-[560px]"}`}>
      <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto bg-[#eef1ee] p-3 sm:p-5" aria-live="polite">
        {messages.map((message) => {
          const own = message.authorId === currentUserId;
          return (
            <article key={message.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[86%] overflow-hidden rounded-md ${own ? "bg-[#292b29] text-white" : "border border-[#d8ddd9] bg-white"}`}>
                <div className="px-3.5 pt-3">
                  <div className="flex items-center justify-between gap-5">
                    <strong className={`text-xs ${own ? "text-white/75" : "text-[#315d4a]"}`}>{message.authorName}</strong>
                    <time className={`text-[0.68rem] ${own ? "text-white/55" : "text-[var(--muted)]"}`} dateTime={message.createdAt}>{new Intl.DateTimeFormat(ar ? "ar-EG" : "en-EG", { hour: "numeric", minute: "2-digit" }).format(new Date(message.createdAt))}</time>
                  </div>
                  {message.text && <p className="my-2 whitespace-pre-wrap text-sm leading-6">{message.text}</p>}
                </div>
                {message.attachments?.length ? <div className="grid gap-1 px-1 pb-1">{message.attachments.map((attachment) => <div key={attachment.id}>{attachmentView(attachment)}</div>)}</div> : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className="border-t border-[var(--line)] bg-white p-3 sm:p-4">
        {!compact && suggestions.length > 0 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setText(suggestion)} className="shrink-0 rounded-md border border-[var(--line)] px-3 py-2 text-xs font-bold hover:border-[var(--brand)] hover:text-[var(--brand)]">{suggestion}</button>)}</div>
        )}

        {files.length > 0 && <div className="mb-3 flex gap-2 overflow-x-auto">{files.map((file, index) => <div key={`${file.name}-${file.lastModified}`} className="flex min-w-0 shrink-0 items-center gap-2 rounded-md bg-[#edf0ed] px-3 py-2 text-xs"><span className="grid size-7 place-items-center rounded bg-white text-[var(--brand)]">{file.type.startsWith("image/") ? <ImageIcon className="size-4" /> : <FileVideo2 className="size-4" />}</span><span className="max-w-32 truncate" dir="ltr">{file.name}</span><button type="button" onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} className="grid size-7 place-items-center rounded hover:bg-white" aria-label={ar ? "حذف المرفق" : "Remove attachment"}><Trash2 className="size-3.5" /></button></div>)}</div>}

        <div className="flex items-end gap-2">
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple className="sr-only" onChange={(event) => addFiles(event.target.files)} />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={pending || files.length >= 3} className="grid size-11 shrink-0 place-items-center rounded-md bg-[#e5e9e6] text-[#3e4b44] hover:bg-[#d9dfdb] disabled:opacity-40" title={ar ? "إرفاق صورة أو فيديو" : "Attach image or video"} aria-label={ar ? "إرفاق صورة أو فيديو" : "Attach image or video"}><Paperclip className="size-5" /></button>
          <Textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} maxLength={300} rows={1} placeholder={ar ? "اكتب رسالة..." : "Write a message..."} aria-label={ar ? "نص الرسالة" : "Message text"} className="min-h-11 resize-none py-2.5" />
          <button type="button" onClick={() => void sendMessage()} disabled={pending || (!text.trim() && files.length === 0)} className="grid size-11 shrink-0 place-items-center rounded-md bg-[var(--terracotta)] text-white hover:bg-[#a9573e] disabled:cursor-not-allowed disabled:opacity-45" title={ar ? "إرسال" : "Send"} aria-label={ar ? "إرسال الرسالة" : "Send message"}><Send className="size-5 rtl-flip" aria-hidden="true" /></button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-[0.68rem] text-[var(--muted)]"><span className={error ? "font-bold text-[var(--danger)]" : ""}>{error || (ar ? "صور 5MB · فيديو 25MB · 3 ملفات" : "Images 5MB · Video 25MB · 3 files")}</span><span dir="ltr">{text.length}/300</span></div>
      </div>
    </div>
  );
}
