'use strict';
const duration = 30 * 60 * 1000;
const storageKey = 'orbit.sampleSession.startedAt';
const countdown = document.querySelector('#countdown');
const progress = document.querySelector('#remaining');
let startTime = Date.now();
try {
  const saved = Number(localStorage.getItem(storageKey));
  if (Number.isFinite(saved) && saved > 0 && saved <= startTime) startTime = saved;
  localStorage.setItem(storageKey, String(startTime));
} catch { /* Timer remains usable when browser storage is unavailable. */ }
function updateCountdown() {
  const seconds = Math.max(0, Math.ceil((duration - (Date.now() - startTime)) / 1000));
  countdown.textContent = seconds === 0 ? 'Session ended' : `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  progress.value = seconds;
}
document.querySelector('#restart').addEventListener('click', () => {
  startTime = Date.now();
  try { localStorage.setItem(storageKey, String(startTime)); } catch {}
  updateCountdown();
});
function updateSummary() {
  const zones = document.querySelector('#zones').value;
  const area = document.querySelector('#travel-area').selectedOptions[0].textContent;
  document.querySelector('#summary').textContent = `${zones} ${zones === '1' ? 'zone' : 'zones'} · ${area} · 1 adult`;
}
document.querySelector('#zones').addEventListener('change', updateSummary);
document.querySelector('#travel-area').addEventListener('change', updateSummary);
const dialog = document.querySelector('#qr-dialog');
document.querySelector('#enlarge').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-qr').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
updateSummary();
updateCountdown();
setInterval(updateCountdown, 1000);
