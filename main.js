// Download links point at the newest release's files; sections rise into view as they scroll in.
// Without JavaScript every download link still opens the release page.

const RELEASE_REPO = "smilefx/weft-app";
const RELEASES = `https://github.com/${RELEASE_REPO}/releases/latest`;

// Reveal the parts of each section as it scrolls into view, once.
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 })
  : null;
document.querySelectorAll("[data-reveal]").forEach((el) => (io ? io.observe(el) : el.classList.add("is-in")));

// Which download fits this computer. Apple silicon cannot be told apart from Intel by the
// user agent alone; WebGL's renderer name gives it away in most browsers.
function detectPlatform() {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac/i.test(ua)) {
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      const info = gl && gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "";
      if (/Apple M|Apple GPU/i.test(renderer)) return "mac-arm";
      if (/Intel|AMD|Radeon/i.test(renderer)) return "mac-intel";
    } catch {}
    return "mac-arm";
  }
  return null;
}

const LABELS = { windows: "Download for Windows", "mac-arm": "Download for Mac", "mac-intel": "Download for Mac (Intel)" };
const MATCH = {
  windows: (n) => /x64-setup\.exe$/i.test(n),
  "mac-arm": (n) => /aarch64\.dmg$/i.test(n),
  "mac-intel": (n) => /x64\.dmg$/i.test(n),
};
const urls = {};

const platform = detectPlatform();
const primary = document.querySelector("[data-primary-download]");
if (platform) {
  primary.querySelector("[data-primary-label]").textContent = LABELS[platform];
  window.weftSetPlatform?.(platform);
}

// The dialog's button follows the system picked in it.
function syncDialog() {
  const btn = document.querySelector("[data-dl]");
  if (btn) btn.href = urls[btn.dataset.asset] ?? RELEASES;
}
document.addEventListener("weft:asset", syncDialog);

fetch(`https://api.github.com/repos/${RELEASE_REPO}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
  .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  .then((release) => {
    const assets = release.assets ?? [];
    for (const [key, match] of Object.entries(MATCH)) {
      const asset = assets.find((a) => match(a.name));
      if (asset) urls[key] = asset.browser_download_url;
    }
    if (platform && urls[platform]) primary.href = urls[platform];
    syncDialog();
    const tag = (release.tag_name ?? "").replace(/^v/, "");
    if (tag) {
      const date = new Date(release.published_at).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });
      const version = document.querySelector("[data-version]");
      if (version) version.textContent = `Version ${tag}, released ${date}`;
      const foot = document.querySelector("[data-foot-version]");
      if (foot) foot.textContent = `Weft ${tag}, ${date}`;
    }
  })
  .catch(() => {});
