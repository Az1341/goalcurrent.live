"use client";

import { useState } from "react";
import styles from "./info-pages.module.css";

const CONTACT_EMAIL = "info@goalcurrent.live";

const SUBJECT_OPTIONS = [
  "General Enquiry",
  "Score Error / Bug Report",
  "Advertising / Partnership",
  "Content Suggestion",
  "Other",
] as const;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [replyEmail, setReplyEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!subject) {
      setError("Please select a subject.");
      return;
    }
    if (!trimmedMessage) {
      setError("Please write a message.");
      return;
    }

    setError("");
    const body = `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[GoalCurrent] ${subject}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setReplyEmail(trimmedEmail);
    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.formSuccess} role="status">
        Thank you for your message! We will get back to you at {replyEmail} within
        24–48 hours.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className={styles.formLabel} htmlFor="gc-name">
        Your Name
      </label>
      <input
        id="gc-name"
        className={styles.formInput}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        autoComplete="name"
      />

      <label className={styles.formLabel} htmlFor="gc-email">
        Your Email Address
      </label>
      <input
        id="gc-email"
        className={styles.formInput}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        autoComplete="email"
      />

      <label className={styles.formLabel} htmlFor="gc-subject">
        Subject
      </label>
      <select
        id="gc-subject"
        className={styles.formSelect}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      >
        <option value="">— Select a subject —</option>
        {SUBJECT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <label className={styles.formLabel} htmlFor="gc-message">
        Your Message
      </label>
      <textarea
        id="gc-message"
        className={styles.formTextarea}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message here..."
      />

      {error ? (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className={styles.btnPrimary}>
        Send Message →
      </button>
    </form>
  );
}
