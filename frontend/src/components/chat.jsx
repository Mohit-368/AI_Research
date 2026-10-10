import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi, researchApi } from '../lib/api';
import Markdown from '../lib/markdown';

const CHAT_STYLES = `
  .ros-shell, .ros-shell * { box-sizing: border-box; }
  .ros-shell {
    --ros-bg: #10131b;
    --ros-surface: #151a26;
    --ros-surface-raised: #1d2434;
    --ros-border: rgba(160,177,220,.20);
    --ros-border-strong: rgba(163,186,240,.43);
    --ros-text: #edf2ff;
    --ros-muted: #aab5ca;
    --ros-soft: #7f8ba5;
    --ros-accent: #7ce7d5;
    position: fixed;
    inset: 0;
    z-index: 20;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    display: grid;
    grid-template-columns: clamp(176px, 18vw, 250px) minmax(0, 1fr) clamp(240px, 24vw, 340px);
    background: var(--ros-bg);
    color: var(--ros-text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 14px;
  }
  .ros-shell button, .ros-shell textarea { font: inherit; }
  .ros-shell button { color: inherit; }
  .ros-left, .ros-center, .ros-right { min-width: 0; min-height: 0; height: 100%; }
  .ros-left {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 22px 15px 14px;
    overflow: hidden;
    border: 1px solid var(--ros-border-strong);
    border-right-color: var(--ros-border);
    border-radius: 18px 0 0 18px;
    background: #111;
  }
  .ros-left-heading, .ros-panel-title {
    margin: 0;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
    letter-spacing: .07em;
    text-transform: uppercase;
  }
  .ros-left-heading::after, .ros-panel-title::after {
    display: block;
    content: "";
    width: 78%;
    margin-top: 10px;
    border-bottom: 1px solid var(--ros-border-strong);
  }
  .ros-left-heading { flex: 0 0 auto; }
  .ros-history {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 1px 3px 12px 0;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: #444 transparent;
  }
  .ros-history-empty { padding: 13px 5px; color: var(--ros-muted); font-size: 12px; line-height: 1.55; }
  .ros-history-item {
    width: 100%;
    min-width: 0;
    padding: 10px 9px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background .15s ease, border-color .15s ease;
  }
  .ros-history-item:hover, .ros-history-item.active { background: #1c1c1c; border-color: var(--ros-border); }
  .ros-history-icon { color: #d0ccc3; flex: 0 0 auto; font-size: 15px; line-height: 1.2; }
  .ros-history-copy { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
  .ros-history-copy strong { font-size: 12px; line-height: 1.4; font-weight: 550; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
  .ros-history-copy small { color: var(--ros-soft); font-size: 10px; }
  .ros-new-chat {
    flex: 0 0 auto;
    width: 100%;
    min-height: 39px;
    padding: 9px 10px;
    border: 1px solid var(--ros-border-strong);
    border-radius: 9px;
    background: transparent;
    text-align: center;
    cursor: pointer;
    transition: background .15s ease;
  }
  .ros-new-chat:hover { background: #242424; }
  .ros-user { position: relative; padding: 12px 0 0; border-top: 1px solid var(--ros-border); color: var(--ros-muted); font-size: 10px; line-height: 1.45; overflow: hidden; }
  .ros-user strong { display: block; padding-right: 42px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ros-text); font-size: 11px; font-weight: 550; }
  .ros-user button { position: absolute; right: 0; top: 14px; padding: 3px 5px; border: 1px solid var(--ros-border); border-radius: 5px; background: transparent; color: var(--ros-muted); font-size: 9px; cursor: pointer; }
  .ros-center {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-top: 1px solid var(--ros-border-strong);
    border-bottom: 1px solid var(--ros-border-strong);
    background: var(--ros-bg);
  }
  .ros-center-head {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    min-height: 77px;
    padding: 17px 20px 10px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    border-bottom: 1px solid rgba(255,255,255,.08);
  }
  .ros-title {
    max-width: min(78%, 660px);
    min-width: 180px;
    padding: 8px 20px;
    border: 1px solid var(--ros-border-strong);
    border-radius: 9px;
    overflow: hidden;
    color: var(--ros-text);
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 550;
    letter-spacing: .015em;
  }
  .ros-mobile-control { display: none; position: absolute; top: 20px; left: 14px; padding: 6px 9px; border: 1px solid var(--ros-border); border-radius: 7px; background: transparent; cursor: pointer; }
  .ros-chat-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: clamp(18px, 4vh, 36px) clamp(18px, 5vw, 66px) 24px;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: #444 transparent;
  }
  .ros-empty-state { max-width: 620px; margin: 13vh auto 40px; text-align: center; color: var(--ros-muted); }
  .ros-empty-symbol { width: 35px; height: 35px; margin: 0 auto 15px; display: grid; place-items: center; border: 1px solid var(--ros-border-strong); border-radius: 11px; color: var(--ros-text); font-size: 19px; }
  .ros-empty-state h1 { margin: 0 0 9px; color: var(--ros-text); font-size: clamp(22px, 2.5vw, 31px); line-height: 1.2; font-weight: 560; letter-spacing: -.035em; }
  .ros-empty-state p { max-width: 400px; margin: 0 auto; font-size: 13px; line-height: 1.7; }
  .ros-message { max-width: 790px; margin: 0 auto 27px; }
  .ros-question { margin-left: auto; width: fit-content; max-width: min(88%, 680px); padding: 12px 15px; border: 1px solid var(--ros-border); border-radius: 14px 14px 4px 14px; background: #191919; color: #f7f5f1; line-height: 1.6; overflow-wrap: anywhere; white-space: pre-wrap; }
  .ros-answer-label { display: flex; align-items: center; gap: 8px; margin: 24px 0 12px; color: var(--ros-muted); font-size: 10px; font-weight: 650; letter-spacing: .12em; text-transform: uppercase; }
  .ros-answer-label::before { content: ""; width: 17px; height: 17px; border: 1px solid var(--ros-border-strong); border-radius: 5px; }
  .ros-report { color: #deddd8; font-size: 13px; line-height: 1.8; overflow-wrap: anywhere; }
  .ros-report h1, .ros-report h2, .ros-report h3, .ros-report h4 { color: var(--ros-text); line-height: 1.35; letter-spacing: -.02em; }
  .ros-report h1 { font-size: 24px; }
  .ros-report h2 { margin-top: 28px; font-size: 20px; }
  .ros-report h3 { margin-top: 22px; font-size: 16px; }
  .ros-report p, .ros-report ul, .ros-report ol { margin: 12px 0; }
  .ros-report a { color: #f0e6c8; text-underline-offset: 3px; }
  .ros-report blockquote { margin: 16px 0; padding-left: 14px; border-left: 2px solid #777; color: var(--ros-muted); }
  .ros-report pre, .ros-report code { max-width: 100%; overflow-x: auto; }
  .ros-status { margin: 16px auto; max-width: 720px; padding: 13px 15px; border: 1px solid var(--ros-border); border-radius: 10px; color: var(--ros-muted); font-size: 12px; line-height: 1.6; }
  .ros-status.error { border-color: rgba(232,134,119,.55); color: #efb6aa; }
  .ros-loading-dot { display: inline-block; width: 7px; height: 7px; margin-right: 9px; border-radius: 50%; background: #e8e4db; animation: ros-pulse 1s ease-in-out infinite alternate; }
  @keyframes ros-pulse { from { opacity: .35; transform: scale(.8); } to { opacity: 1; transform: scale(1); } }
  .ros-lock-note { display: flex; align-items: center; gap: 8px; margin-top: 20px; color: var(--ros-soft); font-size: 11px; line-height: 1.5; }
  .ros-critique { margin-top: 28px; padding: 16px; border: 1px solid var(--ros-border); border-radius: 12px; }
  .ros-critique-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .ros-critique-head h3 { margin: 0; font-size: 15px; font-weight: 560; }
  .ros-score { padding: 5px 8px; border: 1px solid var(--ros-border-strong); border-radius: 8px; font-size: 12px; white-space: nowrap; }
  .ros-critique p { color: var(--ros-muted); font-size: 12px; line-height: 1.65; }
  .ros-critique-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; }
  .ros-critique-grid h4 { margin: 10px 0 4px; font-size: 12px; font-weight: 600; }
  .ros-critique-grid ul { padding-left: 17px; margin: 4px 0; color: var(--ros-muted); font-size: 11px; line-height: 1.55; }
  .ros-composer-wrap { flex: 0 0 auto; padding: 10px clamp(15px, 4vw, 46px) 17px; background: linear-gradient(0deg, var(--ros-bg) 75%, rgba(16,16,16,.9)); }
  .ros-composer {
    width: 100%;
    max-width: 920px;
    min-height: 48px;
    margin: 0 auto;
    padding: 5px 7px 5px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--ros-border-strong);
    border-radius: 11px;
    background: #141414;
    transition: border-color .15s ease, background .15s ease;
  }
  .ros-composer:focus-within { border-color: rgba(255,255,255,.75); background: #181818; }
  .ros-composer textarea { display: block; flex: 1; width: 100%; min-width: 0; min-height: 28px; max-height: 120px; padding: 6px 0; resize: vertical; border: 0; outline: 0; background: transparent; color: var(--ros-text); line-height: 1.5; font-size: 13px; }
  .ros-composer textarea::placeholder { color: #777773; }
  .ros-composer textarea:disabled { color: var(--ros-muted); opacity: .9; resize: none; }
  .ros-send { width: 31px; height: 31px; flex: 0 0 31px; display: grid; place-items: center; border: 1px solid var(--ros-border-strong); border-radius: 50%; background: #e9e5dc; color: #111 !important; font-size: 18px; line-height: 1; cursor: pointer; transition: opacity .15s ease, transform .15s ease; }
  .ros-send:hover:not(:disabled) { transform: translateY(-1px); }
  .ros-send:disabled { opacity: .28; cursor: not-allowed; }
  .ros-composer-hint { max-width: 920px; margin: 7px auto 0; padding: 0 2px; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--ros-soft); font-size: 10px; }
  .ros-right {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--ros-border-strong);
    border-left-color: var(--ros-border);
    border-radius: 0 18px 18px 0;
    background: #111;
  }
  .ros-sources-panel { display: flex; flex-direction: column; flex: 1 1 0; min-height: 0; overflow: hidden; padding: 21px 15px 13px; }
  .ros-panel-title { flex: 0 0 auto; text-align: center; }
  .ros-panel-title::after { width: 100%; margin-top: 9px; }
  .ros-source-count { color: var(--ros-soft); font-size: 10px; font-weight: 450; letter-spacing: 0; }
  .ros-source-list { min-height: 0; overflow-y: auto; overflow-x: hidden; margin-top: 10px; padding-right: 3px; display: flex; flex-direction: column; gap: 4px; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: #444 transparent; }
  .ros-source-empty { margin: 21px 2px; color: var(--ros-muted); font-size: 11px; line-height: 1.65; text-align: center; }
  .ros-source { min-width: 0; padding: 10px 2px; display: grid; grid-template-columns: 22px minmax(0,1fr); gap: 7px; border-bottom: 1px solid rgba(255,255,255,.11); }
  .ros-source-index { color: #bdb9b0; font-size: 10px; }
  .ros-source-copy { min-width: 0; }
  .ros-source-copy a { display: inline-block; color: #f0eee8; font-size: 11px; font-weight: 560; line-height: 1.5; text-decoration: none; overflow-wrap: anywhere; }
  .ros-source-copy a:hover { text-decoration: underline; text-underline-offset: 3px; }
  .ros-source-domain { margin-top: 3px; color: var(--ros-soft); font-size: 9px; overflow-wrap: anywhere; }
  .ros-source-copy p { margin: 7px 0 0; color: var(--ros-muted); font-size: 10px; line-height: 1.55; overflow-wrap: anywhere; }
  .ros-feedback-panel { flex: 0 0 auto; max-height: 48%; overflow-y: auto; padding: 15px; border-top: 1px solid var(--ros-border-strong); }
  .ros-feedback-title { margin: 0; text-align: center; font-size: 12px; font-weight: 600; }
  .ros-feedback-title::after { display: block; content: ""; width: 72%; margin: 8px auto 0; border-bottom: 1px solid var(--ros-border-strong); }
  .ros-feedback-copy { margin: 12px 0; color: var(--ros-muted); font-size: 11px; line-height: 1.6; }
  .ros-stars { display: flex; justify-content: center; gap: 7px; margin: 12px 0; }
  .ros-star { border: 0; padding: 2px; background: transparent; color: #666 !important; font-size: 20px !important; cursor: pointer; }
  .ros-star.selected { color: #f0e6bf !important; }
  .ros-star:disabled { opacity: .35; cursor: default; }
  .ros-feedback-text { width: 100%; min-height: 66px; padding: 9px; resize: vertical; border: 1px solid var(--ros-border); border-radius: 8px; outline: none; background: #151515; color: var(--ros-text); font-size: 11px !important; line-height: 1.55; }
  .ros-feedback-text:focus { border-color: var(--ros-border-strong); }
  .ros-feedback-submit { width: 100%; min-height: 34px; margin-top: 8px; border: 1px solid var(--ros-border-strong); border-radius: 8px; background: #e8e4db; color: #111 !important; font-size: 11px !important; font-weight: 600; cursor: pointer; }
  .ros-feedback-submit:disabled { opacity: .38; cursor: not-allowed; }
  .ros-feedback-success { padding: 10px; color: #d9e5d1; font-size: 11px; line-height: 1.55; text-align: center; }
  .ros-mobile-backdrop { display: none; }
  .ros-mobile-actions { display: none; }
  .ros-shell button:focus-visible, .ros-shell a:focus-visible, .ros-shell textarea:focus-visible { outline: 2px solid #eee7d9; outline-offset: 3px; }
  @media (min-width: 1400px) {
    .ros-shell { grid-template-columns: 245px minmax(0, 1fr) 330px; }
    .ros-left { padding-left: 19px; padding-right: 19px; }
    .ros-right { padding-right: 1px; }
  }
  @media (max-width: 860px) {
    .ros-shell { grid-template-columns: minmax(0, 1fr); }
    .ros-left { position: fixed; z-index: 8; inset: 0 auto 0 0; width: min(300px, 86vw); height: 100%; border-radius: 0 16px 16px 0; border: 1px solid var(--ros-border-strong); transform: translateX(-105%); transition: transform .2s ease; box-shadow: 20px 0 55px rgba(0,0,0,.35); }
    .ros-left.mobile-open { transform: translateX(0); }
    .ros-center { grid-column: 1; border-left: 1px solid var(--ros-border-strong); border-right: 1px solid var(--ros-border-strong); border-radius: 15px; }
    .ros-mobile-control { display: block; }
    .ros-mobile-actions { display: flex; position: absolute; top: 19px; right: 14px; gap: 6px; }
    .ros-mobile-actions button { padding: 6px 8px; border: 1px solid var(--ros-border); border-radius: 7px; background: #151515; font-size: 10px; cursor: pointer; }
    .ros-right { position: fixed; z-index: 9; inset: 0 0 0 auto; width: min(330px, 88vw); height: 100%; border-radius: 16px 0 0 16px; transform: translateX(105%); transition: transform .2s ease; box-shadow: -20px 0 55px rgba(0,0,0,.35); }
    .ros-right.mobile-open { transform: translateX(0); }
    .ros-mobile-backdrop { display: block; position: fixed; inset: 0; z-index: 7; border: 0; background: rgba(0,0,0,.56); }
    .ros-chat-scroll { padding: 22px 18px; }
  }
  @media (max-width: 520px) {
    .ros-center-head { min-height: 69px; padding-top: 17px; }
    .ros-title { max-width: 65%; min-width: 0; padding: 7px 9px; font-size: 12px; }
    .ros-composer-wrap { padding: 8px 11px 12px; }
    .ros-composer-hint { font-size: 9px; }
    .ros-question { max-width: 94%; }
    .ros-empty-state { margin-top: 9vh; }
    .ros-critique-grid { grid-template-columns: 1fr; gap: 8px; }
  }

  /* Subtle color accents: midnight blue, teal, and a touch of violet */
  .ros-shell {
    background: radial-gradient(ellipse at 51% -12%, rgba(88, 105, 205, .16), transparent 44%), var(--ros-bg);
  }
  .ros-left {
    background: linear-gradient(180deg, #151a29 0%, #11141e 100%);
  }
  .ros-center {
    background: radial-gradient(ellipse at 50% 0%, rgba(47, 158, 158, .09), transparent 52%), var(--ros-bg);
  }
  .ros-right {
    background: linear-gradient(180deg, #151827 0%, #11141d 100%);
  }
  .ros-left-heading::after, .ros-panel-title::after {
    border-bottom-color: rgba(124, 231, 213, .45);
  }
  .ros-history-item:hover, .ros-history-item.active {
    background: linear-gradient(105deg, rgba(77, 201, 186, .13), rgba(116, 126, 232, .10));
    border-color: rgba(124, 231, 213, .28);
  }
  .ros-history-icon { color: #79dfd2; }
  .ros-new-chat {
    border-color: rgba(124, 231, 213, .45);
    background: rgba(124, 231, 213, .055);
  }
  .ros-new-chat:hover { background: rgba(124, 231, 213, .13); }
  .ros-title {
    border-color: rgba(153, 177, 239, .48);
    background: linear-gradient(105deg, rgba(80, 110, 175, .08), rgba(92, 192, 180, .06));
  }
  .ros-empty-symbol {
    border-color: rgba(124, 231, 213, .5);
    background: rgba(124, 231, 213, .07);
    color: #86eadb;
    box-shadow: 0 0 24px rgba(61, 198, 181, .07);
  }
  .ros-question {
    border-color: rgba(119, 155, 238, .30);
    background: linear-gradient(135deg, rgba(53, 75, 132, .32), rgba(27, 65, 76, .42));
  }
  .ros-answer-label { color: #8fcfc9; }
  .ros-answer-label::before {
    border-color: rgba(124, 231, 213, .6);
    background: rgba(124, 231, 213, .10);
  }
  .ros-report a { color: #80dfdc; }
  .ros-report blockquote { border-left-color: #8c85df; }
  .ros-loading-dot { background: #7ce7d5; box-shadow: 0 0 12px rgba(124, 231, 213, .35); }
  .ros-critique {
    border-color: rgba(130, 145, 220, .28);
    background: linear-gradient(135deg, rgba(83, 93, 164, .08), rgba(47, 151, 145, .055));
  }
  .ros-score {
    border-color: rgba(124, 231, 213, .40);
    background: rgba(124, 231, 213, .07);
    color: #91e8db;
  }
  .ros-composer {
    border-color: rgba(151, 174, 226, .45);
    background: linear-gradient(110deg, #151a28, #141b25);
  }
  .ros-composer:focus-within {
    border-color: #77dcca;
    background: #171f2c;
    box-shadow: 0 0 0 3px rgba(119, 220, 202, .09);
  }
  .ros-send {
    border: 0;
    background: linear-gradient(135deg, #79e4d2, #a9b8ff);
    color: #101723 !important;
    box-shadow: 0 3px 12px rgba(91, 207, 193, .16);
  }
  .ros-source { border-bottom-color: rgba(145, 164, 218, .15); }
  .ros-source-index { color: #8d9bf0; }
  .ros-source-copy a { color: #a3e5e2; }
  .ros-source-copy a:hover { color: #d2fffa; }
  .ros-feedback-title::after { border-bottom-color: rgba(124, 231, 213, .4); }
  .ros-star.selected { color: #ffd477 !important; text-shadow: 0 0 12px rgba(255, 212, 119, .18); }
  .ros-feedback-text {
    border-color: rgba(151, 174, 226, .25);
    background: #151a27;
  }
  .ros-feedback-text:focus { border-color: rgba(124, 231, 213, .72); }
  .ros-feedback-submit {
    border: 0;
    background: linear-gradient(110deg, #79e4d2, #a7b8ff);
    color: #101723 !important;
  }
  .ros-feedback-success { color: #8ce5c5; }
  .ros-shell button:focus-visible, .ros-shell a:focus-visible, .ros-shell textarea:focus-visible {
    outline-color: #7ce7d5;
  }

`;

function getId(record) {
  return record?.id || record?._id || record?.messageId || '';
}

function shortDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
}

function hostName(url = '') {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function SourceItem({ source, index }) {
  const url = source.url || source.sourceUrl || source.link || '';
  const host = hostName(url);
  const title = source.title || source.name || host || `Research source ${index + 1}`;
  return (
    <article className="ros-source">
      <div className="ros-source-index">{String(index + 1).padStart(2, '0')}</div>
      <div className="ros-source-copy">
        {url ? <a href={url} target="_blank" rel="noreferrer noopener">{title} <span aria-hidden="true">↗</span></a> : <span>{title}</span>}
        {host && <div className="ros-source-domain">{host}</div>}
        {source.snippet && <p>{source.snippet}</p>}
      </div>
    </article>
  );
}

function Critique({ critique }) {
  if (!critique) return null;
  const blocks = [
    ['Strengths', critique.strengths],
    ['Weaknesses', critique.weaknesses],
    ['Missing context', critique.missingInformation || critique.missing_context],
    ['Suggestions', critique.suggestions],
  ].filter(([, items]) => Array.isArray(items) && items.length > 0);

  return (
    <section className="ros-critique">
      <div className="ros-critique-head">
        <h3>Evidence critique</h3>
        <span className="ros-score">{Number.isFinite(critique.score) ? critique.score : '–'} / 10</span>
      </div>
      {critique.feedback && <p>{critique.feedback}</p>}
      {blocks.length > 0 && <div className="ros-critique-grid">{blocks.map(([title, items]) => (
        <div key={title}><h4>{title}</h4><ul>{items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}</ul></div>
      ))}</div>}
      <p>Scores assess source quality and coverage, not guaranteed factual correctness.</p>
    </section>
  );
}

export default function Chat({ navigate, researchId, initialQuery = '' }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState(initialQuery);
  const [research, setResearch] = useState(null);
  const [locked, setLocked] = useState(Boolean(researchId));
  const [submitting, setSubmitting] = useState(false);
  const [loadingResearch, setLoadingResearch] = useState(Boolean(researchId));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const refreshHistory = useCallback(async () => {
    try {
      const result = await researchApi.list(1, 50);
      setHistory(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      if (requestError.status === 401) throw requestError;
    }
  }, []);

  useEffect(() => {
    let alive = true;
    async function init() {
      setAuthLoading(true);
      try {
        const me = await authApi.me();
        if (!alive) return;
        setUser(me.user);
        const result = await researchApi.list(1, 50);
        if (!alive) return;
        setHistory(Array.isArray(result.data) ? result.data : []);
      } catch (requestError) {
        if (!alive) return;
        if (requestError.status === 401) {
          const next = `${window.location.pathname}${window.location.search}`;
          navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
        } else {
          setError(requestError.message || 'Could not connect to the research API.');
        }
      } finally {
        if (alive) setAuthLoading(false);
      }
    }
    init();
    return () => { alive = false; };
  }, [navigate]);

  useEffect(() => {
    let alive = true;
    async function loadSelected() {
      if (!researchId) {
        setResearch(null);
        setLocked(false);
        setQuery(initialQuery);
        setLoadingResearch(false);
        setError('');
        setNotice('');
        setRating(0);
        setFeedback('');
        setFeedbackDone(false);
        return;
      }
      setLoadingResearch(true);
      setLocked(true);
      setError('');
      try {
        const result = await researchApi.get(researchId);
        if (!alive) return;
        const record = result.data;
        setResearch(record);
        setQuery(record.query || record.prompt || '');
        setRating(0);
        setFeedback('');
        setFeedbackDone(false);
      } catch (requestError) {
        if (!alive) return;
        setResearch(null);
        setError(requestError.message || 'Could not load this report.');
      } finally {
        if (alive) setLoadingResearch(false);
      }
    }
    if (!authLoading && user) loadSelected();
    return () => { alive = false; };
  }, [researchId, initialQuery, authLoading, user]);

  const output = research?.output || research?.writer_output || research?.report || '';
  const sources = useMemo(() => Array.isArray(research?.sources) ? research.sources : [], [research]);
  const currentTitle = research?.title || research?.query || (locked ? query : 'New research');

  const createResearch = async (value, retry = false) => {
    const topic = value.trim();
    if (!topic || submitting || (locked && !retry)) return;
    setQuery(topic);
    setLocked(true);
    setSubmitting(true);
    setError('');
    setNotice('');
    setResearch(null);
    try {
      const result = await researchApi.create(topic);
      const record = result.data;
      setResearch(record);
      setNotice('Research is complete. This chat is now locked to its original topic.');
      await refreshHistory();
      const id = getId(record);
      if (id) navigate(`/research/${id}`, { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Research could not be completed. You can retry this same topic or start a new chat.');
      if (requestError.payload?.researchId) await refreshHistory().catch(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  const startNew = () => {
    setQuery('');
    setResearch(null);
    setLocked(false);
    setError('');
    setNotice('');
    setRating(0);
    setFeedback('');
    setFeedbackDone(false);
    setSidebarOpen(false);
    setSourcesOpen(false);
    navigate('/app');
  };

  const openHistoryItem = (item) => {
    const id = getId(item);
    if (id) navigate(`/research/${id}`);
    setSidebarOpen(false);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* navigation still lets the user return to sign in */ }
    navigate('/');
  };

  const submitFeedback = async (event) => {
    event.preventDefault();
    const id = getId(research);
    if (!id || rating < 1 || feedbackBusy) return;
    setFeedbackBusy(true);
    setError('');
    try {
      await researchApi.feedback(id, rating, feedback.trim());
      setFeedbackDone(true);
    } catch (requestError) {
      setError(requestError.message || 'Feedback could not be sent.');
    } finally {
      setFeedbackBusy(false);
    }
  };

  if (authLoading) {
    return <main className="workspace-loading"><span className="loading-mark">R</span><p>Opening your research workspace…</p></main>;
  }

  return (
    <main className="ros-shell">
      <style>{CHAT_STYLES}</style>
      <aside className={`ros-left ${sidebarOpen ? 'mobile-open' : ''}`} aria-label="Recent chats">
        <h2 className="ros-left-heading">Recent chats <span style={{ color: 'var(--ros-soft)', fontWeight: 400 }}>· {history.length}</span></h2>
        <div className="ros-history">
          {history.length === 0 ? (
            <div className="ros-history-empty">Your research sessions will appear here after you complete the first one.</div>
          ) : history.map((item, index) => {
            const id = getId(item) || `history-${index}`;
            const activeId = researchId || getId(research);
            const active = Boolean(getId(item) && activeId && String(getId(item)) === String(activeId));
            return (
              <button key={id} className={`ros-history-item ${active ? 'active' : ''}`} onClick={() => openHistoryItem(item)} title={item.title || item.query || item.prompt || 'Research chat'}>
                <span className="ros-history-icon">◈</span>
                <span className="ros-history-copy"><strong>{item.title || item.query || item.prompt || 'Untitled research'}</strong><small>{shortDate(item.createdAt)}{item.status === 'failed' ? ' · Failed' : ''}</small></span>
              </button>
            );
          })}
        </div>
        <div className="ros-user"><strong>{user?.name || 'Researcher'}</strong>{user?.email || 'Signed in'}<button onClick={logout}>Sign out</button></div>
        <button className="ros-new-chat" onClick={startNew}>＋ New chat</button>
      </aside>

      {(sidebarOpen || sourcesOpen) && <button className="ros-mobile-backdrop" aria-label="Close panels" onClick={() => { setSidebarOpen(false); setSourcesOpen(false); }} />}

      <section className="ros-center" aria-label="Research chat">
        <header className="ros-center-head">
          <button className="ros-mobile-control" aria-label="Open recent chats" onClick={() => { setSidebarOpen(true); setSourcesOpen(false); }}>☰</button>
          <div className="ros-title" title={currentTitle}>{currentTitle}</div>
          <div className="ros-mobile-actions"><button onClick={() => { setSourcesOpen(true); setSidebarOpen(false); }}>Sources · {sources.length}</button><button onClick={startNew}>＋ Chat</button></div>
        </header>

        <div className="ros-chat-scroll" aria-live="polite">
          {!query && !research && !loadingResearch && !submitting && (
            <div className="ros-empty-state">
              <div className="ros-empty-symbol">⌕</div>
              <h1>What are you researching?</h1>
              <p>Ask one focused question. Your findings, supporting sources, and feedback will stay together in this chat.</p>
            </div>
          )}

          {query && (research || submitting || loadingResearch || locked) && <div className="ros-message"><div className="ros-question">{query}</div></div>}

          {(submitting || loadingResearch) && (
            <div className="ros-status"><span className="ros-loading-dot" />Research is in progress. Searching for sources, synthesizing the evidence, and checking limitations. Keep this chat open.</div>
          )}

          {error && !research && !submitting && !loadingResearch && (
            <div className="ros-status error" role="alert">
              {error}
              {locked && query && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}><button className="ros-new-chat" style={{ width: 'auto' }} onClick={() => createResearch(query, true)} disabled={submitting}>Retry this topic</button><button className="ros-new-chat" style={{ width: 'auto' }} onClick={startNew}>Start new chat</button></div>}
            </div>
          )}

          {research && !loadingResearch && (
            <div className="ros-message">
              <div className="ros-answer-label">Research report {shortDate(research.createdAt) && `· ${shortDate(research.createdAt)}`}</div>
              {notice && <div className="ros-status">{notice}</div>}
              {output ? <div className="ros-report"><Markdown>{output}</Markdown></div> : <div className="ros-status">No report text was returned for this research record.</div>}
              <Critique critique={research.critique} />
              <div className="ros-lock-note">⌑ This chat is locked to one topic. Choose <strong>New chat</strong> to research a different question.</div>
            </div>
          )}

          {!research && !locked && !submitting && !loadingResearch && error && <div className="ros-status">You can enter a question below to begin a new research chat.</div>}
        </div>

        <div className="ros-composer-wrap">
          <form className="ros-composer" onSubmit={(event) => { event.preventDefault(); createResearch(query); }}>
            <textarea
              aria-label="Research question"
              value={query}
              onChange={(event) => setQuery(event.target.value.slice(0, 1000))}
              maxLength={1000}
              minLength={3}
              rows={1}
              disabled={locked || submitting || loadingResearch}
              placeholder={locked ? 'This chat is locked to its original topic' : 'Ask a research question…'}
              required
            />
            <button className="ros-send" type="submit" aria-label="Start research" title={locked ? 'Start a new chat to ask another question' : 'Start research'} disabled={locked || submitting || query.trim().length < 3}>
              {submitting ? '…' : '↑'}
            </button>
          </form>
          <div className="ros-composer-hint"><span>{locked ? 'Topic locked · Start a new chat to ask another question' : 'One research topic per chat'}</span><span>{query.length}/1000</span></div>
        </div>
      </section>

      <aside className={`ros-right ${sourcesOpen ? 'mobile-open' : ''}`} aria-label="Sources and feedback">
        <section className="ros-sources-panel">
          <h2 className="ros-panel-title">Sources <span className="ros-source-count">({sources.length})</span></h2>
          <div className="ros-source-list">
            {sources.length === 0 ? (
              <div className="ros-source-empty">Sources will appear here when a research report is ready.</div>
            ) : sources.map((source, index) => <SourceItem key={source._id || source.url || source.link || index} source={source} index={index} />)}
          </div>
        </section>

        <section className="ros-feedback-panel">
          <h2 className="ros-feedback-title">Give feedback</h2>
          {!research ? (
            <p className="ros-feedback-copy">After your report is ready, rate its usefulness and leave feedback here.</p>
          ) : feedbackDone ? (
            <div className="ros-feedback-success">✓ Feedback received. Thank you for helping improve the research experience.</div>
          ) : (
            <>
              <p className="ros-feedback-copy">Was this report useful and well supported?</p>
              <form onSubmit={submitFeedback}>
                <div className="ros-stars" aria-label="Rate report">
                  {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" className={`ros-star ${rating >= value ? 'selected' : ''}`} onClick={() => setRating(value)} aria-label={`${value} out of 5 stars`}>★</button>)}
                </div>
                <textarea className="ros-feedback-text" value={feedback} onChange={(event) => setFeedback(event.target.value.slice(0, 2000))} placeholder="What was helpful or missing? (optional)" rows={3} />
                {error && <p className="ros-feedback-copy" role="alert" style={{ color: '#efb6aa' }}>{error}</p>}
                <button className="ros-feedback-submit" type="submit" disabled={rating < 1 || feedbackBusy}>{feedbackBusy ? 'Sending…' : 'Send feedback'}</button>
              </form>
            </>
          )}
        </section>
      </aside>
    </main>
  );
}
