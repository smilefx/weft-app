// The interface fragments on the page: Weft's own theme presets, synthetic chats, and the small
// pieces of the app that work in place (chat switching, search, the todo flow, Warp, appearance,
// privacy mode). Every person, room and message here is made up.
// Runs at the end of <body>, before main.js; without it each fragment keeps its fallback.

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const icon = (id, cls = "ic") =>
    `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) {
      try {
        return JSON.parse(localStorage.getItem(k));
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch {}
    },
  };

  // --- Themes (from the app's theme.ts) ------------------------------------------------------

  const LIGHT_SHADOW =
    "0 1px 2px rgb(20 20 30 / 0.06), 0 0 0 1px rgb(20 20 30 / 0.05)";
  const DARK_SHADOW =
    "0 1px 2px rgb(0 0 0 / 0.4), 0 0 0 1px rgb(255 255 255 / 0.05)";
  const LABEL_NAMES = ["red", "orange", "yellow", "green", "teal", "blue", "purple", "pink", "brown", "gray"];
  const CODE_NAMES = ["keyword", "string", "number", "comment", "function", "type", "variable", "tag"];
  const users = (c) => Object.fromEntries(c.map((v, i) => [`user-${i}`, v]));
  const labels = (c) => Object.fromEntries(c.map((v, i) => [`label-${LABEL_NAMES[i]}`, v]));
  const code = (c) => Object.fromEntries(c.map((v, i) => [`code-${CODE_NAMES[i]}`, v]));

  const rgb = (hex) => {
    const n = parseInt(hex.slice(1, 7), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const hex2 = (v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
  /** `a` with `t` (0-1) of `b` mixed in. */
  function mix(a, b, t) {
    const x = rgb(a);
    const y = rgb(b);
    return `#${x.map((v, i) => hex2(v + (y[i] - v) * t)).join("")}`;
  }
  function luminance(hex) {
    const [r, g, b] = rgb(hex).map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(a, b) {
    const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  }
  /** Text colour readable on top of `hex` (as in theme.ts). */
  const onColor = (hex) =>
    contrast(hex, "#ffffff") >= contrast(hex, "#0b0d11") ? "#ffffff" : "#0b0d11";

  /** Surfaces, lines and text tones of a variant, worked out from its four seed colours. */
  function surfaceVars({ bg, panel, text, accent }, scheme) {
    return {
      app: bg,
      panel,
      sunk: mix(panel, bg, 0.5),
      hover: mix(panel, text, 0.06),
      active: mix(panel, text, 0.1),
      line: mix(panel, text, 0.1),
      line2: mix(panel, text, 0.17),
      text,
      muted: mix(text, panel, 0.28),
      faint: mix(text, panel, 0.42),
      accent,
      "on-accent": onColor(accent),
      shadow: scheme === "light" ? LIGHT_SHADOW : DARK_SHADOW,
    };
  }
  /** A whole variant from its seed and eight hues: red, orange, yellow, green, teal, blue, purple, pink. */
  function build(scheme, seed, h) {
    const base = surfaceVars(seed, scheme);
    const [red, orange, yellow, green, teal, blue, purple, pink] = h;
    return {
      ...base,
      ok: green,
      warn: scheme === "light" ? mix(yellow, orange, 0.4) : yellow,
      danger: red,
      "mail-tag": mix(teal, base.muted, 0.35),
      ...users([blue, pink, green, orange, purple, teal, mix(purple, pink, 0.5), mix(yellow, green, 0.5)]),
      ...labels([red, orange, yellow, green, teal, blue, purple, pink, mix(orange, base.faint, 0.45), base.faint]),
      ...code([purple, green, orange, base.faint, blue, yellow, red, teal]),
    };
  }

  const FAMILIES = [
    {
      id: "weft",
      name: "Weft",
      light: {
        app: "#eef1f5", panel: "#ffffff", sunk: "#f0f3f7", hover: "#e9edf2", active: "#e2e7ee",
        line: "#e3e7ed", line2: "#d2d8e1", text: "#131a25", muted: "#526071", faint: "#626f82",
        accent: "#3b5bdb", "on-accent": "#ffffff", ok: "#1d7a4a", warn: "#b26b00", danger: "#c93838",
        "mail-tag": "#4f7686",
        shadow: LIGHT_SHADOW,
        ...users(["#3b5bdb", "#c2365a", "#1b7646", "#a9530e", "#6d45c4", "#0e7480", "#9030ad", "#5f8f12"]),
        ...labels(["#d93a3f", "#e0670f", "#c79200", "#2b8f57", "#0f8f82", "#3b5bdb", "#7e45c4", "#c73a8f", "#94693f", "#76808c"]),
        ...code(["#cf222e", "#0a3069", "#0550ae", "#6e7781", "#8250df", "#953800", "#116329", "#1f6feb"]),
      },
      dark: {
        app: "#0e1014", panel: "#16191e", sunk: "#12151a", hover: "#1c2027", active: "#22262e",
        line: "#252a32", line2: "#333944", text: "#e7e9ee", muted: "#a0a7b4", faint: "#9ba4b2",
        accent: "#7c9cff", "on-accent": "#0b0d11", ok: "#4fd18b", warn: "#f5b84a", danger: "#ff7070",
        "mail-tag": "#8fb3c2",
        shadow: DARK_SHADOW,
        ...users(["#8daaff", "#ff9eb2", "#7cdda5", "#f4b77b", "#c4adff", "#71dedf", "#e3a3f4", "#b4e478"]),
        ...labels(["#ff7070", "#ff9a4d", "#f5c84c", "#5fd08f", "#4dd4c4", "#7c9cff", "#b49aff", "#ff8fc8", "#c99a74", "#9aa3b0"]),
        ...code(["#ff7b72", "#a5d6ff", "#79c0ff", "#8b949e", "#d2a8ff", "#ffa657", "#7ee787", "#79c0ff"]),
      },
    },
    {
      id: "midnight",
      name: "Midnight",
      light: build("light", { bg: "#e9e9ef", panel: "#ffffff", text: "#111116", accent: "#6a5cf0" },
        ["#d6334f", "#d9661a", "#b88700", "#1f9160", "#0f8c94", "#4e5ee8", "#8b46d8", "#c93f95"]),
      dark: {
        app: "#000000", panel: "#0b0b0e", sunk: "#060608", hover: "#141418", active: "#1c1c22",
        line: "#1a1a20", line2: "#2a2a33", text: "#f2f2f5", muted: "#a0a0ab", faint: "#6a6a75",
        accent: "#8b7bff", "on-accent": "#000000", ok: "#3ee08f", warn: "#ffc04d", danger: "#ff5c7a",
        "mail-tag": "#8fbfd0",
        shadow: DARK_SHADOW,
        ...users(["#8b7bff", "#ff7aa8", "#3ee08f", "#ff9248", "#e08bff", "#3fd8e8", "#c58bff", "#b8e64d"]),
        ...labels(["#ff5c7a", "#ff9248", "#ffd24d", "#3ee08f", "#3fd8c8", "#7b8bff", "#c58bff", "#ff7ad1", "#d1a27a", "#a0a0ab"]),
        ...code(["#c58bff", "#3ee08f", "#ffd24d", "#6a6a75", "#7b8bff", "#3fd8e8", "#ff9248", "#ff7aa8"]),
      },
    },
    {
      id: "nord",
      name: "Nord",
      light: build("light", { bg: "#e5e9f0", panel: "#f4f6f9", text: "#2e3440", accent: "#5e81ac" },
        ["#bf616a", "#c26a45", "#a98228", "#6f8f4e", "#4c8a8a", "#5e81ac", "#8f6a9b", "#a8628f"]),
      dark: {
        app: "#272c36", panel: "#2e3440", sunk: "#2b303b", hover: "#3b4252", active: "#434c5e",
        line: "#3b4252", line2: "#4c566a", text: "#eceff4", muted: "#c0c8d6", faint: "#8a93a6",
        accent: "#88c0d0", "on-accent": "#2e3440", ok: "#a3be8c", warn: "#ebcb8b", danger: "#bf616a",
        "mail-tag": "#8fbcbb",
        shadow: DARK_SHADOW,
        ...users(["#81a1c1", "#bf616a", "#a3be8c", "#d08770", "#b48ead", "#8fbcbb", "#c895bf", "#ebcb8b"]),
        ...labels(["#bf616a", "#d08770", "#ebcb8b", "#a3be8c", "#8fbcbb", "#81a1c1", "#b48ead", "#c895bf", "#a98a6d", "#8a93a6"]),
        ...code(["#81a1c1", "#a3be8c", "#b48ead", "#7b88a1", "#88c0d0", "#8fbcbb", "#d08770", "#81a1c1"]),
      },
    },
    {
      id: "dracula",
      name: "Dracula",
      light: build("light", { bg: "#f2eedc", panel: "#fffbeb", text: "#1f1f1f", accent: "#644ac9" },
        ["#cb3a2a", "#a34d14", "#846e15", "#14710a", "#036a96", "#3a5fb8", "#644ac9", "#a3144d"]),
      dark: {
        app: "#1e1f29", panel: "#282a36", sunk: "#21222c", hover: "#343746", active: "#44475a",
        line: "#343746", line2: "#44475a", text: "#f8f8f2", muted: "#c3c6d6", faint: "#7f84a3",
        accent: "#bd93f9", "on-accent": "#282a36", ok: "#50fa7b", warn: "#f1fa8c", danger: "#ff5555",
        "mail-tag": "#9fc4d4",
        shadow: DARK_SHADOW,
        ...users(["#8be9fd", "#ff79c6", "#50fa7b", "#ffb86c", "#bd93f9", "#66d9c7", "#d6a4ff", "#a6e22e"]),
        ...labels(["#ff5555", "#ffb86c", "#f1fa8c", "#50fa7b", "#8be9fd", "#8aa4ff", "#bd93f9", "#ff79c6", "#cfa47c", "#9ea3c0"]),
        ...code(["#ff79c6", "#f1fa8c", "#bd93f9", "#6272a4", "#50fa7b", "#8be9fd", "#ffb86c", "#ff79c6"]),
      },
    },
    {
      id: "catppuccin",
      name: "Catppuccin",
      light: build("light", { bg: "#e6e9ef", panel: "#eff1f5", text: "#4c4f69", accent: "#8839ef" },
        ["#d20f39", "#fe640b", "#df8e1d", "#40a02b", "#179299", "#1e66f5", "#8839ef", "#ea76cb"]),
      dark: {
        app: "#11111b", panel: "#1e1e2e", sunk: "#181825", hover: "#292c3c", active: "#313244",
        line: "#313244", line2: "#45475a", text: "#cdd6f4", muted: "#a6adc8", faint: "#7f849c",
        accent: "#cba6f7", "on-accent": "#1e1e2e", ok: "#a6e3a1", warn: "#f9e2af", danger: "#f38ba8",
        "mail-tag": "#8fbfcf",
        shadow: DARK_SHADOW,
        ...users(["#89b4fa", "#f38ba8", "#a6e3a1", "#fab387", "#cba6f7", "#94e2d5", "#f5c2e7", "#b4befe"]),
        ...labels(["#f38ba8", "#fab387", "#f9e2af", "#a6e3a1", "#94e2d5", "#89b4fa", "#cba6f7", "#f5c2e7", "#e3b99c", "#9399b2"]),
        ...code(["#cba6f7", "#a6e3a1", "#fab387", "#7f849c", "#89b4fa", "#f9e2af", "#eba0ac", "#89dceb"]),
      },
    },
    {
      id: "solarized",
      name: "Solarized",
      light: {
        app: "#eee8d5", panel: "#fdf6e3", sunk: "#f5eedb", hover: "#eee8d5", active: "#e6dfc8",
        line: "#e6dfc8", line2: "#d6cfb6", text: "#073642", muted: "#586e75", faint: "#93a1a1",
        accent: "#268bd2", "on-accent": "#fdf6e3", ok: "#859900", warn: "#b58900", danger: "#dc322f",
        "mail-tag": "#4a8a8c",
        shadow: LIGHT_SHADOW,
        ...users(["#268bd2", "#d33682", "#859900", "#cb4b16", "#6c71c4", "#2aa198", "#a33ea1", "#b58900"]),
        ...labels(["#dc322f", "#cb4b16", "#b58900", "#859900", "#2aa198", "#268bd2", "#6c71c4", "#d33682", "#8f6e4a", "#839496"]),
        ...code(["#859900", "#2aa198", "#d33682", "#93a1a1", "#268bd2", "#b58900", "#cb4b16", "#268bd2"]),
      },
      dark: build("dark", { bg: "#00212b", panel: "#002b36", text: "#d0d7d6", accent: "#268bd2" },
        ["#dc322f", "#cb4b16", "#b58900", "#859900", "#2aa198", "#268bd2", "#6c71c4", "#d33682"]),
    },
    {
      id: "rosepine",
      name: "Rosé Pine",
      light: build("light", { bg: "#f2e9e1", panel: "#fffaf3", text: "#575279", accent: "#907aa9" },
        ["#b4637a", "#d7827e", "#ea9d34", "#5d9a6c", "#56949f", "#286983", "#907aa9", "#c0659b"]),
      dark: build("dark", { bg: "#191724", panel: "#1f1d2e", text: "#e0def4", accent: "#c4a7e7" },
        ["#eb6f92", "#f0a77e", "#f6c177", "#95c9a4", "#9ccfd8", "#7fa8d9", "#c4a7e7", "#ebbcba"]),
    },
    {
      id: "gruvbox",
      name: "Gruvbox",
      light: build("light", { bg: "#f2e5bc", panel: "#fbf1c7", text: "#3c3836", accent: "#af3a03" },
        ["#9d0006", "#af3a03", "#b57614", "#79740e", "#427b58", "#076678", "#8f3f71", "#b16286"]),
      dark: build("dark", { bg: "#1d2021", panel: "#282828", text: "#ebdbb2", accent: "#fabd2f" },
        ["#fb4934", "#fe8019", "#fabd2f", "#b8bb26", "#8ec07c", "#83a598", "#d3869b", "#e78fb3"]),
    },
    {
      id: "tokyonight",
      name: "Tokyo Night",
      light: build("light", { bg: "#d5d6db", panel: "#e9e9ee", text: "#2f3550", accent: "#2e7de9" },
        ["#f52a65", "#b15c00", "#8c6c3e", "#587539", "#118c74", "#2e7de9", "#9854f1", "#c0478c"]),
      dark: build("dark", { bg: "#16161e", panel: "#1a1b26", text: "#c0caf5", accent: "#7aa2f7" },
        ["#f7768e", "#ff9e64", "#e0af68", "#9ece6a", "#73daca", "#7aa2f7", "#bb9af7", "#f39ac8"]),
    },
    {
      id: "everforest",
      name: "Everforest",
      light: build("light", { bg: "#efebd4", panel: "#fdf6e3", text: "#3c474d", accent: "#8da101" },
        ["#f85552", "#f57d26", "#dfa000", "#8da101", "#35a77c", "#3a94c5", "#df69ba", "#e0709f"]),
      dark: build("dark", { bg: "#232a2e", panel: "#2d353b", text: "#d3c6aa", accent: "#a7c080" },
        ["#e67e80", "#e69875", "#dbbc7f", "#a7c080", "#83c092", "#7fbbb3", "#d699b6", "#e5a3c1"]),
    },
    {
      id: "sand",
      name: "Sand",
      light: build("light", { bg: "#ece6dc", panel: "#faf7f2", text: "#2a241d", accent: "#b5532f" },
        ["#c4372f", "#c2631c", "#a7800a", "#4d8a3a", "#2c8580", "#3f6fb5", "#8051b0", "#b8457c"]),
      dark: build("dark", { bg: "#151210", panel: "#1d1916", text: "#ede4d8", accent: "#e0875f" },
        ["#f0746a", "#f0a060", "#e8c36a", "#9ccc7a", "#6fcfc4", "#86aef0", "#c29df0", "#f095c0"]),
    },
    {
      id: "lagoon",
      name: "Lagoon",
      light: build("light", { bg: "#e1ecec", panel: "#f7fbfb", text: "#0f2a2e", accent: "#0b7f86" },
        ["#cf3a4a", "#cc6a1f", "#a88600", "#2c8c55", "#0b7f86", "#2f6fd0", "#7a4fc8", "#c2468e"]),
      dark: build("dark", { bg: "#081416", panel: "#0d1c1f", text: "#dcefee", accent: "#3fc7c0" },
        ["#ff7a85", "#ffa266", "#f2cf5b", "#6edc98", "#3fc7c0", "#72a8ff", "#b69cff", "#ff8fcc"]),
    },
    {
      id: "contrast",
      name: "High contrast",
      light: {
        app: "#ffffff", panel: "#ffffff", sunk: "#f4f4f4", hover: "#e8e8e8", active: "#d9d9d9",
        line: "#6b6b6b", line2: "#2b2b2b", text: "#000000", muted: "#1f1f1f", faint: "#3d3d3d",
        accent: "#0037c8", "on-accent": "#ffffff", ok: "#006b2e", warn: "#8a4b00", danger: "#c00000",
        "mail-tag": "#005f80",
        shadow: "0 0 0 1px #6b6b6b",
        ...users(["#0037c8", "#b0003a", "#006b2e", "#8a4b00", "#5b1fb3", "#005f6b", "#8f0f8f", "#3f6b00"]),
        ...labels(["#c00000", "#a34700", "#7a5c00", "#006b2e", "#005f6b", "#0037c8", "#5b1fb3", "#a3005c", "#6b4a26", "#4d4d4d"]),
        ...code(["#a3005c", "#006b2e", "#7a5c00", "#4d4d4d", "#0037c8", "#005f6b", "#a34700", "#a3005c"]),
      },
      dark: {
        app: "#000000", panel: "#000000", sunk: "#0a0a0a", hover: "#1a1a1a", active: "#262626",
        line: "#5c5c5c", line2: "#9a9a9a", text: "#ffffff", muted: "#e0e0e0", faint: "#bdbdbd",
        accent: "#ffd400", "on-accent": "#000000", ok: "#3dff8b", warn: "#ffd400", danger: "#ff4d4d",
        "mail-tag": "#7fdfff",
        shadow: "0 0 0 1px #5c5c5c",
        ...users(["#5cc8ff", "#ff7ab6", "#3dff8b", "#ffa64d", "#d79bff", "#4dffff", "#ff8cff", "#c6ff4d"]),
        ...labels(["#ff4d4d", "#ffa64d", "#ffd400", "#3dff8b", "#4dffff", "#5cc8ff", "#d79bff", "#ff8cff", "#e0aa70", "#cfcfcf"]),
        ...code(["#ff8cff", "#3dff8b", "#ffd400", "#b0b0b0", "#6cc8ff", "#4dffff", "#ffa14d", "#ff8cff"]),
      },
    },
  ];
  const familyOf = (id) => FAMILIES.find((f) => f.id === id) ?? FAMILIES[0];
  /** The theme's accent, then its own hues, without doubles (ThemePicker.svelte). */
  const accentOptions = (v) => [
    ...new Set(
      [v.accent, ...["blue", "purple", "pink", "red", "orange", "green", "teal"].map((c) => v[`label-${c}`])].map((c) => c.toLowerCase()),
    ),
  ];

  // Everything set under "Make it yours" restyles every fragment; scheme, theme, accent and corners
  // are remembered, message style and density start at the app's defaults on every visit.
  const DEFAULT_LOOK = {
    mode: "light",
    theme: "weft",
    accent: null,
    layout: "flat",
    density: "comfortable",
    radius: 12,
  };
  // Looks saved before themes had a light and a dark variant.
  const LEGACY = {
    light: ["light", "weft"],
    dark: ["dark", "weft"],
    midnight: ["dark", "midnight"],
    nord: ["dark", "nord"],
    dracula: ["dark", "dracula"],
    mocha: ["dark", "catppuccin"],
    solarized: ["light", "solarized"],
    contrast: ["dark", "contrast"],
  };
  const saved = store.get("weft-site-look") ?? {};
  const [oldMode, oldTheme] = LEGACY[saved.preset] ?? [];
  const look = {
    ...DEFAULT_LOOK,
    ...(saved.mode ?? oldMode ? { mode: saved.mode ?? oldMode } : {}),
    ...(saved.theme ?? oldTheme ? { theme: saved.theme ?? oldTheme } : {}),
    ...(saved.accent ? { accent: saved.accent } : {}),
    ...(Number.isFinite(saved.radius) ? { radius: saved.radius } : {}),
  };
  if (!FAMILIES.some((f) => f.id === look.theme)) look.theme = "weft";
  if (!["system", "light", "dark"].includes(look.mode)) look.mode = "light";
  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  const schemeNow = () =>
    look.mode === "system" ? (systemDark.matches ? "dark" : "light") : look.mode;

  function applyLook() {
    const root = document.documentElement;
    const scheme = schemeNow();
    const vars = { ...familyOf(look.theme)[scheme] };
    if (look.accent) {
      vars.accent = look.accent;
      vars["on-accent"] = onColor(look.accent);
    }
    for (const [k, v] of Object.entries(vars))
      root.style.setProperty(`--${k}`, v);
    root.style.setProperty("--r", `${look.radius}px`);
    root.style.setProperty("--r2", `${Math.round(look.radius * 0.67)}px`);
    root.dataset.scheme = scheme;
    root.style.setProperty("--scheme", scheme);
    // Message style and density restyle every chat on the page, like the app's timeline.
    root.dataset.layout = look.layout;
    root.dataset.density = look.density;
    store.set("weft-site-look", {
      mode: look.mode,
      theme: look.theme,
      accent: look.accent,
      radius: look.radius,
    });
  }
  applyLook();

  // Service logos (ProviderLogo.svelte; glyphs from Simple Icons, CC0).
  const LOGOS = {
    gitlab: { color: "#FC6D26", path: "m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z" },
    moodle: { color: "#F98012", path: "M12 0C5.3726 0 0 5.3726 0 12s5.3726 12 12 12 12-5.3726 12-12S18.6274 0 12 0Zm1.1348 5.7402.0351.123-2.7363 1.9903c.3694.2606.7968.609 1.0078.8438l.0762.1035c-1.2878 2.2571-3.737 3.0557-6.3164 2.1816l.0195-.1601h-.002c-.0784-.5679-.0962-1.0524-.0585-1.463-.7507-.003-1.5298-.0402-2.2832-.0663l-.5157.0175c-.0994.8449-.0351 2.135-.0254 2.3223.3492 1.2819.2977 2.2907.295 3.5293-.4134-1.0028-.8995-2.097-.416-3.4668l-.0098-.3183c-.0007-.0143-.0683-1.1532.037-2.0625l-.4081.0136-.0371-.1191C5.7922 6.8402 8.5032 6.218 13.1348 5.7402Zm1.623 2.5137c1.2202 0 2.1885.2691 2.9043.8066.8138.601 1.2207 1.4866 1.2207 2.6582v5.6856h-2.7344v-5.3691c0-1.1225-.4634-1.6836-1.3906-1.6836-.9278 0-1.3906.561-1.3906 1.6836v5.3691h-2.7344v-5.3691c0-.5183-.0986-.9144-.293-1.1934.6172-.435 1.1534-1.0124 1.5723-1.7246.0297.029.0597.0574.0879.0879.5044-.6349 1.4233-.9512 2.7578-.9512zm-9.6094 3.2344c.932.3 1.8614.393 2.7364.287a3.5455 3.5455 0 0 0-.0098.2599v5.3691H5.1426v-5.6855c0-.0787.0022-.1544.0058-.2305z" },
    obsidian: { color: "#7C3AED", path: "M19.355 18.538a68.967 68.959 0 0 0 1.858-2.954.81.81 0 0 0-.062-.9c-.516-.685-1.504-2.075-2.042-3.362-.553-1.321-.636-3.375-.64-4.377a1.707 1.707 0 0 0-.358-1.05l-3.198-4.064a3.744 3.744 0 0 1-.076.543c-.106.503-.307 1.004-.536 1.5-.134.29-.29.6-.446.914l-.31.626c-.516 1.068-.997 2.227-1.132 3.59-.124 1.26.046 2.73.815 4.481.128.011.257.025.386.044a6.363 6.363 0 0 1 3.326 1.505c.916.79 1.744 1.922 2.415 3.5zM8.199 22.569c.073.012.146.02.22.02.78.024 2.095.092 3.16.29.87.16 2.593.64 4.01 1.055 1.083.316 2.198-.548 2.355-1.664.114-.814.33-1.735.725-2.58l-.01.005c-.67-1.87-1.522-3.078-2.416-3.849a5.295 5.295 0 0 0-2.778-1.257c-1.54-.216-2.952.19-3.84.45.532 2.218.368 4.829-1.425 7.531zM5.533 9.938c-.023.1-.056.197-.098.29L2.82 16.059a1.602 1.602 0 0 0 .313 1.772l4.116 4.24c2.103-3.101 1.796-6.02.836-8.3-.728-1.73-1.832-3.081-2.55-3.831zM9.32 14.01c.615-.183 1.606-.465 2.745-.534-.683-1.725-.848-3.233-.716-4.577.154-1.552.7-2.847 1.235-3.95.113-.235.223-.454.328-.664.149-.297.288-.577.419-.86.217-.47.379-.885.46-1.27.08-.38.08-.72-.014-1.043-.095-.325-.297-.675-.68-1.06a1.6 1.6 0 0 0-1.475.36l-4.95 4.452a1.602 1.602 0 0 0-.513.952l-.427 2.83c.672.59 2.328 2.316 3.335 4.711.09.21.175.43.253.653z" },
  };
  const serviceLogo = (id, size = 16) => {
    const l = LOGOS[id];
    const rad = size >= 28 ? 8 : size >= 20 ? 6 : 4;
    const glyph = size / 2 + 2;
    return `<span class="svc-logo" style="--s:${size}px;--rad:${rad}px;--c:${l.color}" aria-hidden="true"><svg viewBox="0 0 24 24" width="${glyph}" height="${glyph}"><path d="${l.path}" fill="currentColor"/></svg></span>`;
  };

  // --- People and chats ----------------------------------------------------------------------

  const PEOPLE = {
    anna: { name: "Anna Weber", c: 0 },
    jonas: { name: "Prof. Jonas Brandt", c: 2 },
    lukas: { name: "Lukas Hoffmann", c: 4 },
    sofia: { name: "Sofia Romano", c: 3 },
    daniel: { name: "Daniel Okafor", c: 5 },
    lea: { name: "Lea Fischer", c: 5 },
    mira: { name: "Mira Schulz", c: 1 },
    tom: { name: "Tom Becker", c: 7 },
    priya: { name: "Priya Nair", c: 6 },
    hannah: { name: "Hannah Vogel", c: 1 },
    jana: { name: "Jana Wolff", c: 4 },
    max: { name: "Max Keller", c: 7 },
    felix: { name: "Felix Braun", c: 3 },
    emre: { name: "Emre Yılmaz", c: 2 },
    elena: { name: "Elena Petrova", c: 6 },
    ben: { name: "Ben Albrecht", c: 3 },
  };
  const initials = (name) =>
    name
      .split(/[\s--]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  // Messages: [sender, time, text, extras]. `tag` marks the account a message arrived on in a linked chat.
  const ROOMS = [
    {
      id: "lab",
      name: "Machine Learning Lab",
      av: "ML",
      c: 5,
      acct: ["uni"],
      time: "13:24",
      unread: 10,
      reply: true,
      fav: true,
      members: 6,
      lock: true,
      preview:
        "Daniel: Quick question: should the user study appendix go into the supplementary material?",
      msgs: [
        [
          "lukas",
          "12:31",
          "Ablation runs finished overnight. All 5 seeds, results are in the sheet above.",
        ],
        [
          "lukas",
          "12:32",
          "Std dev is down to 0.4 after the seed fix.",
          { react: ["🎉", 3] },
        ],
        [
          "sofia",
          "12:43",
          "Lab meeting moves to Thursday 14:00 in E23. Half of us are at the faculty retreat on the usual day.",
        ],
        [
          "daniel",
          "12:48",
          "Works for me.",
          { quote: ["sofia", "Lab meeting moves to Thursday 14:00 in E23."] },
        ],
        [
          "lea",
          "13:00",
          "Who's bringing cake for Lukas' birthday on Thursday?",
        ],
        [
          "sofia",
          "13:02",
          "I'll do it!",
          {
            quote: [
              "lea",
              "Who's bringing cake for Lukas' birthday on Thursday?",
            ],
            read: ["lukas"],
          },
        ],
        [
          "jonas",
          "13:09",
          "@Anna Weber did you get a chance to look at the reviewer responses from the workshop paper?",
          { chip: "needs reply", mention: true },
        ],
        [
          "lukas",
          "13:13",
          "Heads-up: the GPU cluster is down for maintenance on Saturday 08:00-14:00, plan your runs accordingly.",
          { chip: "calendar" },
        ],
        [
          "lukas",
          "13:15",
          "@Anna Weber could you check the colours of Figure 3 before Wednesday? Then I regenerate all plots for the camera-ready.",
          { chip: "todo", mention: true },
        ],
        [
          "daniel",
          "13:24",
          "Quick question: should the user study appendix go into the supplementary material or the main paper?",
          { chip: "needs reply", read: ["lea", "jonas"] },
        ],
      ],
    },
    {
      id: "mira",
      name: "Mira Schulz",
      av: "MS",
      c: 1,
      acct: ["example"],
      time: "13:11",
      unread: 2,
      reply: true,
      dm: "mira",
      online: true,
      lock: true,
      preview: "Do you want to grab dinner with Tom on the first evening?",
      msgs: [
        [
          "mira",
          "Mon 19:00",
          "Found a hotel near the venue in Vienna, 600 m walk. Shall I book two rooms?",
        ],
        [
          "anna",
          "Mon 19:20",
          "Yes please! Arrival on the evening before the conference.",
        ],
        ["mira", "08:30", "Booked. The confirmation is in your inbox."],
        [
          "mira",
          "13:05",
          "Coffee on Sunday at 10 at Café Rathaus before you leave?",
          { chip: "calendar" },
        ],
        [
          "mira",
          "13:11",
          "Do you want to grab dinner with Tom on the first evening? He knows a great place near the Naschmarkt.",
          { chip: "needs reply" },
        ],
      ],
    },
    {
      id: "chi",
      name: "CHI '27 Paper - Writing",
      av: "C2",
      c: 1,
      acct: ["uni"],
      time: "12:55",
      unread: 2,
      reply: true,
      members: 5,
      lock: true,
      preview: "Priya: Yes, I'd add one sentence on robustness.",
      msgs: [
        [
          "priya",
          "Yesterday",
          "I pushed my edits to the discussion section. Mostly tightened the limitations paragraph.",
        ],
        ["anna", "Yesterday", "Thanks Priya! I'll merge them tonight."],
        [
          "jonas",
          "11:14",
          "@Anna Weber the abstract is at 248 words, we have 2 to spare.",
          { mention: true },
        ],
        [
          "sofia",
          "12:14",
          "Should we mention the 5-seed results in the abstract?",
        ],
        [
          "priya",
          "12:55",
          "Yes, I'd add one sentence on robustness.",
          {
            quote: [
              "sofia",
              "Should we mention the 5-seed results in the abstract?",
            ],
          },
        ],
      ],
    },
    {
      id: "moodle",
      name: "HCI tutors",
      av: "HT",
      c: 3,
      acct: ["aweber"],
      plugin: "moodle",
      time: "12:30",
      unread: 1,
      members: 4,
      preview: "Elena: Sheet 5 is graded, the marks are in Moodle.",
      msgs: [
        ["ben", "Mon 16:10", "Could someone take the Thursday tutorial next week?"],
        ["anna", "Mon 16:22", "I can do it."],
        ["elena", "12:30", "Sheet 5 is graded, the marks are in Moodle."],
      ],
    },
    {
      id: "daniel",
      name: "Daniel Okafor",
      av: "DO",
      c: 5,
      acct: ["uni", "mail"],
      linked: true,
      time: "12:48",
      unread: 2,
      reply: true,
      dm: "daniel",
      online: true,
      lock: true,
      preview: "And could we move our meeting to Tuesday afternoon?",
      msgs: [
        [
          "daniel",
          "Mon 14:52",
          "Hi Anna, attached is the draft of chapter 2. The evaluation design is still rough, so feedback on the research questions would help most.",
          {
            tag: "mail",
            mail: {
              subject: "Thesis chapter 2, draft attached",
              file: ["thesis_chapter2_draft.pdf", "1.8 MB"],
            },
          },
        ],
        [
          "daniel",
          "Mon 15:00",
          "Hi Anna, I've sent you chapter 2 of my thesis by mail.",
          { tag: "uni" },
        ],
        [
          "anna",
          "Mon 15:20",
          "Great, I'll give you feedback early next week.",
          { tag: "uni" },
        ],
        [
          "daniel",
          "12:46",
          "One more question: is it okay if I use the lab's GPU cluster for the final experiments, or do I need to request access?",
          { chip: "needs reply", tag: "uni" },
        ],
        [
          "daniel",
          "12:48",
          "And could we move our meeting to Tuesday afternoon?",
          { tag: "uni" },
        ],
      ],
    },
    {
      id: "jonas",
      name: "Prof. Jonas Brandt",
      av: "PJ",
      c: 2,
      acct: ["uni", "example"],
      time: "10:31",
      unread: 1,
      linked: true,
      dm: "jonas",
      lock: true,
      preview: "Also: the department covers the conference dinner.",
      msgs: [
        [
          "jonas",
          "Fri 17:02",
          "Could you represent the group at the faculty retreat panel?",
          { tag: "uni" },
        ],
        ["anna", "Fri 17:30", "Sure, happy to.", { tag: "uni" }],
        [
          "jonas",
          "Yesterday",
          "Sent you the UIST budget details by mail. Let me know if the hotel is within the limit.",
          { tag: "example" },
        ],
        [
          "anna",
          "Yesterday",
          "Will check tomorrow, thanks!",
          { tag: "example" },
        ],
        [
          "jonas",
          "10:31",
          "Also: the department covers the conference dinner.",
          { tag: "example" },
        ],
      ],
    },
    {
      id: "sem",
      name: "Seminar: Human-AI Interaction",
      av: "SH",
      c: 4,
      acct: ["uni"],
      time: "09:55",
      unread: 6,
      members: 19,
      preview: "Jana: Same question for us, the demo is a GIF.",
      msgs: [
        [
          "jana",
          "08:44",
          "Our group chose the paper on explanation styles for AI decisions, is that still free?",
        ],
        [
          "max",
          "09:04",
          "Is the template for the written summary available somewhere?",
        ],
        [
          "felix",
          "09:44",
          "I think it's in the Materials folder, second file from the top.",
          {
            quote: [
              "max",
              "Is the template for the written summary available somewhere?",
            ],
          },
        ],
        [
          "hannah",
          "09:49",
          "@Anna Weber we uploaded our slides, could you check whether the embedded video plays?",
          { mention: true, chip: "needs reply" },
        ],
        ["jana", "09:55", "Same question for us, the demo is a GIF."],
      ],
    },
    {
      id: "priya",
      name: "Priya Nair",
      av: "PN",
      c: 6,
      acct: ["mail"],
      mail: true,
      dm: "priya",
      addr: "priya.nair@research.example",
      time: "Yesterday",
      unread: 1,
      preview: "Joint workshop proposal: one-pager and call",
      msgs: [
        [
          "priya",
          "Thu 09:12",
          "Hi Anna, could you send me your bio for the organiser list? Three or four sentences are enough.",
          { mail: { subject: "Organisers for the workshop" } },
        ],
        [
          "anna",
          "Thu 10:05",
          "Hi Priya, here it is. Happy to shorten it if the others are briefer.",
          {
            mail: {
              subject: "Re: Organisers for the workshop",
              file: ["bio_anna_weber.txt", "1.1 KB"],
            },
          },
        ],
        [
          "priya",
          "Yesterday",
          "Attached is a first one-pager for our CHI workshop on grounded assistants. Would Tuesday at 15:00 work for a 45-minute call to go through it?",
          {
            mail: {
              subject: "Joint workshop proposal: one-pager and call",
              file: ["workshop_onepager_v1.pdf", "402.3 KB"],
            },
          },
        ],
      ],
    },
    {
      id: "uist",
      name: "UIST Vienna Trip",
      av: "UV",
      c: 4,
      acct: ["example"],
      time: "08:16",
      unread: 0,
      members: 4,
      lock: true,
      preview: "Mira: Shared the hotel confirmation in the files.",
      msgs: [
        [
          "tom",
          "Mon 12:00",
          "Talk slot confirmed: Wednesday 11:20, session 4B.",
        ],
        ["priya", "Mon 12:14", "Congrats! Dry run beforehand?"],
        ["tom", "Mon 12:20", "Tuesday evening at the hotel?"],
        ["mira", "08:16", "Shared the hotel confirmation in the files."],
      ],
    },
  ];

  const MAILS = [
    {
      from: "Elena Petrova",
      subject: "Room bookings for the winter term",
      text: "Please confirm your seminar room bookings by Friday. Rooms not confirmed go back to the pool.",
      time: "11:02",
      label: ["Admin", "orange"],
      reply: true,
    },
    {
      from: "Mira Schulz",
      subject: "Hotel confirmation, Vienna",
      text: "Booking confirmed: two rooms, 600 m from the venue, arrival on the evening before the conference.",
      time: "08:31",
      label: ["Conference", "pink"],
    },
    {
      from: "Daniel Okafor",
      subject: "Thesis chapter 2 (draft)",
      text: "Hi Anna, attached is chapter 2. The evaluation design is still rough, feedback on the research questions would help most.",
      time: "Mon",
      label: ["Thesis supervision", "purple"],
      reply: true,
    },
    {
      from: "Prof. Jonas Brandt",
      subject: "UIST budget details",
      text: "Travel and hotel are covered up to the department limit. The conference dinner is on the department this year.",
      time: "Yesterday",
      label: ["Conference", "pink"],
    },
  ];

  const roomById = (id) => ROOMS.find((r) => r.id === id);
  const person = (k) => PEOPLE[k] ?? { name: k, c: 0 };

  // --- Small builders ------------------------------------------------------------------------

  const avatar = (text, c, cls = "av", personKey) =>
    `<span class="${cls}"${personKey ? ` data-person="${personKey}"` : ""} style="--u:var(--user-${c})">${esc(text)}</span>`;
  // Avatar shapes as in the app (Avatar.svelte): people and direct chats a rounded square, group
  // rooms a circle.
  const roomAv = (r, cls) => (r.mail || r.dm ? cls : `${cls} av-room`);
  const acctTag = (a) =>
    a === "mail"
      ? `<span class="tag tag-mail" title="Mail">${icon("mail", "ic ic-12")}</span>`
      : `<span class="tag tag-${a}">${a}</span>`;
  const label = (name, color) =>
    `<span class="lbl" style="--l:var(--label-${color})">${esc(name)}</span>`;

  // EventTile.svelte: name, account tag (linked chats), time, the AI's tags, the lock; continuation
  // rows show their time in the gutter on hover; read receipts sit at the bottom right.
  function messageHtml(m, i, list, lock = true, fresh = false) {
    const [who, time, text, x = {}] = m;
    const p = person(who);
    const mine = who === "anna";
    const prev = list[i - 1];
    const cont =
      !fresh && prev && prev[0] === who && !x.quote && !x.mail && !prev[3]?.mail;
    const body = esc(text).replace(
      /@Anna Weber/,
      `<span class="mention"><span class="pill-av">A</span>Anna Weber</span>`,
    );
    const q = x.quote && person(x.quote[0]);
    const quote = x.quote
      ? `<span class="quote"><span class="q-head">${icon("reply", "ic ic-s")}${avatar(initials(q.name), q.c, "av av-14")}<b style="color:var(--user-${q.c})">${esc(q.name)}</b></span><span class="q-text">${esc(x.quote[1])}</span></span>`
      : "";
    const chip = x.chip
      ? `<span class="chip chip-reply">${icon(x.chip === "needs reply" ? "reply" : "go", "ic ic-12")}${x.chip === "needs reply" ? x.chip : x.chip[0].toUpperCase() + x.chip.slice(1)}</span>`
      : "";
    const tag = x.tag ? acctTag(x.tag) : "";
    const react = x.react
      ? `<div class="reacts"><span class="react">${x.react[0]}<span>${x.react[1]}</span></span></div>`
      : "";
    const receipts = x.read
      ? `<span class="receipts">${x.read.map((k) => `<span class="receipt">${avatar(initials(person(k).name), person(k).c, "av av-20")}</span>`).join("")}</span>`
      : "";
    const letter = x.mail
      ? `<div class="letter"><div class="letter-top"><span class="letter-subject">${icon("mail", "ic ic-16")}<span>${esc(x.mail.subject)}</span></span></div><div class="letter-body"><p>${body}</p>${x.mail.file ? `<span class="rd-file"><span class="file-ic${x.mail.file[0].endsWith(".pdf") ? "" : " file-text"}">${icon("file", "ic ic-14")}</span><b>${esc(x.mail.file[0])}</b><small>${x.mail.file[1]}</small></span>` : ""}</div></div>`
      : "";
    return `<div class="msg${mine ? " mine" : ""}${cont ? " cont" : ""}${x.mail ? " is-mail" : ""}">
      ${cont ? `<span class="av-gap"><span class="cont-time">${esc(time)}</span></span>` : avatar(initials(p.name), p.c, "av who", who)}
      <div class="msg-main">
        ${cont ? "" : `<div class="msg-head"><b class="who" data-person="${who}" style="color:var(--user-${p.c})">${esc(p.name)}</b>${tag}<span class="time">${esc(time)}</span>${chip}</div>`}
        <div class="bubble">${letter || `${quote}<span>${body}</span>`}</div>
        ${react}
      </div>${receipts}
    </div>`;
  }

  // A todo card (TodosPage.svelte): round check, title, a quote or the description, then due date,
  // labels and the chat it came from on one line. Suggestions are dashed with Add and dismiss.
  function todoCardHtml(t, { sugg = false, done = false, col = "" } = {}) {
    const showDue = !done && t.due && (t.overdue || col !== "today" || sugg);
    const due = showDue
      ? `<span class="due${t.overdue ? " overdue" : t.due === "17:00" ? " today" : ""}">${icon("clock", "ic")}${t.due}</span>`
      : "";
    const from = t.from
      ? `<span class="sg-from">${acctTag("uni").replace('class="tag', 'class="tag tag-sm')}<span>${esc(t.from)}</span></span>`
      : "";
    const lbl = (t.labels ?? (t.label ? [t.label] : []))
      .map((l) => label(...l).replace('class="lbl"', 'class="lbl lbl-sm"'))
      .join("");
    const check = sugg
      ? `<span class="circle dashed"></span>`
      : `<button type="button" class="circle${done ? " on" : ""}" data-done="${t.id}" aria-pressed="${done}" aria-label="Done">${icon("check", "ic ic-12")}</button>`;
    // TodosPage.svelte: a linked todo's context line, in the card's two columns.
    const ctx = t.link
      ? `<span class="ctx-logo">${serviceLogo(t.link.plugin)}</span><span class="ctx-main"><span class="proj" style="--p:var(--label-${t.link.hue})">${esc(t.link.project)}</span><span class="ctx-ref">${esc(t.link.ref)}</span><span class="comp-fill"></span><span class="ctx-why" title="${esc(t.link.why)}">${icon(t.link.icon, "ic ic-14")}</span></span>`
      : "";
    return `<div class="card${done ? " done" : ""}${sugg ? " sugg-card" : ""}${t.link && !done ? " linked" : ""}">
      ${t.link && !done ? ctx : ""}
      ${check}
      <span class="sg-main">
        <span class="sg-top"><b>${esc(t.title)}</b>${sugg ? `<span class="sg-acts"><button type="button" class="sg-x btn-ui" data-take="${t.id}" title="Add">${icon("plus", "ic ic-16")}</button><button type="button" class="sg-x btn-ui" data-drop="${t.id}" title="Dismiss">${icon("close", "ic ic-14")}</button></span>` : ""}</span>
        ${done ? "" : t.quote ? `<span class="sg-q">"${esc(t.quote)}"</span>` : t.note ? `<span class="sg-note">${esc(t.note)}</span>` : ""}
        ${done || !(due || lbl || from) ? "" : `<span class="sg-meta">${due}${lbl}${from}</span>`}
      </span>
    </div>`;
  }

  // ChatRunCard.svelte: a chat's messages as a card, its name in a --sunk head that opens the chat.
  function runCardHtml(r, msgs, time, extra = "") {
    return `<section class="run">
      <button type="button" class="run-head" data-room="${r.id}">${avatar(r.av, r.c, roomAv(r, "av av-xs"))}<span class="run-name">${esc(r.name)}</span>${r.acct.map((a) => acctTag(a).replace('class="tag', 'class="tag tag-sm')).join("")}<span class="comp-fill"></span><span class="run-time">${time}</span>${icon("arrow", "ic ic-16 ic-mute")}</button>
      <div class="run-block">${msgs.map((m, i, l) => messageHtml(m, i, l, r.lock)).join("")}${extra}</div>
    </section>`;
  }

  // --- Logos (the app's Logo.svelte: geometry from brandGlyphs.ts, colours from the theme) ---

  const MARKS = {
    weft: {
      under: "M121 168L211 344L301 168",
      over: "M211 168L301 344L391 168",
      cx: 256,
      cy: 256,
    },
    warp: {
      under:
        "M121 168C137.2 277.12 166 344 211 344C256 344 284.8 277.12 301 168",
      over: "M211 168C227.2 277.12 256 344 301 344C346 344 374.8 277.12 391 168",
      cx: 256,
      cy: 315.63,
    },
  };
  let logoSeq = 0;
  function logo(kind, size) {
    const m = MARKS[kind],
      id = `lg${++logoSeq}`;
    const grad =
      kind === "warp"
        ? `<linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="g1"/><stop offset=".55" class="g2"/><stop offset="1" class="g3"/></linearGradient>`
        : "";
    return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 512 512" aria-hidden="true"><defs>
      <mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><rect width="512" height="512" fill="#fff"/>
      <clipPath id="${id}-c"><circle cx="${m.cx}" cy="${m.cy}" r="70.4"/></clipPath>
      <path d="${m.over}" fill="none" stroke="#000" stroke-width="70" stroke-linejoin="round" clip-path="url(#${id}-c)"/></mask>${grad}</defs>
      <rect width="512" height="512" rx="116" class="logo-bg"${kind === "warp" ? ` style="fill:url(#${id}-g)"` : ""}/>
      <g fill="none" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"><path d="${m.under}" class="logo-warp" mask="url(#${id}-m)"/><path d="${m.over}" class="logo-weft"/></g></svg>`;
  }

  // --- Workspace data: inbox, calendar, todos, notes, people ---------------------------------

  const IDS = {
    jonas: ["@jbrandt:uni.example", "@jonas.brandt:example.org"],
    lukas: ["@lukas:uni.example"],
    sofia: ["@sofia:uni.example"],
    daniel: ["@daniel.okafor:uni.example"],
    lea: ["@lea:uni.example"],
    mira: ["@mira:example.org"],
    tom: ["@tom:example.org"],
    priya: ["@priya:research.example"],
    hannah: ["@hannah:uni.example"],
    jana: ["@jana:uni.example"],
    max: ["@max:uni.example"],
    felix: ["@felix:uni.example"],
    emre: ["@emre:uni.example"],
  };

  // Plugin items, on the board as linked todos (ADR 0051).
  const LINK_MR = {
    plugin: "gitlab",
    project: "Study dashboard",
    hue: "red",
    ref: "!42",
    icon: "eye",
    why: "Review requested, by Sofia Romano",
  };
  const LINK_SHEET = {
    plugin: "moodle",
    project: "Human-AI Interaction",
    hue: "purple",
    ref: "Assignment",
    icon: "cal",
    why: "Assignment due Mon 26 Oct",
  };

  const INBOX = [
    {
      id: "m1",
      from: "Daniel Okafor",
      c: 5,
      addr: "daniel.okafor@uni.example",
      subject: "Thesis chapter 2, draft attached",
      time: "12:41",
      unread: true,
      reply: true,
      label: ["Thesis supervision", "purple"],
      kind: "Person",
      file: ["thesis_chapter2_draft.pdf", "1.8 MB"],
      body: [
        "Hi Anna,",
        "attached is the draft of chapter 2. The evaluation design is still rough, so feedback on the research questions would help most.",
        "Would Tuesday afternoon work to talk it through?",
        "Best,\nDaniel",
      ],
      event: {
        mon: "Oct",
        day: "27",
        title: "Thesis meeting with Daniel",
        when: "Tuesday, 14:00-15:00",
        where: "Office 3.12",
      },
    },
    {
      id: "m2",
      from: "Prof. Jonas Brandt",
      c: 2,
      addr: "jonas.brandt@uni.example",
      subject: "UIST travel budget",
      time: "10:26",
      label: ["Conference", "pink"],
      // InboxPage.svelte: a conversation row stands for the whole thread and unfolds into its mails.
      thread: [
        ["anna", "Mon", "Hi Jonas, can the group cover UIST this year? Registration closes on Friday."],
        ["jonas", "10:26", "The group can cover UIST registration, travel and up to three hotel nights."],
        ["anna", "10:41", "Thanks, Jonas. I will book the hotel and send the receipts after the trip."],
      ],
      kind: "Person",
      body: [
        "Hi Anna,",
        "the group can cover UIST registration, travel and up to three hotel nights within the department limit. The conference dinner is on the department this year.",
        "Please send the receipts to the office after the trip.",
        "Jonas",
      ],
    },
    {
      id: "m3",
      from: "CHI 2027 Program Committee",
      c: 1,
      addr: "chairs@chi.example",
      subject: "Abstract submission closes Friday 23:59",
      flagged: true,
      time: "08:36",
      unread: true,
      label: ["Research", "blue"],
      kind: "Notification",
      body: [
        "Dear author,",
        "this is a reminder that abstract submission for CHI 2027 closes on Friday at 23:59 AoE. Full papers are due one week later.",
        "The CHI 2027 Program Committee",
      ],
      event: {
        mon: "Oct",
        day: "30",
        title: "CHI abstract deadline",
        when: "Friday, 23:59",
        where: "Submission system",
      },
    },
    {
      id: "m4",
      from: "arXiv cs.HC",
      c: 7,
      addr: "no-reply@arxiv.example",
      subject: "cs.HC daily: 42 new submissions",
      time: "06:36",
      unread: true,
      label: ["Research", "blue"],
      kind: "Newsletter",
      body: [
        "New submissions in Human-Computer Interaction (cs.HC), 42 entries.",
        "Includes: grounded explanations for conversational agents; trust calibration in AI-assisted writing; a field study of chat archives in research groups.",
      ],
    },
    {
      id: "m5",
      from: "Hannah Vogel",
      c: 1,
      addr: "hannah.vogel@uni.example",
      subject: "Question about the seminar topic assignment",
      time: "Yesterday",
      unread: true,
      reply: true,
      label: ["Teaching", "green"],
      kind: "Person",
      body: [
        "Dear Ms Weber,",
        "our group would like to present on over-reliance in week 7 instead of week 8, since two of us have an exam that morning. Would that be possible?",
        "Kind regards,\nHannah Vogel",
      ],
    },
    {
      id: "m6",
      from: "Priya Nair",
      c: 6,
      addr: "priya.nair@research.example",
      subject: "Joint workshop proposal: one-pager and call",
      time: "Yesterday",
      reply: true,
      label: ["Research", "blue"],
      kind: "Person",
      file: ["workshop_onepager_v1.pdf", "402.3 KB"],
      body: [
        "Hi Anna,",
        "attached is a first one-pager for our CHI workshop on grounded assistants. I kept the call for papers short; the organiser list still needs your bio.",
        "Would Tuesday at 15:00 work for a 45-minute call to go through it? I'll send a video link.",
        "Cheers,\nPriya",
      ],
      event: {
        mon: "Oct",
        day: "27",
        title: "Call with Priya Nair: CHI workshop proposal",
        when: "Tuesday, 15:00-15:45",
        where: "Video call",
      },
    },
    {
      id: "m7",
      from: "Examination Office",
      c: 3,
      addr: "exams@uni.example",
      subject: "Oral exam schedule: please confirm your slots",
      time: "Yesterday",
      reply: true,
      label: ["Teaching", "green"],
      kind: "Notification",
      body: [
        "Dear Ms Weber,",
        "please confirm the proposed oral exam slots for the winter term by Wednesday. Slots that are not confirmed will be reassigned.",
        "Examination Office",
      ],
    },
    {
      id: "m8",
      from: "IT Services",
      c: 0,
      addr: "it@uni.example",
      subject: "Scheduled maintenance: GPU cluster",
      time: "Yesterday",
      label: ["Admin", "orange"],
      kind: "Notification",
      body: [
        "The GPU cluster will be unavailable on Saturday from 08:00 to 14:00 for scheduled maintenance. Running jobs will be stopped at 07:45.",
      ],
    },
  ];

  // The week of 19-25 October 2026; today is Saturday the 24th. day: 0 = Monday, times in hours.
  const WEEK = [19, 20, 21, 22, 23, 24, 25];
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const TODAY = 5;
  const CAL = [
    {
      day: 0,
      from: 10.25,
      to: 11.75,
      title: "Seminar: Human-AI Interaction",
      where: "OH14 E04",
      cal: "blue",
      repeat: true,
    },
    {
      day: 0,
      from: 12.5,
      to: 13.5,
      title: "Lunch with Sofia",
      where: "Mensa",
      cal: "blue",
    },
    {
      day: 1,
      from: 10,
      to: 11,
      title: "ML Lab meeting",
      where: "E23",
      cal: "blue",
      repeat: true,
    },
    {
      day: 1,
      from: 14,
      to: 15,
      title: "Thesis meeting: Daniel",
      where: "Office 3.12",
      cal: "blue",
    },
    {
      day: 2,
      from: 11,
      to: 12,
      title: "Office hours",
      where: "Office 3.12",
      cal: "blue",
      repeat: true,
    },
    {
      day: 2,
      from: 13,
      to: 14,
      title: "Reading group",
      where: "Library 2.01",
      cal: "purple",
      chat: true,
    },
    {
      day: 2,
      from: 16.25,
      to: 17.75,
      title: "Colloquium: Trust in AI tools",
      where: "HS 1",
      cal: "teal",
    },
    {
      day: 4,
      from: 10,
      to: 11.5,
      title: "Examination board",
      where: "Senate room",
      cal: "blue",
    },
    {
      day: 4,
      from: 14,
      to: 14.75,
      title: "Tutor sync: sheet 5",
      where: "Video call",
      cal: "blue",
    },
    {
      day: 4,
      from: 15,
      to: 16.5,
      title: "PhD defence: Katrin Lehmann",
      where: "HS 2",
      cal: "teal",
    },
    {
      day: 5,
      from: 11,
      to: 11.75,
      title: "Call with Mira",
      where: "Video call",
      cal: "purple",
      chat: true,
    },
    {
      day: 5,
      from: 16.5,
      to: 18,
      title: "Writing block: CHI abstract",
      where: "",
      cal: "blue",
    },
    {
      day: 0,
      from: 15,
      to: 16.5,
      title: "HCI lecture",
      where: "H1",
      cal: "orange",
    },
    {
      day: 3,
      from: 12,
      to: 12,
      title: "Sheet 5 due",
      where: "",
      cal: "orange",
    },
  ];
  const ALLDAY = [
    { day: 3, title: "Faculty retreat", cal: "purple" },
    { day: 4, title: "CHI abstract deadline", cal: "blue" },
  ];
  const TODOS = {
    today: [
      {
        id: "t1",
        title: "Revise the workshop paper",
        note: "Three reviews, two minor revisions.",
        due: "Fri 23 Oct",
        overdue: true,
        label: ["Research", "blue"],
      },
      {
        id: "t2",
        title: "Finish CHI abstract",
        note: "Robustness result (5 seeds)",
        due: "17:00",
        label: ["Research", "blue"],
        from: "Machine Learning Lab",
      },
      {
        id: "t3",
        title: "Review Sofia's related-work section",
        label: ["Research", "blue"],
        from: "Machine Learning Lab",
      },
      {
        id: "t4",
        title: "Improve keyboard navigation in the study dashboard",
        note: "Check the focus order and arrow-key navigation in the session list.",
        labels: [["Research", "blue"], ["Design", "teal"]],
        link: LINK_MR,
      },
    ],
    upcoming: [
      {
        id: "u1",
        title: "Grade seminar presentations (groups 3-5)",
        due: "Tomorrow",
        label: ["Teaching", "green"],
      },
      {
        id: "u2",
        title: "Grade exercise sheet 5",
        due: "Mon 26 Oct",
        label: ["Teaching", "green"],
        link: LINK_SHEET,
      },
      {
        id: "u3",
        title: "Book train to Vienna",
        due: "Tue 27 Oct",
        label: ["Conference", "pink"],
        from: "Mira Schulz",
      },
      {
        id: "u4",
        title: "Prepare slides for the lab meeting",
        due: "Thu 29 Oct",
        label: ["Research", "blue"],
      },
    ],
  };

  const NOTES = [
    {
      id: "n1",
      title: "Lab meeting agenda",
      time: "13:02",
      chat: "Machine Learning Lab",
      body: `## Thursday 14:00, E23

1. Figures for the CHI paper (Fig. 2 and 3, lab palette)
2. Ablation results: **5 seeds**, std dev 0.4
3. Internal review: pick a slot from the poll
4. Daniel: appendix placement, GPU access

[Prof. Jonas Brandt: Reminder: the CHI abstract deadline is Friday, the full paper follows a week later.](https://matrix.to/#/!lab:uni.example/$lab01)

### Action items
- [ ] Lukas: final Figure 3 in the lab palette
- [ ] Sofia: related work in one page
- [x] Lea: room booking (E23)`,
    },
    {
      id: "n2",
      title: "CHI '27 paper outline",
      time: "11:20",
      chat: "CHI '27 Paper - Writing",
      body: `# Grounded assistants for personal archives

**Claim:** citing retrieved messages helps people *calibrate* their trust.

| Section | Owner | Status |
|---|---|---|
| Introduction | Anna | Draft |
| Related work | Sofia | In review |
| System | Lukas | Draft |
| Study | Daniel, Anna | Writing |
| Discussion | Priya | Draft |

> Abstract: 248 of 250 words. Add one sentence on robustness.`,
    },
    {
      id: "n3",
      title: "Seminar: session plan",
      time: "Yesterday",
      chat: "Seminar: Human-AI Interaction",
      body: `## Human-AI Interaction, winter term

| Week | Topic | Group |
|---|---|---|
| 5 | Mental models of AI | 1 |
| 6 | Explanations and trust | 2 |
| 7 | Over-reliance | 4 (swapped with 3) |
| 8 | Evaluation methods | 5 |

**Grading:** content 40 %, structure 20 %, slides 20 %, discussion 20 %`,
    },
    {
      id: "n4",
      title: "Thesis meeting notes: Daniel",
      time: "Mon",
      chat: "Daniel Okafor",
      body: `### Last meeting
- Research questions are clear, RQ2 needs a *measurable* outcome
- Pilot study with 6 participants went well
- [x] Chapter 2 draft received

### Open
- [ ] GPU access for the final experiments: ask Jonas
- [ ] Appendix: supplementary material or main paper?

[Daniel Okafor: One more question: is it okay if I use the lab's GPU cluster for the final experiments, or do I need to request access?](https://matrix.to/#/!dm-daniel:uni.example/$dan03)`,
    },
    {
      id: "n5",
      title: "Grounded assistants",
      time: "Yesterday",
      chat: "",
      body: `---
status: reading
---
## Grounded assistants

Citations help people *calibrate* trust, see [[Trust in AI tools]] and [[CHI '27 paper outline]].

- [x] Read the survey #reading
- [ ] Summarise for the seminar #teaching`,
    },
  ];

  // NotesPage.svelte: the tree, its folders and a connected Obsidian vault.
  const NOTE_TREE = [
    { id: "f1", name: "Research", notes: ["n1", "n2"] },
    { id: "f2", name: "Teaching", notes: ["n3"] },
    { id: "v1", name: "Reading vault", vault: true, notes: ["n5"] },
  ];

  // Profiles: what the person page shows beyond their messages.
  const PROFILE = {
    daniel: {
      status: "Writing chapter 3",
      messages: 148,
      events: [
        ["Tue 27 Oct", "14:00", "Thesis meeting with Daniel", "Office 3.12"],
      ],
      files: [
        ["thesis_chapter2_draft.pdf", "1.8 MB", "Mon"],
        ["pilot_study_results.xlsx", "64 KB", "12 Oct"],
        ["rq_overview.png", "212 KB", "5 Oct"],
      ],
    },
  };

  // Messages that notes link to, by event id: what MessageCard shows for them.
  const LINKED = {
    $lab01: {
      who: "jonas",
      room: "lab",
      time: "Thursday, 09:12",
      text: "Reminder: the CHI abstract deadline is Friday, the full paper follows a week later. Let's use the lab meeting to go through all figures.",
    },
    $dan03: {
      who: "daniel",
      room: "daniel",
      time: "Today, 12:46",
      text: "One more question: is it okay if I use the lab's GPU cluster for the final experiments, or do I need to request access?",
    },
  };

  /** A message link on a line of its own, previewed like a URL (MessageCard.svelte). */
  function messageCard(label, eventId) {
    const m = LINKED[eventId];
    const r = m && roomById(m.room);
    if (!m)
      return `<div class="mcard missing">${icon("link", "ic ic-s")}<span>${esc(label)}</span><small>Not in the archive</small></div>`;
    const p = person(m.who);
    return `<div class="mcard" role="link" tabindex="0" data-room="${r.id}" title="Open in ${esc(r.name)}">
      <span class="mc-head">${avatar(initials(p.name), p.c, "av av-xs")}<b>${esc(p.name)}</b><span class="mc-where">in ${esc(r.name)}</span>${acctTag(r.acct[0])}<span class="comp-fill"></span><span class="time">${m.time}</span>${icon("arrow", "ic ic-s mc-go")}</span>
      <span class="mc-msg">${esc(m.text)}</span>
    </div>`;
  }

  /** A small Markdown renderer for the notes: headings, lists, task lists, tables, quotes, emphasis,
   *  and message links on their own line (notes.ts). */
  function md(src) {
    const inline = (s) =>
      esc(s)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, "<code>$1</code>")
        .replace(/\[\[(.+?)\]\]/g, '<span class="wiki">$1</span>')
        .replace(/(^|\s)#([a-z][\w-]*)/gi, '$1<span class="wiki">#$2</span>');
    const lines = src.split("\n");
    let html = "",
      i = 0,
      task = 0;
    // Front matter shows as properties.
    if (lines[0] === "---") {
      const end = lines.indexOf("---", 1);
      html += `<dl class="props">${lines
        .slice(1, end)
        .map((l) => {
          const [k, ...v] = l.split(":");
          return `<dt>${esc(k)}</dt><dd>${esc(v.join(":").trim())}</dd>`;
        })
        .join("")}</dl>`;
      i = end + 1;
    }
    while (i < lines.length) {
      const l = lines[i];
      if (/^#{1,3} /.test(l)) {
        const n = l.match(/^#+/)[0].length;
        html += `<h${n + 1} class="md-h${n}">${inline(l.slice(n + 1))}</h${n + 1}>`;
        i++;
        continue;
      }
      const link = l.match(
        /^\[(.+)\]\(https:\/\/matrix\.to\/#\/![^/]+\/(\$[^)]+)\)$/,
      );
      if (link) {
        html += messageCard(link[1], link[2]);
        i++;
        continue;
      }
      if (/^> /.test(l)) {
        html += `<blockquote>${inline(l.slice(2))}</blockquote>`;
        i++;
        continue;
      }
      if (/^\|/.test(l)) {
        const rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) {
          if (!/^\|[-| ]+\|$/.test(lines[i]))
            rows.push(
              lines[i]
                .slice(1, -1)
                .split("|")
                .map((c) => c.trim()),
            );
          i++;
        }
        html += `<div class="md-table"><table><thead><tr>${rows[0].map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows
          .slice(1)
          .map(
            (r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`,
          )
          .join("")}</tbody></table></div>`;
        continue;
      }
      if (/^(- |\d+\. )/.test(l)) {
        const ordered = /^\d/.test(l);
        let items = "";
        while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) {
          const t = lines[i].replace(/^(- |\d+\. )/, "");
          const m = t.match(/^\[( |x)\] (.*)$/);
          items += m
            ? `<li class="md-task"><button type="button" class="md-box${m[1] === "x" ? " on" : ""}" data-task="${task++}" aria-pressed="${m[1] === "x"}">${m[1] === "x" ? icon("check", "ic ic-12") : ""}</button><span>${inline(m[2])}</span></li>`
            : `<li>${inline(t)}</li>`;
          i++;
        }
        html += ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
        continue;
      }
      if (l.trim()) html += `<p>${inline(l)}</p>`;
      i++;
    }
    return html;
  }

  /** Colours for the note source (noteHighlight.ts): Markdown marks, headings, emphasis, code,
   *  links and quotes. Spans only, so every character stays where the textarea draws it. */
  function highlightNote(src) {
    const span = (c, h) => `<span class="nh-${c}">${h}</span>`;
    const mark = (t) => (t ? span("m", esc(t)) : "");
    const INLINE =
      /(`[^`\n]+`)|(\*\*(?=\S)[^\n]*?\S\*\*)|(\[[^\]\n]+\]\([^)\s]+\))|((?<![*\w])\*(?=\S)[^*\n]*?\S\*(?!\*))/g;
    const inline = (t) => {
      let out = "",
        at = 0;
      for (const m of t.matchAll(INLINE)) {
        out += esc(t.slice(at, m.index));
        const x = m[0];
        if (m[1]) out += span("c", esc(x));
        else if (m[2])
          out += span("b", mark("**") + inline(x.slice(2, -2)) + mark("**"));
        else if (m[3]) {
          const close = x.indexOf("](");
          out +=
            span("l", mark("[") + inline(x.slice(1, close)) + mark("]")) +
            mark("(") +
            span("u", esc(x.slice(close + 2, -1))) +
            mark(")");
        } else out += span("i", mark("*") + inline(x.slice(1, -1)) + mark("*"));
        at = m.index + x.length;
      }
      return out + esc(t.slice(at));
    };
    const line = (l) => {
      let m;
      if ((m = /^(#{1,6})(\s+)(.*)$/.exec(l)))
        return mark(m[1]) + m[2] + span("h", inline(m[3]));
      if ((m = /^(>\s?)(.*)$/.exec(l)))
        return mark(m[1]) + span("q", inline(m[2]));
      if ((m = /^(\s*)([-*+]|\d+\.)(\s+)(\[[ x]\](?=\s))?(.*)$/.exec(l)))
        return m[1] + mark(m[2]) + m[3] + mark(m[4] ?? "") + inline(m[5]);
      if (/^\s*\|/.test(l))
        return l
          .split("|")
          .map((c) => (/^\s*:?-+:?\s*$/.test(c) ? mark(c) : inline(c)))
          .join(mark("|"));
      return inline(l);
    };
    return (
      src.split("\n").map(line).join("\n") + (src.endsWith("\n") ? " " : "")
    );
  }

  // --- App windows -----------------------------------------------------------------------------

  const hhmm = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  const fmtH = (h) =>
    `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
  // What the assistant picked up from the chats, each from one message. The same list feeds the
  // chat's tray, the timeline, the calendar's "Found in chats", the todo board and the profile.
  const SUGG = [
    {
      id: "gpu",
      kind: "event",
      room: "lab",
      who: "lukas",
      title: "GPU cluster maintenance",
      mon: "Oct",
      day: 31,
      date: "Sat 31 Oct",
      when: "Saturday, 08:00-14:00",
      at: "08:00",
      where: "GPU cluster",
      quote: "the GPU cluster is down for maintenance on Saturday 08:00-14:00",
    },
    {
      id: "fig3",
      kind: "todo",
      room: "lab",
      who: "lukas",
      title: "Check the colours of Figure 3",
      due: "Wed 28 Oct",
      label: ["Research", "blue"],
      quote: "could you check the colours of Figure 3 before Wednesday?",
    },
    {
      id: "coffee",
      kind: "event",
      room: "mira",
      who: "mira",
      title: "Coffee with Mira",
      mon: "Oct",
      day: 25,
      date: "Sun 25 Oct",
      when: "Sunday, 10:00-11:00",
      at: "10:00",
      where: "Café Rathaus",
      quote: "Coffee on Sunday at 10 at Café Rathaus before you leave?",
      add: {
        day: 6,
        from: 10,
        to: 11,
        title: "Coffee with Mira",
        where: "Café Rathaus",
        cal: "purple",
        chat: true,
      },
    },
    {
      id: "ch2",
      kind: "todo",
      room: "daniel",
      who: "anna",
      title: "Feedback on Daniel's thesis chapter 2",
      due: "Mon 26 Oct",
      label: ["Thesis supervision", "purple"],
      quote: "Great, I'll give you feedback early next week.",
    },
  ];
  const suggById = (id) => SUGG.find((x) => x.id === id);
  // ChatList.svelte: a question waiting for you outranks a mention, a mention a plain count.
  const roomBadge = (r) =>
    r.msgs.some((m) => m[3]?.chip === "needs reply")
      ? "reply"
      : r.msgs.some((m) => m[3]?.mention)
        ? "at"
        : "count";
  // Catch-up summaries: [headline, sentence, room, times of the messages each point cites].
  const AWAY = [
    [
      "Jonas is waiting on you.",
      "He asked about the reviewer responses from the workshop paper, and Lukas wants the colours of Figure 3 checked before Wednesday.",
      "lab",
      ["13:09", "13:15"],
    ],
    [
      "Lab meeting moved.",
      "It is now on Thursday 14:00 in E23 because of the faculty retreat.",
      "lab",
      ["12:43"],
    ],
    [
      "Daniel needs GPU access.",
      "He asks whether he can use the lab's GPU cluster for his final experiments and wants to move your meeting to Tuesday afternoon.",
      "daniel",
      ["12:46", "12:48"],
    ],
    [
      "Seminar slides uploaded.",
      "Hannah's group asks you to check that their embedded video plays; Max is looking for the summary template.",
      "sem",
      ["09:49", "09:04"],
    ],
    [
      "Abstract is almost full.",
      "248 of 250 words; Priya suggests adding one sentence on robustness from the 5-seed results.",
      "chi",
      ["11:14", "12:55"],
    ],
    [
      "Dinner in Vienna?",
      "Mira suggests dinner with Tom near the Naschmarkt on the first evening; the department covers the conference dinner.",
      "mira",
      ["13:11", "10:31"],
    ],
  ];
  const CATCHUP = {
    lab: [
      [
        "Lab meeting moved.",
        "The lab meeting moves to Thursday 14:00 in E23, because half of the group is at the faculty retreat on the usual day.",
        ["12:43"],
      ],
      [
        "Two things for you.",
        "Jonas asks whether you have read the reviewer responses from the workshop paper, and Lukas asks you to check the colours of Figure 3 before Wednesday.",
        ["13:09", "13:15"],
      ],
      [
        "Ablation results are in.",
        "Lukas's overnight runs finished for all 5 seeds; after the seed fix the standard deviation is down to 0.4.",
        ["12:31", "12:32"],
      ],
      [
        "GPU cluster maintenance.",
        "The cluster is down on Saturday 08:00-14:00, so plan long runs around it.",
        ["13:13"],
      ],
    ],
    sem: [
      [
        "Slides to check.",
        "Hannah's group uploaded their slides and asks whether the embedded video plays; Jana's group has the same question about a GIF.",
        ["09:49", "09:55"],
      ],
      [
        "Topic question.",
        "Jana's group picked the paper on explanation styles for AI decisions and asks whether it is still free.",
        ["08:44"],
      ],
      [
        "Template found.",
        "Max asked for the summary template; Felix pointed him to the Materials folder.",
        ["09:04", "09:44"],
      ],
    ],
    daniel: [
      [
        "GPU access and a new time.",
        "Daniel asks whether he may use the lab's GPU cluster for his final experiments, and whether your meeting can move to Tuesday afternoon.",
        ["12:46", "12:48"],
      ],
    ],
    chi: [
      [
        "Abstract is almost full.",
        "It is at 248 of 250 words. Sofia asks whether to mention the 5-seed results; Priya would add one sentence on robustness.",
        ["11:14", "12:14", "12:55"],
      ],
    ],
    mira: [
      [
        "Dinner in Vienna?",
        "Mira booked the hotel, suggests coffee on Sunday at 10 and dinner with Tom near the Naschmarkt on the first evening.",
        ["08:30", "13:05", "13:11"],
      ],
    ],
  };
  // SourceMessages.svelte: the messages a point rests on as a count pill, and their time span
  // as quiet text ("12:21 - 13:09"), at the right edge of the row with `end`.
  const sources = (times, end = false) => {
    const t = [...times].sort();
    const range = t[0] === t.at(-1) ? t[0] : `${t[0]} - ${t.at(-1)}`;
    return `<span class="src-n">${t.length} ${t.length === 1 ? "message" : "messages"}</span><span class="src-range${end ? " end" : ""}">${range}</span>`;
  };

  const COVERS = {
    timeline: "Show timeline",
    inbox: "Show mail",
    chats: "Show messages",
    calendar: "Show calendar",
    todos: "Show todos",
    notes: "Show notes",
    profile: "Show profile",
  };

  /** One Weft window with its own state. With `privacy: true` its eye button turns privacy mode on and off. */
  function mountWindow(
    el,
    { view = "chats", room = "lab", privacy = false, catchup = null } = {},
  ) {
    const s = {
      view,
      room,
      person: "daniel",
      ptab: "messages",
      mail: "m6",
      mailFilter: "all",
      mailLabel: null,
      flags: new Set(INBOX.filter((x) => x.flagged).map((x) => x.id)),
      threadOpen: true,
      note: "n1",
      noteMode: "split",
      folders: new Set(["f1", "v1"]),
      sent: {},
      read: new Set([room]),
      readMail: new Set(["m6"]),
      last: {},
      notes: Object.fromEntries(NOTES.map((n) => [n.id, n.body])),
      catchup,
      awayDismissed: false,
      trayOpen: true,
      // Suggestions dealt with (added or dismissed), and the added ones.
      handled: new Set(),
      accepted: new Set(),
      added: new Set(),
      cal: [...CAL],
      done: new Set(),
      taken: new Set(),
      privacy: false,
      shown: null,
      toast: "",
    };
    const uid = Math.random().toString(36).slice(2, 7);
    const place = () =>
      s.view === "chats"
        ? `chat:${s.room}`
        : s.view === "profile"
          ? `profile:${s.person}`
          : s.view === "inbox"
            ? `mail:${s.mail}`
            : s.view;
    const covered = () => s.privacy && COVERS[s.view] && s.shown !== place();
    const gate = (inner) => {
      const cov = covered();
      return `<div class="gate"><div class="gate-content${cov ? " covered" : ""}"${cov ? " inert" : ""}>${inner}</div>${cov ? `<div class="veil"><button type="button" class="veil-pill" data-show>${icon("eye")}${COVERS[s.view]}</button></div>` : ""}</div>`;
    };

    function rail() {
      const unreadMail = INBOX.filter(
        (m) => m.unread && !s.readMail.has(m.id),
      ).length;
      const openTodos = TODOS.today.filter((t) => !s.done.has(t.id)).length;
      const item = (v, ic, name, n) =>
        `<button type="button" class="rail-item${s.view === v ? " on" : ""}" data-view="${v}" aria-pressed="${s.view === v}">${icon(ic, "ic ic-20")}<span>${name}</span>${n ? `<em>${n}</em>` : ""}</button>`;
      const eye = privacy
        ? `<button type="button" class="rail-eye${s.privacy ? " on" : ""}" data-eye aria-pressed="${s.privacy}" title="Privacy mode ${s.privacy ? "on" : "off"} (Ctrl Shift H)">${icon(s.privacy ? "eye-off" : "eye")}</button>`
        : `<span class="rail-eye">${icon("eye")}</span>`;
      const folder = (ic, color, name, n) =>
        `<span class="rail-item"><span class="folder-glyph" style="--c:var(--folder-${color})">${icon(ic, "ic ic-20")}</span><span>${name}</span>${n ? `<em>${n}</em>` : ""}</span>`;
      return `<aside class="rail">
        <div class="rail-top">${logo("weft", 30)}<span class="wordmark">Weft</span>${eye}<button type="button" class="rail-eye${s.view === "timeline" ? " is-on" : ""}" data-view="timeline" aria-pressed="${s.view === "timeline"}" title="Timeline">${icon("feed")}</button></div>
        <span class="rail-search">${icon("search")}<span>Search</span><kbd>Ctrl K</kbd></span>
        <p class="rail-h">Workspace</p>
        <div class="rail-items">${item("chats", "chat", "Chats", 19)}${item("inbox", "mail", "Inbox", unreadMail)}${item("calendar", "cal", "Calendar")}${item("todos", "todo", "Todos", openTodos)}${item("notes", "note", "Notes")}</div>
        <p class="rail-h folders"><span class="grow">Folders</span>${icon("plus", "ic ic-16")}</p>
        <div class="rail-items rail-folders">${folder("school", "teal", "Teaching", 6)}${folder("box", "amber", "Admin")}</div>
        <span class="rail-warp"><span class="aurora"></span>${logo("warp", 22)}<span class="wordmark">Warp</span></span>
        <span class="rail-item">${icon("archive", "ic ic-20")}<span>Archived</span></span>
        <span class="rail-item">${icon("gear", "ic ic-20")}<span>Settings</span></span>
        <span class="rail-me"><span class="av-wrap">${avatar("AW", 0, "av av-32")}<i class="online"></i></span><span class="me-text"><b>Anna Weber</b><small>Online</small></span><span class="rail-eye">${icon("panel")}</span></span>
      </aside>`;
    }

    // Chats
    function chatsView() {
      const row = (r) => {
        const unread = !s.read.has(r.id) && r.unread;
        const kind = roomBadge(r);
        const badge = !unread
          ? ""
          : kind === "reply"
            ? `<em class="badge" title="Waiting for your reply">${icon("reply", "ic ic-16")}${r.unread}</em>`
            : kind === "at"
              ? `<em class="badge badge-at" title="You were mentioned">@ ${r.msgs.filter((m) => m[3]?.mention).length}</em>`
              : `<em class="badge badge-q">${r.unread}</em>`;
        const tags =
          r.acct.map(acctTag).join("") +
          (r.plugin ? `<span class="tag-logo" title="${r.plugin === "moodle" ? "Moodle" : "GitLab"}">${serviceLogo(r.plugin)}</span>` : "");
        const last = s.last[r.id];
        const av = avatar(r.av, r.c, roomAv(r, "av av-38"));
        // Privacy mode: no message preview; the tags take its line, the counts stay on the right.
        const body = s.privacy
          ? `<span class="cr-mid"><span class="cr-tags inline">${tags}</span>${badge}</span>`
          : `<span class="cr-mid"><span class="cr-prev">${esc(last ? last.preview : r.preview)}</span>${badge}</span><span class="cr-tags">${tags}</span>`;
        return `<button type="button" class="chat-row${r.id === s.room ? " on" : ""}${unread ? " unread" : ""}" data-room="${r.id}" aria-pressed="${r.id === s.room}">
          ${r.online ? `<span class="av-wrap">${av}<i class="online"></i></span>` : av}
          <span class="cr-main">
            <span class="cr-top"><span class="cr-name">${r.linked ? icon("link", "ic ic-16") : ""}<span>${esc(r.name)}</span></span><span class="time">${last ? last.time : r.time}</span></span>
            ${body}
          </span>
        </button>`;
      };
      const r = roomById(s.room);
      const msgs = [...r.msgs, ...(s.sent[r.id] ?? [])];
      const sub = r.mail
        ? esc(r.addr)
        : r.dm
          ? r.online
            ? `<span class="tl-online">Online</span>`
            : "Offline"
          : `${r.members} members`;
      // SuggestionTray.svelte: what the assistant picked up, above the composer. Dashed cards in
      // the AI colour, a date leaf for an event and a todo glyph for a todo, Add and dismiss.
      const tray = r.mail ? [] : open(r.id);
      const chipIc = (ic, text) =>
        `<span class="pk-chip">${icon(ic, "ic ic-12")}${esc(text)}</span>`;
      const pickCard = (p) => {
        const leaf = p.day
          ? `<span class="pk-leaf"><span class="pk-mon">${p.mon}</span><span class="pk-day">${p.day}</span></span>`
          : "";
        const who = person(p.who);
        const chips = [
          chipIc("clock", p.day ? p.when : p.due),
          p.day ? chipIc("mappin", p.where) : "",
          p.label ? label(...p.label).replace('class="lbl"', 'class="lbl lbl-sm"') : "",
          `<span class="pk-chip pk-person">${avatar(initials(who.name), who.c, "av av-14")}${esc(who.name)}</span>`,
        ].join("");
        return `<div class="pk-card">${leaf}<span class="pk-text"><span class="pk-t">${esc(p.title)}</span><span class="pk-quote">"${esc(p.quote)}"</span><span class="pk-chips">${chips}</span></span><span class="pk-acts"><button type="button" class="pk-add btn-ui" data-take="${p.id}">${icon("plus", "ic ic-14")}Add</button><button type="button" class="pk-x btn-ui" data-drop="${p.id}" title="Dismiss">${icon("close", "ic ic-16")}</button></span></div>`;
      };
      const picked = tray.length
        ? `<div class="picked-tray"><div class="picked"><span class="pk-spark">${icon("spark", "ic ic-14")}</span><b>Picked up from this chat<em>${tray.length}</em></b><span class="comp-fill"></span>${tray.length > 1 ? `<button type="button" class="picked-add btn-ui" data-take-all="${r.id}">Add all</button>` : ""}<button type="button" class="pk-fold btn-ui" data-pick-fold title="${s.trayOpen ? "Collapse" : "Expand"}">${icon(s.trayOpen ? "down" : "up", "ic ic-14")}</button></div>${s.trayOpen ? `<div class="pk-cards">${tray.map(pickCard).join("")}</div>` : ""}</div>`
        : "";
      const hb = (ic, label, n) =>
        `<span class="hb" title="${label}">${icon(ic, ic === "video" ? "ic ic-22" : "ic ic-20")}${n ? `<em>${n}</em>` : ""}</span>`;
      // Timeline.svelte: the "New since" divider where this visit's unread messages start, and
      // under it the first point of the summary (UnreadSummary.svelte), which opens the panel.
      const newAt = r.unread ? Math.max(1, r.msgs.length - r.unread) : -1;
      const points = CATCHUP[r.id];
      const newSince =
        newAt > 0
          ? `<div class="new-since">New since ${r.msgs[newAt - 1][1]}</div><button type="button" class="unread-sum" data-catchup="open" title="Open the summary">${icon("spark", "ic ic-14")}<span class="us-lead">${points ? esc(points[0][0]) : `Summarize ${r.unread} new ${r.unread === 1 ? "message" : "messages"}`}</span>${points && points.length > 1 ? `<span class="us-more">+${points.length - 1} more</span>` : ""}</button>`
          : "";
      const body = msgs
        .map(
          (m, i, l) =>
            (i === newAt ? newSince : "") +
            messageHtml(m, i, l, r.lock, i === newAt),
        )
        .join("");
      const sum = s.catchup === r.id;
      return `<div class="list-pane">
          <div class="lp-head"><b>Chats</b><span class="lp-sort">${icon("sort")}Recent</span><span class="lp-new">${icon("edit")}</span></div>
          <div class="seg-ui lp-tabs"><span class="on">All</span><span>Unread</span><span>People</span><span>Rooms</span><span>Linked</span></div>
          <div class="lp-accts">${["uni", "example"].map(acctTag).join("")}</div>
          <div class="lp-rows">
            <p class="lp-h">${icon("star", "ic ic-12")}Favourites</p>
            ${ROOMS.filter((x) => x.fav)
              .map(row)
              .join("")}
            <p class="lp-h">All chats</p>
            ${ROOMS.filter((x) => !x.fav)
              .map(row)
              .join("")}
          </div>
        </div>
        <div class="tl-pane">
          <div class="tl-head">${avatar(r.av, r.c, roomAv(r, "av av-36"))}
            <span class="tl-title"><b>${r.linked ? icon("link", "ic ic-16") : ""}<span>${esc(r.name)}</span>${r.acct.map(acctTag).join("")}</b><small>${r.lock ? icon("lock", "ic ic-12") : icon("globe", "ic ic-12")}${sub}</small></span>
            ${sum ? "" : `<button type="button" class="tl-btn catch btn-ui" data-catchup="open">Catch up</button>`}
            <span class="tl-tools">${hb("spark", "Picked up")}${hb("thread", "Threads", r.id === "lab" ? 1 : 0)}${hb("pin", "Pinned", r.id === "lab" ? 1 : 0)}${hb("info", "Details")}</span>
          </div>
          ${gate(`<div class="tl-body"><div class="tl-inner">${body}</div></div>
            ${
              r.mail
                ? `<div class="comp-state"><span>Mail is written in its own window, not here.</span><button type="button" class="send btn-ui">${icon("edit", "ic ic-14")}Write mail</button></div>`
                : `<form class="composer">
              ${picked}
              <label class="sr" for="compose-${uid}">Message ${esc(r.name)}</label>
              <input id="compose-${uid}" autocomplete="off" placeholder="${r.plugin ? "Answer through Moodle" : `Message ${esc(r.name)}`}" />
              <div class="comp-row">${r.plugin ? `<span class="comp-service">${icon("open", "ic ic-16")}Moodle</span>` : `<span class="tool">${icon("plus", "ic ic-20")}</span><span class="tool">${icon("clip")}</span><span class="tool">${icon("at")}</span><span class="tool">${icon("smile")}</span>`}<span class="comp-fill"></span>${r.plugin ? "" : `<span class="tool">${icon("mic")}</span>`}<button class="send" type="submit" disabled>${icon("send", "ic ic-16")}Send</button></div>
            </form>`
            }`)}
        </div>${sum ? summaryPanel(r) : ""}`;
    }

    // Inbox
    // The summary panel (AiSummary.svelte in DetailsPanel.svelte): "While you were away" beside
    // the conversation, each point with its lead, its text and the messages it rests on.
    function summaryPanel(r) {
      const points = CATCHUP[r.id];
      const since = r.unread ? `${r.unread} unread` : "Latest messages";
      const acts = `<div class="sum-acts">${open(r.id)
        .map(
          (g, i) =>
            `<button type="button" class="act${i ? "" : " primary"} btn-ui" data-take="${g.id}">${icon(g.kind === "event" ? "cal" : "todo", "ic ic-14")}${g.kind === "event" ? `Add ${esc(g.title)} to calendar` : `Todo: ${esc(g.title)}`}</button>`,
        )
        .join("")}${r.unread ? `<span class="act">${icon("down", "ic ic-14")}Jump to first unread</span>` : ""}</div>`;
      return `<aside class="sum-panel" aria-label="Summary">
        <div class="sum-head"><b>While you were away</b><button type="button" class="sum-x" data-catchup="close" title="Close">${icon("close", "ic ic-14")}</button></div>
        <div class="sum-body">
          <div class="sum-meta"><span>${since}</span>${icon("sync", "ic ic-14")}</div>
          ${
            points
              ? `<ol class="sum-points">${points.map(([h, t, times], i) => `<li><span class="cu-n">${String(i + 1).padStart(2, "0")}</span><div class="sum-pt"><b>${esc(h)}</b><p>${esc(t)}</p><div class="srcs">${sources(times, true)}</div></div></li>`).join("")}</ol>${acts}`
              : `<p class="empty">Nothing to catch up on.</p>`
          }
        </div>
      </aside>`;
    }

    // Timeline (the bell): what happened across every chat, with what is due and what is unread.
    function timelineView() {
      const due = TODOS.today;
      const unread = ROOMS.filter((r) => r.unread && !s.read.has(r.id));
      const lab = roomById("lab");
      const lmsgs = [
        ["sofia", "13:02", "I'll do it!"],
        [
          "jonas",
          "13:09",
          "@Anna Weber did you get a chance to look at the reviewer responses from the workshop paper?",
          { chip: "needs reply" },
        ],
        [
          "lukas",
          "13:13",
          "Heads-up: the GPU cluster is down for maintenance on Saturday 08:00-14:00, plan your runs accordingly.",
          { chip: "calendar" },
        ],
        [
          "lukas",
          "13:15",
          "@Anna Weber could you check the colours of Figure 3 before Wednesday? Then I regenerate all plots for the camera-ready.",
          { chip: "todo", mention: true },
        ],
      ];
      // TimelineItemActions.svelte: what the assistant found in a message, right under it.
      const pickLine = (g) =>
        s.accepted.has(g.id)
          ? `<p class="tg-done"><i>${icon("check", "ic ic-12")}</i>${esc(g.title)} is in your ${g.kind === "event" ? "calendar" : "todos"}</p>`
          : s.handled.has(g.id)
            ? ""
            : `<div class="tg-sugg">${icon(g.kind === "event" ? "cal" : "todo")}<span><b>${esc(g.title)}</b><small>${g.kind === "event" ? `${g.date}, ${g.at}, ${esc(g.where)}` : `Due ${g.due}`}</small></span><button type="button" class="sm btn-ui" data-drop="${g.id}">Dismiss</button><button type="button" class="sm primary btn-ui" data-take="${g.id}">${icon("plus", "ic ic-14")}${g.kind === "event" ? "Calendar" : "Todos"}</button></div>`;
      const pick = SUGG.filter((g) => g.room === "lab")
        .map(pickLine)
        .join("");
      return `<div class="tline">
        <div class="tline-bar"><span class="comp-fill"><b class="page-title">Timeline</b><small>Saturday 24 October</small></span>
          <div class="seg-ui seg-inline"><span class="on">All <em>16</em></span><span>Mentions <em>4</em></span><span>Needs reply <em>8</em></span><span>Picked up <em>8</em></span></div><span class="tl-refresh">${icon("sync", "ic ic-18")}</span></div>
        ${gate(`<div class="tline-body"><div class="tline-main">
          ${
            s.awayDismissed
              ? ""
              : `<div class="cu-card cu-wide">
            <div class="cu-head">${icon("spark", "ic ic-16 ic-ai")}<b>While you were away</b><small>Since yesterday, 13:40</small><span class="comp-fill"></span>${icon("sync", "ic ic-14 ic-mute")}<button type="button" class="cu-dismiss" data-away>Dismiss</button></div>
            <ol class="cu-points">${AWAY.map(([h, t, room, times], i) => {
              const c = roomById(room);
              return `<li><span class="cu-n">${String(i + 1).padStart(2, "0")}</span><div class="cu-pt"><p><b>${esc(h)}</b> <span>${esc(t)}</span></p><div class="srcs"><button type="button" class="src-chat" data-room="${room}" title="Open in ${esc(c.name)}">${avatar(c.av, c.c, roomAv(c, "av av-18"))}<span>${esc(c.name)}</span></button>${sources(times, true)}</div></div></li>`;
            }).join("")}</ol>
          </div>`
          }
          <div class="tl-day"><p class="side-h">Today</p>
          ${runCardHtml(lab, lmsgs, "13:15", pick ? `<div class="run-extra">${pick}</div>` : "")}</div>
        </div>
        <aside class="tline-aside">
          <p class="side-h">Due <em class="cnt">${due.filter((t) => !s.done.has(t.id)).length}</em><span class="comp-fill"></span><button type="button" class="side-go btn-ui" data-view="todos" title="Open todos">${icon("arrow", "ic ic-14")}</button></p>
          ${
            due
              .filter((t) => !s.done.has(t.id))
              .map(
                (t) =>
                  `<p class="due-row"><button type="button" class="check" data-done="${t.id}" aria-pressed="false" aria-label="Done">${icon("check", "ic ic-12")}</button><span>${esc(t.title)}</span>${t.overdue ? `<em class="overdue-txt">overdue</em>` : ""}</p>`,
              )
              .join("") || `<p class="empty">Nothing due.</p>`
          }
          <p class="side-h">Today<span class="comp-fill"></span><button type="button" class="side-go btn-ui" data-view="calendar" title="Open the calendar">${icon("arrow", "ic ic-14")}</button></p>
          <p class="today-row"><span class="row-time">11:00</span><span>Call with Mira</span></p>
          <p class="today-row"><span class="row-time">16:30</span><span>Writing block: CHI abstract</span></p>
          <p class="side-h">Unread</p>
          ${unread.map((r) => `<button type="button" class="unread-row" data-room="${r.id}">${avatar(r.av, r.c, roomAv(r, "av av-xs"))}<span>${esc(r.name)}</span>${roomBadge(r) === "count" ? "" : `<em class="at">${icon(roomBadge(r) === "reply" ? "reply" : "at", "ic ic-12")}</em>`}<em>${r.unread}</em></button>`).join("") || `<p class="empty">All caught up.</p>`}
        </aside></div>`)}
      </div>`;
    }

    function inboxView() {
      const shown = INBOX.filter(
        (m) =>
          (s.mailFilter === "all" ||
            (s.mailFilter === "answer"
              ? m.reply
              : s.mailFilter === "flagged"
                ? flagged(m)
                : m.kind === "Person")) &&
          (!s.mailLabel || m.label?.[0] === s.mailLabel),
      );
      // LabelFilter.svelte: the labels the mail is sorted into, one at a time.
      const mailLabels = [
        ...new Map(
          INBOX.filter((x) => x.label).map((x) => [x.label[0], x.label]),
        ).values(),
      ];
      const labelRow = `<div class="mail-labels">${mailLabels
        .map(
          ([n, c]) =>
            `<button type="button" class="lbl lbl-btn${s.mailLabel === n ? " on" : ""}" style="--l:var(--label-${c})" data-mail-label="${esc(n)}" aria-pressed="${s.mailLabel === n}">${esc(n)}</button>`,
        )
        .join(
          "",
        )}${s.mailLabel ? `<button type="button" class="lbl-tiny btn-ui" data-mail-label="" title="Show all labels">${icon("close", "ic ic-12")}</button>` : ""}</div>`;
      const m = INBOX.find((x) => x.id === s.mail);
      // A conversation: everyone in it, its newest mail (your own too), the mail count; open, it
      // sits on --sunk and lists every mail under the row's text column.
      const conv = (x) => {
        const open = s.threadOpen;
        const last = x.thread.at(-1);
        const mine = last[0] === "anna";
        const p = person("jonas");
        const tags = `${x.label ? label(...x.label).replace('class="lbl"', 'class="lbl lbl-sm"') : ""}<span class="count-tag" title="${x.thread.length} mails in this conversation">${x.thread.length}${icon(open ? "up" : "down", "ic ic-12")}</span>`;
        const sub = ([who, time, text]) =>
          `<${who === "anna" ? "span" : `button type="button" data-mail="${x.id}"`} class="mail-sub${who === "anna" ? " mine" : ""}${who !== "anna" && x.id === s.mail ? " on" : ""}">${avatar(who === "anna" ? "AW" : initials(p.name), who === "anna" ? 0 : x.c, "av av-22 av-mail")}<span class="mi-main"><span class="mi-top"><b>${who === "anna" ? "You" : esc(p.name)}</b><span class="time">${time}</span></span>${s.privacy ? "" : `<span class="mi-prev"><span>${esc(text)}</span></span>`}</span></${who === "anna" ? "span" : "button"}>`;
        return `<div class="mail-conv${open ? " open" : ""}"><button type="button" class="mail-item" data-thread aria-expanded="${open}">
          <span class="av-pair">${avatar(initials(p.name), x.c, "av av-20 av-mail")}${avatar("AW", 0, "av av-20 av-mail")}</span>
          <span class="mi-main">
            <span class="mi-top"><b>${esc(p.name)} and You</b><span class="time">${last[1]}</span></span>
            ${s.privacy ? "" : `<span class="mi-sub"><span>${esc(x.subject)}</span></span>`}
            ${s.privacy ? "" : `<span class="mi-prev"><span>${mine ? `You: ${esc(last[2])}` : esc(last[2])}</span></span>`}
            <span class="mi-tags">${tags}</span>
          </span>
        </button>${open ? `<div class="mail-thread">${x.thread.map(sub).join("")}</div>` : ""}</div>`;
      };
      const row = (x) => {
        if (x.thread) return conv(x);
        const unread = x.unread && !s.readMail.has(x.id);
        const tags = `${x.reply ? `<span class="chip chip-reply chip-sm">${icon("reply", "ic ic-12")}needs reply</span>` : ""}${x.label ? label(...x.label).replace('class="lbl"', 'class="lbl lbl-sm"') : ""}`;
        return `<button type="button" class="mail-item${x.id === s.mail ? " on" : ""}${unread ? " unread" : ""}${flagged(x) ? " flagged" : ""}" data-mail="${x.id}" aria-pressed="${x.id === s.mail}">
        ${avatar(initials(x.from), x.c, `av av-38${ROOMS.some((r) => r.mail && r.name === x.from) ? "" : " av-none"}`)}
        <span class="mi-main">
          <span class="mi-top"><b>${esc(x.from)}</b>${flagged(x) ? `<span class="mi-star" title="Important">${icon("star", "ic ic-12")}</span>` : ""}<span class="time">${x.time}</span></span>
          ${s.privacy ? "" : `<span class="mi-sub"><span>${esc(x.subject)}</span></span>`}
          ${s.privacy ? "" : `<span class="mi-prev">${x.file ? icon("clip", "ic ic-14") : ""}<span>${esc(x.body[1] ?? x.body[0])}</span></span>`}
          ${tags ? `<span class="mi-tags">${tags}</span>` : ""}
        </span>
      </button>`;
      };
      const f = (k, l, n) =>
        `<button type="button" class="pill${s.mailFilter === k ? " on" : ""}" data-filter="${k}" aria-pressed="${s.mailFilter === k}">${l}${n ? `<em>${n}</em>` : ""}</button>`;
      const added = m.event && s.added.has(m.id);
      // A sender with a mail chat opens it; anyone else can be followed.
      const chat = ROOMS.find((r) => r.mail && r.name === m.from);
      const tool = (ic, title, attr = "") =>
        `<button type="button" class="rd-tool" title="${title}" ${attr}>${icon(ic, "ic ic-18")}</button>`;
      return `<div class="list-pane mail-list">
          <div class="lp-head"><b class="lp-pick">Inbox${icon("down", "ic ic-14")}</b><span class="lp-icons"><span title="Threads">${icon("thread", "ic ic-18")}</span><span title="Refresh">${icon("sync", "ic ic-18")}</span></span><button type="button" class="lp-new btn-ui" title="Write mail">${icon("edit")}</button></div>
          <div class="pills">${f("all", "All")}${f("answer", "To answer", INBOX.filter((x) => x.reply).length)}${f("flagged", "Important", INBOX.filter((x) => flagged(x)).length)}${f("people", "People", INBOX.filter((x) => x.kind === "Person").length)}<span class="pill">Notifications</span><span class="pill">Newsletters</span><span class="pill">Spam</span></div>${labelRow}
          <div class="mail-rows">${shown.map(row).join("")}</div>
        </div>
        <div class="reader">
          ${gate(`<div class="mail-head">
            <div class="rd-title"><h3 class="rd-subject">${esc(m.subject)}</h3><div class="rd-tools" role="toolbar" aria-label="Mail actions">${tool("reply", "Reply")}${tool("forward", "Forward")}<span class="rd-sep"></span><button type="button" class="rd-tool rd-star${flagged(m) ? " on" : ""}" data-flag="${m.id}" aria-pressed="${flagged(m)}" title="${flagged(m) ? "Not important" : "Mark as important"}">${icon("star", "ic ic-18")}</button>${tool("note", "Add to a note")}${chat ? tool("chat", `Open ${esc(chat.name)}`, `data-room="${chat.id}"`) : tool("link", "Add to a chat")}</div></div>
            <div class="rd-from">${avatar(initials(m.from), m.c, `av av-40${chat ? "" : " av-none"}`)}<span><b>${esc(m.from)}</b><small>${esc(m.addr)}</small></span>
              ${chat ? "" : `<button type="button" class="bar-btn btn-ui">${icon("plus", "ic ic-14")}Follow</button>`}</div>
            <div class="rd-meta"><span>${m.time.includes(":") ? `Today, ${m.time}` : m.time}</span><span class="rd-acct">${icon("mail", "ic ic-14")}anna.weber@uni.example</span></div>
            <div class="rd-kind"><div class="seg-ui seg-inline">${["Person", "Notification", "Newsletter", "Spam"].map((k) => `<span class="${k === m.kind ? "on" : ""}">${k}</span>`).join("")}</div><span class="rd-sorted">Sorted by nimble-v3</span><span class="comp-fill"></span>${m.reply ? `<span class="chip chip-reply">${icon("reply", "ic ic-12")}needs reply</span>` : ""}${m.label ? label(...m.label).replace('class="lbl"', 'class="lbl lbl-sm"') : ""}</div>
          </div>
          <div class="rd-body">${m.body.map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("")}
            ${m.file ? `<span class="rd-file"><span class="file-ic">${icon("file", "ic ic-14")}</span><b>${esc(m.file[0])}</b><small>${m.file[1]}</small>${icon("download", "ic ic-14")}</span>` : ""}
          ${
            m.event
              ? `<div class="rd-events"><p class="found-h"><span class="spark">${icon("spark", "ic ic-16")}</span><b>Events in this mail</b><em>1</em></p>
            ${
              added
                ? `<p class="ai-done"><i>${icon("check", "ic ic-12")}</i>${esc(m.event.title)} is in your calendar</p>`
                : `<div class="ev-card"><span class="ev-date"><small>${m.event.mon}</small><b>${m.event.day}</b></span>
              <span class="ev-main"><b>${esc(m.event.title)}</b><small><span class="pk-chip">${icon("clock", "ic ic-12")}${m.event.when}</span><span class="pk-chip">${icon("mappin", "ic ic-12")}${m.event.where}</span></small></span>
              <button type="button" class="ai-add btn-ui" data-add-event="${m.id}">${icon("plus", "ic ic-16")}Add</button><span class="ai-x">${icon("close", "ic ic-18")}</span>
            </div>`
            }</div>`
              : ""
          }
          </div>`)}
        </div>`;
    }

    // Calendar
    function calendarView() {
      const H0 = 8,
        H1 = 20,
        ROW = 52;
      const month = [
        [28, 29, 30, 1, 2, 3, 4],
        [5, 6, 7, 8, 9, 10, 11],
        [12, 13, 14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23, 24, 25],
        [26, 27, 28, 29, 30, 31, 1],
      ];
      // CalendarPage.svelte: the month with ISO week numbers, the shown week as one rounded band.
      const day = (wi, d, di) => {
        const c = [];
        if (wi === 3)
          c.push("wk", di === 0 ? "wk-first" : di === 6 ? "wk-last" : "");
        if ((wi === 0 && d > 7) || (wi === 4 && d < 7)) c.push("out");
        if (wi === 3 && di === TODAY) c.push("today");
        return `<span class="${c.join(" ").trim()}">${d}</span>`;
      };
      const mini = `<div class="mini"><p class="mini-h"><b>October 2026</b><span class="cal-nav">${icon("left", "ic ic-16")}</span><span class="cal-nav">${icon("right", "ic ic-16")}</span></p><div class="mini-grid"><span class="mini-d"></span>${["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => `<span class="mini-d">${d}</span>`).join("")}${month.map((w, wi) => `<span class="wkn">${40 + wi}</span>${w.map((d, di) => day(wi, d, di)).join("")}`).join("")}</div></div>`;
      const calRow = ([n, c, logoId]) =>
        `<p class="cal-row"><i class="cal-box" style="--l:var(--label-${c})">${icon("check", "ic")}</i><span>${n}</span>${logoId ? serviceLogo(logoId) : ""}</p>`;
      const cals = `<div class="cal-cals"><p class="side-h">Calendars<span class="comp-fill"></span><span class="side-ic">${icon("sync", "ic ic-14")}</span><span class="side-ic">${icon("import", "ic ic-14")}</span><span class="side-ic">${icon("plus", "ic ic-14")}</span></p>${[
        ["Personal", "blue"],
        ["Picked up from chats", "purple"],
      ].map(calRow).join("")}<p class="cal-group">Plugins</p>${calRow(["University Moodle", "orange", "moodle"])}<p class="cal-group">Subscribed</p>${calRow(["CS Colloquium", "teal"])}</div>`;
      const events = SUGG.filter(
        (g) =>
          g.kind === "event" &&
          (!s.handled.has(g.id) || s.accepted.has(g.id)),
      );
      const found = `<div class="cal-found"><p class="side-h">Found in chats <em class="cnt">${open("event").length}</em></p>${events
        .map((g) => {
          const r = roomById(g.room);
          const done = s.accepted.has(g.id);
          return `<div class="found${done ? " taken" : ""}"><b>${esc(g.title)}</b><small>${g.date}, ${g.at}</small><small class="from">from ${acctTag(r.acct[0]).replace('class="tag', 'class="tag tag-sm')} <span>${esc(r.name)}</span></small>
        ${done ? `<p class="ai-done"><i>${icon("check", "ic ic-12")}</i>Added to your calendar</p>` : `<span class="found-act"><button type="button" class="primary btn-ui" data-take="${g.id}">Add</button><button type="button" class="btn-ui" data-drop="${g.id}">Dismiss</button></span>`}</div>`;
        })
        .join("")}</div><div class="cal-goes"><p class="side-h">Chat events can also go to</p><span class="field-sel">Weft only${icon("down", "ic ic-14")}</span></div>`;
      const hours = Array.from(
        { length: H1 - H0 },
        (_, i) =>
          `<span class="hr" style="top:${i * ROW}px">${fmtH(H0 + i)}</span>`,
      ).join("");
      const lines = Array.from(
        { length: H1 - H0 },
        (_, i) => `<i style="top:${i * ROW}px"></i>`,
      ).join("");
      const ev = (e) =>
        e.from === e.to
          ? `<span class="ev ev-moment" style="--l:var(--label-${e.cal});top:${(e.from - H0) * ROW + 1}px"><b>${esc(e.title)}</b></span>`
          : `<span class="ev${e.added ? " ev-new" : ""}" style="--l:var(--label-${e.cal});top:${(e.from - H0) * ROW + 1}px;height:${(e.to - e.from) * ROW - 3}px"><b>${e.chat ? icon("spark", "ic") : e.repeat ? icon("repeat", "ic") : ""}${esc(e.title)}</b><small>${fmtH(e.from)}-${fmtH(e.to)}${e.where ? `, ${esc(e.where)}` : ""}</small></span>`;
      const cols = WEEK.map(
        (d, i) =>
          `<div class="day-col${i === TODAY ? " is-today" : ""}${i >= 5 ? " wkend" : ""}">${s.cal
            .filter((e) => e.day === i)
            .map(ev)
            .join(
              "",
            )}${i === TODAY ? `<i class="now" style="top:${(13.5 - H0) * ROW}px"></i>` : ""}</div>`,
      ).join("");
      return `<div class="list-pane cal-side">${mini}${cals}${found}</div>
        <div class="cal-main">
          ${gate(`<div class="cal-bar"><span class="tl-btn">Today</span><span class="cal-nav">${icon("left")}</span><span class="cal-nav">${icon("right")}</span><b class="cal-title">October 2026</b><span class="hweek">Week 43</span><span class="comp-fill"></span><div class="seg-ui seg-inline"><span>Day</span><span class="on">Week</span><span>Month</span></div><span class="send">${icon("plus", "ic ic-16")}New event</span></div>
          <div class="cal-head"><span></span>${WEEK.map((d, i) => `<span class="${i === TODAY ? "is-today" : ""}">${DAYS[i]} <b>${d}</b></span>`).join("")}</div>
          <div class="cal-allday"><span></span>${WEEK.map(
            (_, i) =>
              `<span>${ALLDAY.filter((a) => a.day === i)
                .map(
                  (a) =>
                    `<i class="ev-all" style="--l:var(--label-${a.cal})">${esc(a.title)}</i>`,
                )
                .join("")}</span>`,
          ).join("")}</div>
          <div class="cal-scroll"><div class="cal-grid" style="height:${(H1 - H0) * ROW}px"><div class="cal-lines">${lines}</div><div class="hours">${hours}</div>${cols}</div></div>
          <div class="cal-ask"><div class="bar">${icon("spark")}<span>Find a time or plan an event…</span><span class="go">${icon("send", "ic ic-16")}</span></div><span class="cal-fold">${icon("down", "ic ic-16")}</span></div>`)}
        </div>`;
    }

    // Todos
    function todosView() {
      const card = (t, sugg, col) =>
        todoCardHtml(t, { sugg, done: s.done.has(t.id), col });
      // A suggestion as a card: its quote, due date, label and the chat it came from.
      const asTodo = (g) => ({
        id: g.id,
        title: g.title,
        quote: g.quote,
        due: g.due,
        label: g.label,
        from: roomById(g.room).name,
      });
      const sugg = open("todo").map(asTodo);
      const upcoming = [
        ...SUGG.filter((g) => s.accepted.has(g.id) && g.kind === "todo").map(
          asTodo,
        ),
        ...TODOS.upcoming,
      ];
      const done = [...TODOS.today, ...TODOS.upcoming].filter((t) =>
        s.done.has(t.id),
      );
      const col = (ic, name, n, body, cls = "", extra = "") =>
        `<div class="col${cls}"><p class="fl-col"><span class="c-icon">${icon(ic, "ic ic-16")}</span><b>${name}</b><em>${n}</em><span class="comp-fill"></span>${extra || (cls === " col-sugg" ? "" : `<span class="c-tool">${icon("plus", "ic ic-16")}</span>`)}${cls ? `<span class="c-tool">${icon("left", "ic ic-14")}</span>` : ""}</p><div class="col-cards">${body}</div></div>`;
      return `<div class="todo-page">
          <div class="todo-bar"><span class="comp-fill"><b class="page-title">Todos</b><small>Saturday 24 October</small></span><div class="seg-ui seg-inline"><span class="on">${icon("cal", "ic ic-16")}By date</span><span>${icon("label", "ic ic-16")}By label</span></div><span class="send">${icon("plus", "ic ic-16")}New todo</span></div>
          <div class="todo-labels">${[
            ["Research", "blue"],
            ["Teaching", "green"],
            ["Thesis supervision", "purple"],
            ["Conference", "pink"],
            ["Admin", "orange"],
          ]
            .map(
              ([n, c]) =>
                `<span class="lbl-pill" style="--c:var(--label-${c})">${n}</span>`,
            )
            .join(
              "",
            )}<span class="lbl-tiny" title="Labels">${icon("gear", "ic ic-14")}</span></div>
          ${gate(`<div class="todo-board">
            ${col("spark", "From your chats", sugg.length, sugg.length ? sugg.map((t) => card(t, true)).join("") : `<p class="empty">Nothing new from your chats.</p>`, " col-sugg", sugg.length > 1 ? `<button type="button" class="c-link btn-ui" data-take-all="todo">Add all</button>` : "")}
            ${col(
              "today",
              "Today",
              TODOS.today.filter((t) => !s.done.has(t.id)).length,
              `<p class="fl-day overdue">Overdue</p>${card(TODOS.today[0], false, "today")}<p class="fl-day">Today</p>${TODOS.today
                .slice(1)
                .map((t) => card(t, false, "today"))
                .join("")}`,
              " col-today",
            )}
            ${col("cal", "Upcoming", upcoming.length, upcoming.map((t) => card(t, false, "upcoming")).join(""))}
          </div>`)}
        </div>`;
    }

    // Notes
    function notesView() {
      const n = NOTES.find((x) => x.id === s.note);
      const body = s.notes[n.id];
      const noteRow = (id, depth) => {
        const x = NOTES.find((y) => y.id === id);
        return `<button type="button" class="frow nrow${x.id === s.note ? " on" : ""}" style="padding-left:${6 + depth * 16 + 24}px" data-note="${x.id}" aria-pressed="${x.id === s.note}">${icon("note", "ic ic-16")}<span class="fname">${esc(x.title)}</span>${x.chat ? icon("link", "ic ic-14 ic-mute") : ""}</button>`;
      };
      const folderRow = (f) => {
        const open = s.folders.has(f.id);
        return `<button type="button" class="frow" data-folder="${f.id}" aria-expanded="${open}"${f.vault ? ' title="Obsidian vault on this device"' : ""}><span class="chev${open ? " open" : ""}">${icon("right", "ic ic-14")}</span>${icon(f.vault ? "vault" : "folder", "ic ic-16")}<span class="fname">${esc(f.name)}</span>${f.vault ? serviceLogo("obsidian") : ""}<span class="fcount">${f.notes.length}</span></button>${open ? f.notes.map((id) => noteRow(id, 0)).join("") : ""}`;
      };
      const inTree = new Set(NOTE_TREE.flatMap((f) => f.notes));
      const mode = (k, ic, t) =>
        `<button type="button" role="radio" class="nt-tool" aria-checked="${s.noteMode === k}" data-mode="${k}" title="${t}">${icon(ic)}</button>`;
      const tool = (ic, t) =>
        `<span class="nt-tool" title="${t}">${icon(ic)}</span>`;
      const room = ROOMS.find((r) => r.name === n.chat);
      // NoteEditor.svelte: list toggle, layout, formats, width and size, then saved, send, delete.
      return `<div class="list-pane notes-list">
          <div class="lp-head"><b>Notes</b><span class="lp-tool" title="New folder">${icon("folder-new")}</span><span class="lp-new">${icon("edit")}</span></div>
          <span class="lp-filter">${icon("search")}<span>Search notes</span></span>
          <div class="note-rows">${NOTE_TREE.map(folderRow).join("")}${NOTES.filter((x) => !inTree.has(x.id)).map((x) => noteRow(x.id, -1)).join("")}</div>
        </div>
        <div class="note-pane">
          ${gate(`<div class="note-bar">
            <span class="nt-tool on" title="Hide the note list">${icon("panel")}</span><span class="nt-sep"></span>
            ${tool("bold", "Bold")}${tool("title", "Heading")}${tool("list", "List")}${tool("todo", "Checklist")}${tool("chat", "Link a message")}${tool("clip", "Embed a file")}<span class="nt-tool on" title="Unlink the chat">${icon("link")}</span>
            <span class="nt-sep nt-size"></span><span class="nt-tool nt-size" title="Full width">${icon("wide")}</span><span class="nt-tool nt-size nt-a" title="Smaller text">A<small>-</small></span><span class="nt-tool nt-size nt-a big" title="Larger text">A<small>+</small></span>
            <span class="comp-fill"></span><span class="nt-saved">Saved ${n.time}</span>
            <div class="nt-modes" role="radiogroup" aria-label="Note layout">${mode("edit", "edit", "Markdown")}${mode("split", "split", "Side by side")}${mode("preview", "eye", "Preview")}</div>
            <span class="nt-sep"></span>${tool("send", "Send to a chat")}${tool("trash", "Delete note")}</div>
          <div class="note-body mode-${s.noteMode}">
            <div class="nt-title">${n.chat ? `<span class="note-chat">${icon("link", "ic ic-12")}Linked to ${esc(n.chat)}${room ? acctTag(room.acct[0]) : ""}</span>` : `<span class="note-chat">${serviceLogo("obsidian")}Grounded assistants.md in Reading vault</span>`}<span class="add-tag">${icon("plus", "ic ic-12")}Add tag</span><b>${esc(n.title)}</b></div>
            <div class="nt-panes">
              <div class="nt-write"><div class="nt-stack">
                <pre class="nt-hl" aria-hidden="true">${highlightNote(body)}</pre>
                <label class="sr" for="md-${uid}">Markdown of ${esc(n.title)}</label>
                <textarea id="md-${uid}" class="md-src" spellcheck="false">${esc(body)}</textarea>
              </div></div>
              <div class="md">${md(body)}</div>
            </div>
          </div>`)}
        </div>`;
    }

    // A person's page
    function profileView() {
      const k = s.person,
        p = person(k),
        pr = PROFILE[k] ?? {};
      const theirs = ROOMS.flatMap((r) =>
        r.msgs.filter((m) => m[0] === k).map((m) => ({ r, m })),
      );
      const chats = ROOMS.filter((r) => r.msgs.some((m) => m[0] === k));
      const questions = theirs.filter(({ m }) => m[3]?.chip === "needs reply");
      // What was picked up in your direct chat with them.
      const picked = open().filter((g) => roomById(g.room).dm === k);
      const stats = [
        chats.length,
        pr.messages ?? theirs.length,
        (pr.files ?? []).length,
      ];
      const tab = (v, l, n) =>
        `<button type="button" class="ptab${s.ptab === v ? " on" : ""}" data-ptab="${v}" aria-pressed="${s.ptab === v}">${l}${n != null ? `<em>${n}</em>` : ""}</button>`;
      const lastOf = (r) => r.msgs.filter((m) => m[0] === k).at(-1);
      const content =
        s.ptab === "chats"
          ? chats
              .map(
                (r) =>
                  `<button type="button" class="prow" data-room="${r.id}">${avatar(r.av, r.c, roomAv(r, "av av-38"))}<span class="pr-text"><span class="pr-line">${esc(r.name)}${r.acct.map((a) => acctTag(a).replace('class="tag', 'class="tag tag-sm')).join("")}</span><span class="pr-meta">${esc(lastOf(r)[2])}</span></span><span class="pr-side"><span class="pr-time">${lastOf(r)[1]}</span><span class="pr-count">${r.msgs.filter((m) => m[0] === k).length}</span></span></button>`,
              )
              .join("")
          : s.ptab === "files"
            ? (pr.files ?? [])
                .map(
                  ([f, size, when]) =>
                    `<div class="prow"><span class="pr-glyph file">${icon("file", "ic ic-18")}</span><span class="pr-text"><span class="pr-line">${esc(f)}</span><span class="pr-meta">${size}</span></span><span class="pr-time">${when}</span></div>`,
                )
                .join("") || `<p class="empty">No files yet.</p>`
            : `<div class="runs">${chats
                .map((r) =>
                  runCardHtml(
                    r,
                    r.msgs
                      .filter((m) => m[0] === k)
                      .slice(-2)
                      .map((m) => [
                        m[0],
                        m[1],
                        m[2],
                        { ...m[3], read: undefined, react: undefined },
                      ]),
                    lastOf(r)[1],
                  ),
                )
                .join("")}</div>`;
      const sec = (title, n, rows) =>
        `<section class="pf-sec"><p class="pf-sec-h">${title}${n != null ? ` <em>${n}</em>` : ""}</p>${rows}</section>`;
      return `<div class="profile">
          <div class="pf-bar"><span class="rail-eye">${icon("left")}</span><b>${esc(p.name)}</b></div>
          ${gate(`<div class="pf-body"><div class="pf-main">
            <div class="pf-hero"><span class="av-wrap av-wrap-xl">${avatar(initials(p.name), p.c, "av av-xl")}<i class="online"></i></span>
              <div class="pf-who"><h3>${esc(p.name)}</h3><p class="pf-ids">${(IDS[k] ?? []).map((id) => `<span>${esc(id)}</span>`).join("")}</p>
                <p class="pf-presence"><span class="online-txt">Online</span>${pr.status ? `<span class="pf-status">${esc(pr.status)}</span>` : ""}</p>
                <p class="pf-stats"><span><b>${stats[0]}</b> chats</span><span><b>${stats[1]}</b> messages</span><span><b>${stats[2]}</b> files</span>${[...new Set((IDS[k] ?? []).map((id) => (id.includes("example.org") ? "example" : "uni")))].map(acctTag).join("")}</p></div>
              <div class="pf-actions"><button type="button" class="send" data-room="${chats.find((r) => r.dm === k)?.id ?? chats[0]?.id ?? "lab"}">${icon("chat", "ic ic-18")}Message</button><span class="pf-framed">${icon("pin")}</span><span class="pf-framed">${icon("bell")}</span></div>
            </div>
            <div class="ptabs">${tab("messages", "Messages")}${tab("chats", "Chats", chats.length)}${tab("files", "Files", (pr.files ?? []).length)}</div>
            <div class="ptab-body">${content}</div>
          </div>
          <aside class="pf-aside">
            ${questions.length ? sec("Open questions", questions.length, questions.map(({ r, m }) => `<button type="button" class="prow" data-room="${r.id}"><span class="pr-glyph ai">${icon("reply", "ic ic-18")}</span><span class="pr-text"><span class="pr-line wrap">${esc(m[2])}</span><span class="pr-meta">${esc(r.name)}, ${m[1]}</span></span></button>`).join("")) : ""}
            ${picked.length ? sec("Picked up from your chats", picked.length, picked.map((g) => `<div class="prow"><span class="pr-glyph ai">${icon(g.kind === "event" ? "cal" : "todo", "ic ic-18")}</span><span class="pr-text"><span class="pr-line">${esc(g.title)}</span><span class="pr-meta">${g.kind === "event" ? `${g.date}, ${g.at}` : `Due ${g.due}`}</span></span><button type="button" class="pr-tiny btn-ui" data-take="${g.id}" title="Add">${icon("plus", "ic ic-18")}</button><button type="button" class="pr-tiny btn-ui" data-drop="${g.id}" title="Dismiss">${icon("close", "ic ic-16")}</button></div>`).join("")) : ""}
            ${pr.events ? sec("Events together", pr.events.length, pr.events.map(([d, t, title, where]) => `<div class="prow"><span class="pr-date"><b>${d.split(" ")[1]}</b><small>Oct</small></span><span class="pr-text"><span class="pr-line">${esc(title)}</span><span class="pr-meta">${t}, ${esc(where)}</span></span></div>`).join("")) : ""}
            ${sec(
              "Conversations",
              null,
              chats
                .slice(0, 5)
                .map(
                  (r) =>
                    `<button type="button" class="prow" data-room="${r.id}">${avatar(r.av, r.c, roomAv(r, "av av-30"))}<span class="pr-text"><span class="pr-line">${esc(r.name)}</span><span class="pr-meta">${esc(lastOf(r)[2])}</span></span><span class="pr-time">${lastOf(r)[1]}</span></button>`,
                )
                .join(""),
            )}
          </aside></div>`)}
        </div>`;
    }

    const VIEWS = {
      timeline: timelineView,
      chats: chatsView,
      inbox: inboxView,
      calendar: calendarView,
      todos: todosView,
      notes: notesView,
      profile: profileView,
    };

    function render(focus = false) {
      el.dataset.page = s.view;
      el.innerHTML =
        rail() +
        `<div class="main">${VIEWS[s.view]()}</div>` +
        (s.toast ? `<p class="toast" role="status">${esc(s.toast)}</p>` : "");
      // A chat opens at its first unread message (the "New since" divider), else at the bottom.
      fitNote();
      const body = $(".tl-body", el);
      const fresh = body && $(".new-since", body);
      if (body)
        body.scrollTop = fresh
          ? fresh.getBoundingClientRect().top -
            body.getBoundingClientRect().top -
            8
          : body.scrollHeight;
      if (focus) $(focus, el)?.focus();
      el.dispatchEvent(
        new CustomEvent("weft:view", { detail: s.view, bubbles: true }),
      );
    }

    const flagged = (m) => s.flags.has(m.id);

    /** The suggestions still open: of a room, of a kind ("event", "todo"), or all. */
    function open(of = "") {
      return SUGG.filter(
        (x) =>
          !s.handled.has(x.id) &&
          (!of || x.room === of || x.kind === of),
      );
    }
    function accept(g) {
      if (s.handled.has(g.id)) return;
      s.handled.add(g.id);
      s.accepted.add(g.id);
      if (g.add) s.cal.push({ ...g.add, added: true });
    }
    const firstName = (k) =>
      k === "anna" ? "You" : person(k).name.replace(/^Prof\. /, "").split(" ")[0];

    // The note source is as tall as its text and its pane scrolls, so the colours under the
    // transparent textarea line up without scroll syncing.
    function fitNote() {
      const ta = $(".md-src", el);
      if (!ta || !ta.offsetParent) return;
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }

    function toast(text) {
      s.toast = text;
      render();
      setTimeout(() => {
        if (s.toast === text) {
          s.toast = "";
          $(".toast", el)?.remove();
        }
      }, 1800);
    }

    function setPrivacy(on) {
      s.privacy = on;
      s.shown = null;
      toast(`Privacy mode ${on ? "on" : "off"}`);
      el.dispatchEvent(
        new CustomEvent("weft:privacy", { detail: on, bubbles: true }),
      );
    }

    function go(view) {
      s.view = view;
      if (view === "inbox") s.readMail.add(s.mail);
      render();
    }

    el.addEventListener("click", (e) => {
      const t = e.target;
      const hit = (sel) => t.closest(sel);
      let x;
      if (hit("[data-eye]")) return setPrivacy(!s.privacy);
      if ((x = hit("[data-catchup]"))) {
        s.catchup = x.dataset.catchup === "close" ? null : s.room;
        return render();
      }
      if (hit("[data-away]")) {
        s.awayDismissed = true;
        return render();
      }
      if ((x = hit("[data-take]"))) {
        const g = suggById(x.dataset.take);
        accept(g);
        return toast(
          `Added "${g.title}" to your ${g.kind === "event" ? "calendar" : "todos"}`,
        );
      }
      if ((x = hit("[data-drop]"))) {
        s.handled.add(x.dataset.drop);
        return render();
      }
      if ((x = hit("[data-take-all]"))) {
        const list = open(x.dataset.takeAll);
        list.forEach(accept);
        return toast(`Added ${list.length} suggestions`);
      }
      if (hit("[data-pick-fold]")) {
        s.trayOpen = !s.trayOpen;
        return render();
      }
      if (hit("[data-show]")) {
        s.shown = place();
        return render();
      }
      if ((x = hit("[data-view]"))) return go(x.dataset.view);
      if ((x = hit("[data-person]")) && x.dataset.person !== "anna") {
        s.person = x.dataset.person;
        s.ptab = "messages";
        return go("profile");
      }
      if ((x = hit("[data-room]"))) {
        s.room = x.dataset.room;
        s.read.add(s.room);
        return go("chats");
      }
      if ((x = hit("[data-mail]"))) {
        s.mail = x.dataset.mail;
        s.readMail.add(s.mail);
        return render();
      }
      if ((x = hit("[data-flag]"))) {
        const id = x.dataset.flag;
        s.flags.has(id) ? s.flags.delete(id) : s.flags.add(id);
        return render();
      }
      if (hit("[data-thread]")) {
        s.threadOpen = !s.threadOpen;
        return render();
      }
      if ((x = hit("[data-mail-label]"))) {
        const l = x.dataset.mailLabel;
        s.mailLabel = l && s.mailLabel !== l ? l : null;
        return render();
      }
      if ((x = hit("[data-filter]"))) {
        s.mailFilter = x.dataset.filter;
        return render();
      }
      if ((x = hit("[data-add-event]"))) {
        const m = INBOX.find((y) => y.id === x.dataset.addEvent);
        s.added.add(m.id);
        return toast(`Added "${m.event.title}" to your calendar`);
      }
      if ((x = hit("[data-done]"))) {
        const id = x.dataset.done;
        s.done.has(id) ? s.done.delete(id) : s.done.add(id);
        return render();
      }
      if ((x = hit("[data-folder]"))) {
        const id = x.dataset.folder;
        s.folders.has(id) ? s.folders.delete(id) : s.folders.add(id);
        return render();
      }
      if ((x = hit("[data-note]"))) {
        s.note = x.dataset.note;
        return render();
      }
      if ((x = hit("[data-mode]"))) {
        s.noteMode = x.dataset.mode;
        return render(s.noteMode === "preview" ? false : ".md-src");
      }
      if ((x = hit("[data-ptab]"))) {
        s.ptab = x.dataset.ptab;
        return render();
      }
      if ((x = hit("[data-task]"))) {
        // Ticking a box in the preview edits the Markdown, as in the app.
        let n = -1;
        const want = Number(x.dataset.task);
        s.notes[s.note] = s.notes[s.note].replace(/\[( |x)\]/g, (all, c) =>
          ++n === want ? (c === "x" ? "[ ]" : "[x]") : all,
        );
        return render();
      }
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.matches(".mcard[data-room]"))
        e.target.click();
    });
    el.addEventListener("input", (e) => {
      if (e.target.matches(`#compose-${uid}`)) {
        $(".composer .send", el).disabled = !e.target.value.trim();
        return;
      }
      if (!e.target.matches(".md-src")) return;
      s.notes[s.note] = e.target.value;
      $(".md", el).innerHTML = md(e.target.value);
      $(".nt-hl", el).innerHTML = highlightNote(e.target.value);
      fitNote();
    });
    el.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $(`#compose-${uid}`, el);
      const text = input.value.trim();
      if (!text) return;
      const t = hhmm();
      // In a linked chat, a sent message is tagged with the account it went out from.
      const r = roomById(s.room);
      (s.sent[s.room] ??= []).push([
        "anna",
        t,
        text,
        r.linked ? { tag: r.acct[0] } : {},
      ]);
      s.last[s.room] = { preview: `You: ${text}`, time: t };
      render(`#compose-${uid}`);
    });
    render();
    return {
      setPrivacy,
      go,
      get privacy() {
        return s.privacy;
      },
    };
  }

  const heroEl = $('[data-frag="hero"]');
  if (heroEl) mountWindow(heroEl);

  // The workspace window: the page's tabs and the window's own sidebar pick the same view.
  const tourEl = $('[data-frag="tour"]');
  if (tourEl) {
    const tour = mountWindow(tourEl, { view: "timeline" });
    const tabs = $$("[data-tour]");
    tabs.forEach((b) =>
      b.addEventListener("click", () => tour.go(b.dataset.tour)),
    );
    tourEl.addEventListener("weft:view", (e) =>
      tabs.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.tour === e.detail)),
      ),
    );
    tabs.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.tour === "timeline")),
    );

    // Until the visitor takes over, the window moves through its views on its own. The fill on
    // the active tab is the clock: when its animation ends, the next view opens, so pausing the
    // animation (hover, off screen) pauses the tour. Any click, key or focus inside stops it.
    const row = $(".tour-tabs");
    if (row && !reduced) {
      const order = tabs.map((b) => b.dataset.tour);
      const stop = () => row.classList.remove("cycling", "paused");
      row.addEventListener("animationend", (e) => {
        if (
          !row.classList.contains("cycling") ||
          !e.target.matches('[aria-pressed="true"]')
        )
          return;
        const next =
          order[(order.indexOf(e.target.dataset.tour) + 1) % order.length];
        tour.go(next);
      });
      for (const target of [tourEl, row]) {
        target.addEventListener("pointerdown", stop);
        target.addEventListener("keydown", stop);
      }
      tourEl.addEventListener("focusin", stop);
      tourEl.addEventListener("mouseenter", () => row.classList.add("hold"));
      tourEl.addEventListener("mouseleave", () => row.classList.remove("hold"));
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !row.dataset.started) {
              row.dataset.started = "1";
              row.classList.add("cycling");
            }
            row.classList.toggle("paused", !entry.isIntersecting);
          },
          { threshold: 0.35 },
        ).observe(tourEl);
      }
    }
  }

  // Privacy mode only applies to its own window, as it would to the app.
  const privEl = $('[data-frag="privacy"]');
  const privWin = privEl
    ? mountWindow(privEl, { room: "sem", privacy: true })
    : null;
  if (privWin) {
    const btn = $("[data-privacy-toggle]");
    const word = $("[data-privacy-word]");
    privEl.addEventListener("weft:privacy", (e) => {
      if (btn) {
        btn.setAttribute("aria-pressed", String(e.detail));
        btn.textContent = e.detail
          ? "Turn privacy mode off"
          : "Turn privacy mode on";
      }
      if (word) word.textContent = e.detail ? "on" : "off";
    });
    btn?.addEventListener("click", () => privWin.setPrivacy(!privWin.privacy));
    addEventListener("keydown", (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "h"
      ) {
        e.preventDefault();
        privWin.setPrivacy(!privWin.privacy);
      }
    });
  }

  // --- Search --------------------------------------------------------------------------------

  const CORPUS = [
    ...ROOMS.flatMap((r) =>
      // Mail in a chat is found under Mail, with its subject and the chat it is in.
      r.msgs.map((m) =>
        m[3]?.mail
          ? {
              kind: "mail",
              who: person(m[0]).name,
              c: person(m[0]).c,
              where: m[3].mail.subject,
              chat: r.name,
              acct: "mail",
              time: m[1],
              text: m[2],
            }
          : {
              kind: "chat",
              who: person(m[0]).name,
              c: person(m[0]).c,
              where: r.name,
              acct: m[3]?.tag ?? r.acct[0],
              time: m[1],
              text: m[2],
            },
      ),
    ),
    ...MAILS.map((m) => ({
      kind: "mail",
      who: m.from,
      c: 0,
      where: m.subject,
      acct: "mail",
      time: m.time,
      text: m.text,
    })),
    // Older messages, a note, todos and calendar entries: search covers the whole workspace.
    {
      kind: "chat",
      who: "Prof. Jonas Brandt",
      c: 2,
      where: "Machine Learning Lab",
      acct: "uni",
      time: "Mon 09:12",
      text: "Reminder: the CHI abstract deadline is Friday, the full paper follows a week later. Let's use the lab meeting to go through all figures.",
    },
    {
      kind: "chat",
      who: "Lea Fischer",
      c: 5,
      where: "Machine Learning Lab",
      acct: "uni",
      time: "Yesterday",
      text: "I booked room E23 for our meetings this week, the usual one is taken by the exam committee.",
    },
    {
      kind: "chat",
      who: "Lukas Hoffmann",
      c: 4,
      where: "Machine Learning Lab",
      acct: "uni",
      time: "Yesterday",
      text: "First draft of Figure 3. Accuracy drops about 6 points without the retrieval module.",
    },
    {
      kind: "note",
      who: "Note",
      where: "Lab meeting agenda",
      time: "Yesterday",
      text: "Figures for the CHI paper, ablation results with 5 seeds, who reviews which section, GPU cluster maintenance on Saturday.",
    },
    {
      kind: "todo",
      who: "Todo",
      where: "Research",
      time: "Thu",
      text: "Prepare slides for the lab meeting",
    },
    {
      kind: "todo",
      who: "Todo",
      where: "Conference",
      time: "Tue 27 Oct",
      text: "Book train to Vienna. Night train or ICE via Munich, check the travel policy.",
    },
    {
      kind: "todo",
      who: "Todo",
      where: "Research",
      time: "Today",
      text: "Finish CHI abstract: robustness result (5 seeds), final word count at most 250.",
    },
    {
      kind: "todo",
      who: "Todo",
      where: "Study dashboard !42",
      time: "Today",
      text: "From GitLab: improve keyboard navigation in the study dashboard, review requested by Sofia.",
    },
    {
      kind: "event",
      who: "Calendar",
      where: "Thursday, from Moodle",
      time: "12:00",
      text: "Exercise sheet 5 is due in Human-AI Interaction, ahead of the lab meeting.",
    },
    {
      kind: "note",
      who: "Note",
      where: "Grounded assistants",
      time: "Yesterday",
      text: "From your Obsidian vault: citations help people calibrate trust, ready for the lab meeting.",
    },
    {
      kind: "event",
      who: "Calendar",
      where: "Thursday",
      time: "14:00",
      text: "Lab meeting in E23, moved from the usual day because of the faculty retreat.",
    },
    {
      kind: "event",
      who: "Calendar",
      where: "Saturday",
      time: "08:00",
      text: "GPU cluster maintenance until 14:00.",
    },
  ];
  const KIND_ICON = { mail: "mail", note: "note", todo: "todo", event: "cal" };
  const results = $('[data-frag="results"]');
  const q = $("#q");

  function highlight(text, terms) {
    let out = esc(text);
    for (const t of terms)
      out = out.replace(
        new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
        "<mark>$1</mark>",
      );
    return out;
  }

  function renderResults() {
    if (!results) return;
    const terms = q.value
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 1);
    if (!terms.length) {
      results.innerHTML = `<p class="res-empty">Type a word to search ${CORPUS.length} messages, mails, notes, todos and events.</p>`;
      return;
    }
    const hits = CORPUS.map((d) => {
      const hay = `${d.text} ${d.who} ${d.where}`.toLowerCase();
      const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
      return { d, score };
    }).filter((h) => h.score === terms.length);
    // SearchModal.svelte: scope chips and filters, hits grouped by kind, the first one selected.
    const count = (k) => hits.filter((h) => h.d.kind === k).length;
    const scope = (label, n, on) =>
      `<span class="scope${on ? " on" : ""}">${label}${n != null ? `<em>${n}</em>` : ""}</span>`;
    const filters = `<div class="res-filters">${scope("All", hits.length, true)}${scope("Messages", count("chat"))}${scope("Mail", count("mail"))}${scope("Events", count("event"))}${scope("Todos", count("todo"))}${scope("Notes", count("note"))}<span class="comp-fill"></span><span class="dd">All instances${icon("down", "ic ic-16")}</span><span class="dd">Any time${icon("down", "ic ic-16")}</span></div>`;
    let first = true;
    const row = ({ d }) => {
      const sel = first ? " on" : "";
      const enter = first ? `` : "";
      first = false;
      if (d.kind === "chat")
        return `<div class="res${sel}">${avatar(initials(d.who), d.c, "av av-32")}<span class="res-main"><span class="res-top"><b>${esc(d.who)}</b><span>in ${esc(d.where)}</span>${acctTag(d.acct).replace('class="tag', 'class="tag tag-sm')}<span class="comp-fill"></span><span>${esc(d.time)}</span></span><span class="res-text">${highlight(d.text, terms)}</span></span>${enter}</div>`;
      if (d.kind === "mail")
        return `<div class="res${sel}">${avatar(initials(d.who), d.c, "av av-32")}<span class="res-main"><span class="res-top"><b>${esc(d.who)}</b><span>in ${esc(d.chat ?? "Inbox")}</span><span class="comp-fill"></span><span>${esc(d.time)}</span></span><span class="res-subject">${highlight(d.where, terms)}</span><span class="res-text muted">${highlight(d.text, terms)}</span></span>${enter}</div>`;
      return `<div class="res res-item${sel}"><span class="res-tile">${icon(KIND_ICON[d.kind], "ic ic-18")}</span><span class="res-main"><span class="it-title">${highlight(d.where, terms)}</span><span class="it-meta">${highlight(d.text, terms)}</span></span>${enter}</div>`;
    };
    const group = (label, list) =>
      list.length
        ? `<p class="res-group">${label}</p>${list.slice(0, 3).map(row).join("")}`
        : "";
    const by = (f) => hits.filter(({ d }) => f(d.kind));
    results.innerHTML = hits.length
      ? `${filters}<div class="res-list">${group(
          "Messages",
          by((k) => k === "chat"),
        )}${group(
          "Mail",
          by((k) => k === "mail"),
        )}${group(
          "Calendar, todos and notes",
          by((k) => k !== "chat" && k !== "mail"),
        )}</div>`
      : `${filters}<p class="res-empty">Nothing in the sample records matches "${esc(q.value)}".</p>`;
  }

  if (q && results) {
    renderResults();
    q.addEventListener("input", renderResults);
    $$("[data-q]").forEach((b) =>
      b.addEventListener("click", () => {
        q.value = b.dataset.q;
        renderResults();
        q.focus();
      }),
    );
  }

  // --- Archive modules -----------------------------------------------------------------------

  const fill = (sel, html) => {
    const el = $(sel);
    if (el) el.innerHTML = html;
  };

  fill(
    '[data-frag="mod-linked"]',
    `
    <div class="chat-row on static">
      ${avatar("PJ", 2, "av av-l")}
      <span class="cr-main">
        <span class="cr-top"><b>${icon("link", "ic ic-s")}Prof. Jonas Brandt</b><span class="time">10:31</span></span>
        <span class="cr-mid"><span>Also: the department covers the conference dinner.</span></span>
        <span class="cr-tags">${acctTag("uni")}${acctTag("example")}</span>
      </span>
    </div>
    <p class="mod-cap">${icon("link", "ic ic-s")} Linked <b>@jbrandt</b> and <b>@jonas.brandt</b></p>`,
  );

  fill(
    '[data-frag="mod-import"]',
    `
    <p class="mod-title">${icon("upload", "ic ic-s")} Import Element chat export</p>
    <div class="imp-file">${icon("file")}<span><b>reading-group-export.zip</b><small>Old server, closed in March</small></span></div>
    <div class="imp-bar"><i></i></div>
    <p class="imp-done">${icon("check", "ic ic-s")} Imported 4,812 events. 312 attachments copied.</p>`,
  );

  fill(
    '[data-frag="mod-mail"]',
    MAILS.slice(0, 2)
      .map(
        (m) => `
    <div class="mail-row">
      ${avatar(initials(m.from), m.from === "Mira Schulz" ? 1 : 3)}
      <span class="mr-main">
        <span class="mr-top"><b>${esc(m.from)}</b><span class="time">${m.time}</span></span>
        <span class="mr-sub">${esc(m.subject)}</span>
        <span class="mr-tags">${m.reply ? `<span class="chip chip-reply">${icon("reply", "ic ic-s")}needs reply</span>` : ""}${label(m.label[0], m.label[1])}</span>
      </span>
    </div>`,
      )
      .join(""),
  );

  fill(
    '[data-frag="mod-keys"]',
    `
    <div class="key-row">${icon("key")}<span><b>Key backup</b><small>All keys backed up to the server</small></span><span class="switch on" aria-hidden="true"><i></i></span></div>
    <div class="key-row">${icon("lock")}<span><b>Weft on this laptop</b><small>Verified by cross-signing</small></span><span class="ok-chip">${icon("check", "ic ic-s")}Verified</span></div>`,
  );

  // --- From message to todo ------------------------------------------------------------------

  const flow = $('[data-frag="flow"]');
  if (flow) {
    const ask = [
      "lukas",
      "13:15",
      "@Anna Weber could you check the colours of Figure 3 before Wednesday? Then I regenerate all plots for the camera-ready.",
      { mention: true },
    ];
    flow.innerHTML = `
      <div class="fl-chat">
      <div class="fl-head">${avatar("ML", 5, "av av-s av-room")}<b>Machine Learning Lab</b>${acctTag("uni")}</div>
      <div class="fl-msgs">
        ${messageHtml(["lukas", "13:13", "Heads-up: the GPU cluster is down for maintenance on Saturday 08:00-14:00."], 0, [])}
        ${messageHtml(ask, 1, [["lukas"], ask], true, true)}
      </div>
      <div class="fl-sugg">
        <p class="fl-sh"><span class="pk-spark">${icon("spark", "ic ic-16")}</span><b>Picked up from this chat</b><em>1</em><span class="comp-fill"></span><span class="pk-fold">${icon("down", "ic ic-16")}</span></p>
        <div class="sugg">
          <span class="leaf">${icon("todo", "ic ic-22")}</span>
          <span class="s-text">
            <span class="s-line"><b>Check the colours of Figure 3</b>${label("Research", "blue").replace('class="lbl"', 'class="lbl lbl-sm"')}</span>
            <span class="s-meta"><span>${icon("cal", "ic ic-14")}Due Wed 28 Oct</span></span>
          </span>
          <span class="ai-add">${icon("plus", "ic ic-16")}Add</span><span class="ai-x">${icon("close", "ic ic-18")}</span>
        </div>
      </div>
      </div>
      <div class="fl-board">
        <div class="col">
          <p class="fl-col"><span class="c-icon">${icon("cal", "ic ic-16")}</span><b>Upcoming</b><em>7</em></p>
          <div class="col-cards">
            <p class="fl-day">Tue 27 Oct</p>
            ${todoCardHtml({ id: "f2", title: "Book train to Vienna", due: "Tue 27 Oct", label: ["Conference", "pink"] })}
            <p class="fl-day">Wed 28 Oct</p>
            ${todoCardHtml({ id: "f1", title: "Check the colours of Figure 3", due: "Wed 28 Oct", label: ["Research", "blue"], from: "Machine Learning Lab" }).replace('class="card"', 'class="card new"')}
          </div>
        </div>
      </div>`;

    const steps = $$(".step");
    const setState = (i) => {
      flow.dataset.state = String(i);
      steps.forEach((s) =>
        s.classList.toggle("on", s.dataset.step === String(i)),
      );
    };
    setState(0);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries)
            if (e.isIntersecting) setState(e.target.dataset.step);
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      steps.forEach((s) => io.observe(s));
    }
  }

  // --- Warp ----------------------------------------------------------------------------------

  const ANSWERS = {
    chi: {
      q: "Where does the CHI paper stand?",
      steps: [
        ["search", 'Searched "CHI paper deadline abstract"', "3 found"],
        ["cal", "Looked in the calendar", "1 found"],
        ["todo", "Looked at your todos", "2 found"],
      ],
      answer: [
        "Here is where the CHI paper stands this week:",
        [
          "<b>The abstract is due on Friday</b> [2]. Jonas reminded everyone that the full paper follows a week later [1].",
          "The abstract is at <b>248 words</b>, so you have two to spare [3]. Priya suggests one sentence on robustness [4].",
          "<b>Results are ready:</b> Lukas's ablation runs finished for all five seeds [5].",
          "<b>Your open todos:</b> <i>Finish CHI abstract</i>, due today [6].",
        ],
      ],
      sources: [
        [
          "chat",
          "Machine Learning Lab",
          "Reminder: the CHI abstract deadline is Friday…",
        ],
        ["cal", "Calendar", "CHI '27 abstract deadline, Friday"],
        [
          "chat",
          "CHI '27 Paper - Writing",
          "Abstract is at 248 words, we have 2 to spare.",
        ],
        [
          "chat",
          "CHI '27 Paper - Writing",
          "Yes, I'd add one sentence on robustness.",
        ],
        [
          "chat",
          "Machine Learning Lab",
          "Ablation runs finished overnight. All 5 seeds…",
        ],
        ["todo", "Todos", "Finish CHI abstract, due today"],
      ],
    },
    meet: {
      q: "When is the lab meeting this week?",
      steps: [
        ["search", 'Searched "lab meeting room"', "2 found"],
        ["cal", "Looked in the calendar", "1 found"],
      ],
      answer: [
        "The lab meeting is on <b>Thursday at 14:00 in E23</b> [1]. It moved from the usual day because half of the lab is at the faculty retreat [1].",
        [
          "Lea booked E23 for all meetings this week, since the usual room is taken by the exam committee [2].",
          "Lukas's birthday is the same day, and Sofia is bringing cake [3].",
        ],
      ],
      sources: [
        [
          "chat",
          "Machine Learning Lab",
          "Lab meeting moves to Thursday 14:00 in E23…",
        ],
        [
          "chat",
          "Machine Learning Lab",
          "I booked room E23 for our meetings this week…",
        ],
        ["chat", "Machine Learning Lab", "I'll do it!"],
      ],
    },
    sem: {
      q: "What did I miss in the seminar?",
      steps: [
        [
          "chat",
          "Read 6 unread messages in Seminar: Human-AI Interaction",
          "6 read",
        ],
      ],
      answer: [
        "Six new messages since this morning. Two need you:",
        [
          "<b>Hannah asks</b> whether the embedded video in her group's slides plays [1]. Jana's group has the same question about a GIF [2].",
          "Jana's group picked the paper on explanation styles for AI decisions and asks whether it is still free [3].",
          "Max asked for the summary template; Felix pointed him to the Materials folder, so that one is answered [4].",
        ],
      ],
      sources: [
        [
          "chat",
          "Seminar: Human-AI Interaction",
          "@Anna Weber we uploaded our slides…",
        ],
        [
          "chat",
          "Seminar: Human-AI Interaction",
          "Same question for us, the demo is a GIF.",
        ],
        [
          "chat",
          "Seminar: Human-AI Interaction",
          "Our group chose the paper on explanation styles…",
        ],
        [
          "chat",
          "Seminar: Human-AI Interaction",
          "I think it's in the Materials folder…",
        ],
      ],
    },
  };

  const warp = $('[data-frag="warp"]');
  let warpRun = 0;
  const cite = (html) =>
    html.replace(/\[(\d)\]/g, `<span class="cite">$1</span>`);

  function renderWarp(key, animate) {
    if (!warp) return;
    const a = ANSWERS[key];
    const run = ++warpRun;
    const [intro, points] = a.answer;
    warp.innerHTML = `
      <p class="wp-q"><span>${esc(a.q)}</span></p>
      <div class="wp-head">${logo("warp", 22)}<b>Warp</b></div>
      <div class="wp-steps">${a.steps.map(([ic, t, n]) => `<p class="wp-step">${icon(ic, "ic ic-16")}<span>${esc(t)}</span><em>${n}${icon("down", "ic ic-12")}</em></p>`).join("")}</div>
      <div class="wp-answer">
        <p class="wp-p">${cite(intro)}</p>
        <ul>${points.map((p) => `<li class="wp-p">${cite(p)}</li>`).join("")}</ul>
      </div>
      <details class="wp-src"><summary>Sources <em>${a.sources.length}</em><span class="wp-model">gemma4:e4b, on this computer</span>${icon("copy", "ic ic-14 ic-mute")}</summary>
        ${a.sources.map(([ic, where, text], i) => `<p class="wp-s"><span class="cite">${i + 1}</span>${icon(ic, "ic ic-s")}<b>${esc(where)}</b><span>${esc(text)}</span></p>`).join("")}
      </details>
      <div class="wp-comp"><span>Ask a follow-up…</span><span class="wp-send">${icon("send", "ic ic-16")}</span></div>`;
    if (!animate || reduced) return;
    const parts = [...$$(".wp-step", warp), ...$$(".wp-p", warp)];
    parts.forEach((p) => p.classList.add("wait"));
    parts.forEach((p, i) =>
      setTimeout(
        () => {
          if (run === warpRun) p.classList.remove("wait");
        },
        260 + i * (i < a.steps.length ? 380 : 240),
      ),
    );
  }

  if (warp) {
    renderWarp("chi", false);
    $$("[data-ask]").forEach((b) =>
      b.addEventListener("click", () => {
        $$("[data-ask]").forEach((x) =>
          x.setAttribute("aria-pressed", String(x === b)),
        );
        renderWarp(b.dataset.ask, true);
      }),
    );
  }

  // --- Appearance settings -------------------------------------------------------------------

  const settings = $('[data-frag="settings"]');
  const seg = (name, options, value) =>
    `<div class="seg-ui" role="radiogroup" aria-label="${name}">${options.map(([v, l]) => `<button type="button" role="radio" aria-checked="${v === value}" data-set="${name}" data-val="${v}">${l}</button>`).join("")}</div>`;

  // MiniWindow.svelte: a tiny drawing of the app in one variant; `right` over the right half (System).
  const miniWin = (v, half = false) =>
    `<span class="mw${half ? " half" : ""}" style="--mw-app:${v.app};--mw-panel:${v.panel};--mw-sunk:${v.sunk};--mw-line:${v.line};--mw-text:${v.text};--mw-faint:${v.faint};--mw-accent:${v.accent}"><span class="mw-side"><i style="width:70%"></i><i style="width:52%"></i><i style="width:62%"></i></span><span class="mw-main"><span class="mw-top"><span class="mw-lines"><b></b><i style="width:78%"></i><i style="width:56%"></i></span><span class="mw-card"><i></i><i></i><i></i></span></span><span class="mw-comp"><i></i><b></b></span></span></span>`;

  // ThemeSwatch.svelte: two warp threads (accent and text) twist round a straight weft (muted).
  function helix(v) {
    const W = 76, H = 62, MID = H / 2, AMP = 9, TWIST = 36, HALF = TWIST / 2, LEN = TWIST * 2, GAP = 1.5, RUNG = 4;
    const X0 = W / 2 - LEN / 2;
    const amp = (x) => AMP * Math.sin((Math.PI * (x - X0)) / LEN);
    const y = (x, sign) => MID + sign * amp(x) * Math.sin((2 * Math.PI * (x - X0)) / TWIST);
    const path = (x0, x1, sign) => {
      const pts = [];
      for (let x = x0; x <= x1 + 0.001; x += 1) pts.push(`${x.toFixed(1)},${y(x, sign).toFixed(2)}`);
      return `M${pts.join("L")}`;
    };
    const halves = [...Array(LEN / HALF).keys()].map((k) => {
      const x0 = X0 + k * HALF;
      const rungs = [];
      for (let x = x0 + RUNG / 2; x < x0 + HALF; x += RUNG)
        if (Math.abs(y(x, 1) - y(x, -1)) > 4) rungs.push(x);
      return { x0, x1: x0 + HALF, front: k % 2 === 0 ? 1 : -1, rungs };
    });
    const strand = { 1: v.accent, [-1]: v.text };
    const faint = (c, t) => mix(c, v.panel, t);
    const part = (d, cls, stroke, extra = "") => `<path d="${d}" class="${cls}" stroke="${stroke}"${extra}/>`;
    return `<svg class="helix" viewBox="0 0 ${W} ${H}" aria-hidden="true" style="background:${v.panel}"><g transform="rotate(-30 ${W / 2} ${MID})">${halves
      .map((h) => part(path(h.x0, h.x1, -h.front), "t back", faint(strand[-h.front], 0.55)))
      .join("")}${halves
      .flatMap((h) =>
        h.rungs.map(
          (x) =>
            `<line x1="${x}" x2="${x}" y1="${y(x, 1)}" y2="${MID}" class="rung" stroke="${faint(strand[1], 0.5)}"/><line x1="${x}" x2="${x}" y1="${MID}" y2="${y(x, -1)}" class="rung" stroke="${faint(strand[-1], 0.5)}"/>`,
        ),
      )
      .join("")}<line x1="${X0}" x2="${X0 + LEN}" y1="${MID}" y2="${MID}" class="cut" stroke="${v.panel}" stroke-width="${2 + GAP * 2}"/><line x1="${X0}" x2="${X0 + LEN}" y1="${MID}" y2="${MID}" class="weft" stroke="${v.muted}"/>${halves
      .map(
        (h) =>
          part(path(h.x0, h.x1, h.front), "t cut", v.panel, ` stroke-width="${3 + GAP * 2}"`) +
          part(path(h.x0, h.x1, h.front), "t", strand[h.front]),
      )
      .join("")}</g></svg>`;
  }

  // The message styles as small drawings (rows, bubbles, bubbles with yours on the right).
  const styleDraw = (kind) =>
    `<span class="sd sd-${kind}">${[
      ["user-1", "76%"],
      ["user-2", "62%"],
      ["user-0", "68%"],
    ]
      .map(
        ([c, w], i) =>
          `<span class="sd-row${i === 2 ? " mine" : ""}"><i class="sd-av" style="--c:var(--${c})"></i><span class="sd-body"><i style="--c:var(--${c});width:34%"></i><i style="width:${w}"></i></span></span>`,
      )
      .join("")}</span>`;

  // Two rows of themes, the last place a way to the rest. A saved theme further down opens them all.
  const SHORT_THEMES = ["weft", "midnight", "nord", "dracula", "catppuccin", "solarized", "gruvbox"];
  let allThemes = !SHORT_THEMES.includes(look.theme);

  function renderSettings() {
    if (!settings) return;
    const family = familyOf(look.theme);
    const scheme = schemeNow();
    const withAccent = (v) => (look.accent ? { ...v, accent: look.accent } : v);
    const current = (sc) => withAccent(family[sc]);
    const options = accentOptions(family[scheme]);
    settings.innerHTML = `
      <p class="st-title">Appearance</p>
      <div class="st-block" data-part="scheme">
        <p class="st-h">Color scheme</p>
        <div class="modes" role="radiogroup" aria-label="Color scheme">${[
          ["system", "System"],
          ["light", "Light"],
          ["dark", "Dark"],
        ]
          .map(
            ([m, l]) =>
              `<button type="button" role="radio" aria-checked="${look.mode === m}" data-set="mode" data-val="${m}" class="mode"><span class="mode-win">${m === "system" ? miniWin(current("light")) + miniWin(current("dark"), true) : miniWin(current(m))}</span><span class="mode-name">${l}</span></button>`,
          )
          .join("")}</div>
      </div>
      <div class="st-block" data-part="theme">
        <p class="st-h st-h-row">Themes<span class="st-acts"><span class="bar-chip">${icon("palette", "ic ic-14")}Create theme</span><span class="bar-chip">${icon("import", "ic ic-14")}Import</span></span></p>
        <div class="themes" role="radiogroup" aria-label="Theme">${FAMILIES.filter((f) => allThemes || SHORT_THEMES.includes(f.id)).map((f) => {
          const sel = f.id === look.theme;
          const sw = (sc) =>
            `<button type="button" class="swatch${sel && scheme === sc ? " on" : ""}" data-theme="${f.id}" data-mode="${sc}" aria-label="${esc(f.name)}, ${sc}" title="${esc(f.name)}, ${sc}">${helix(f[sc])}</button>`;
          return `<div class="tcard${sel ? " sel" : ""}"><span class="swatches">${sw("light")}${sw("dark")}</span><button type="button" role="radio" aria-checked="${sel}" data-set="theme" data-val="${f.id}" class="tname">${esc(f.name)}</button></div>`;
        }).join("")}${allThemes ? "" : `<button type="button" class="tmore" data-more-themes aria-label="Show ${FAMILIES.length - SHORT_THEMES.length} more themes">and more</button>`}</div>
      </div>
      <div class="st-block st-card" data-part="accent">
        <p class="st-h">Accent colour</p>
        <div class="accents" role="radiogroup" aria-label="Accent colour">${options
          .map((c, i) => {
            const on = i === 0 ? !look.accent : look.accent?.toLowerCase() === c;
            return `<button type="button" role="radio" aria-checked="${on}" aria-label="${i === 0 ? "Theme default" : `Accent ${c}`}" title="${i === 0 ? "Theme default" : c.toUpperCase()}" data-set="accent" data-val="${i === 0 ? "" : c}" class="acc" style="--a:${c}"></button>`;
          })
          .join("")}</div>
      </div>
      <div class="st-block" data-part="style">
        <p class="st-h">Message style</p>
        <div class="styles" role="radiogroup" aria-label="Message style">${[
          ["flat", "Flat"],
          ["bubbles", "Bubbles"],
          ["split", "Split"],
        ]
          .map(
            ([k, l]) =>
              `<button type="button" role="radio" aria-checked="${look.layout === k}" data-set="layout" data-val="${k}" class="mode">${styleDraw(k)}<span class="mode-name">${l}</span></button>`,
          )
          .join("")}</div>
      </div>
      <div class="st-block st-card" data-part="density">
        <p class="st-h">Density</p>
        ${seg(
          "density",
          [
            ["compact", "Compact"],
            ["comfortable", "Comfortable"],
            ["spacious", "Spacious"],
          ],
          look.density,
        )}
        <p class="st-h st-h2">Corners</p>
        <div class="st-slider"><span class="st-val">${look.radius}px</span><input type="range" min="0" max="20" step="1" value="${look.radius}" data-set="radius" aria-label="Corners" /></div>
      </div>
      <span class="st-reset" role="button" tabindex="0" data-reset>Reset appearance</span>`;
  }

  if (settings) {
    renderSettings();
    settings.addEventListener("click", (e) => {
      if (e.target.closest("[data-reset]")) {
        Object.assign(look, DEFAULT_LOOK);
        applyLook();
        renderSettings();
        placeNotes();
        return;
      }
      if (e.target.closest("[data-more-themes]")) {
        allThemes = true;
        renderSettings();
        placeNotes();
        $(`button[data-set="theme"][aria-checked="true"]`, settings)?.focus();
        return;
      }
      const sw = e.target.closest("button[data-theme]");
      if (sw) {
        if (look.theme !== sw.dataset.theme) look.accent = null;
        look.theme = sw.dataset.theme;
        look.mode = sw.dataset.mode;
        applyLook();
        renderSettings();
        placeNotes();
        return;
      }
      const b = e.target.closest("button[data-set]");
      if (!b) return;
      const k = b.dataset.set;
      look[k] = k === "accent" ? b.dataset.val || null : b.dataset.val;
      if (k === "theme") look.accent = null;
      applyLook();
      renderSettings();
      placeNotes();
      $(`button[data-set="${k}"][aria-checked="true"]`, settings)?.focus();
    });
    settings.addEventListener("keydown", (e) => {
      if (
        e.target.matches("[data-reset]") &&
        (e.key === "Enter" || e.key === " ")
      ) {
        e.preventDefault();
        e.target.click();
      }
    });
    settings.addEventListener("input", (e) => {
      if (!e.target.matches('input[data-set="radius"]')) return;
      look.radius = Number(e.target.value);
      applyLook();
      const out = $(".st-val", settings);
      if (out) out.textContent = `${look.radius}px`;
    });
  }

  // "System" follows the computer while the page is open.
  systemDark.addEventListener("change", () => {
    if (look.mode !== "system") return;
    applyLook();
    renderSettings();
  });

  // Notes in the margins sit level with the part of the panel they describe.
  const plate = $(".plate");
  function placeNotes() {
    if (!plate || !settings) return;
    const wide = matchMedia("(min-width: 1100px)").matches;
    plate.classList.toggle("placed", wide);
    for (const col of $$(".notes", plate)) {
      let floor = 0; // a note never starts above the end of the one before it
      for (const note of $$(".note", col)) {
        const part = $(`[data-part="${note.dataset.for}"]`, settings);
        if (!wide || !part) {
          note.style.top = "";
          continue;
        }
        const top = Math.max(
          settings.offsetTop +
            part.getBoundingClientRect().top -
            settings.getBoundingClientRect().top,
          floor,
        );
        note.style.top = `${top}px`;
        floor = top + note.offsetHeight + 20;
      }
    }
  }
  if (plate) {
    placeNotes();
    addEventListener("resize", placeNotes);
    document.fonts?.ready.then(placeNotes);
    for (const note of $$(".note", plate)) {
      const on = () => {
        settings.dataset.focus = note.dataset.for;
      };
      const off = () => {
        delete settings.dataset.focus;
      };
      note.tabIndex = 0;
      note.addEventListener("mouseenter", on);
      note.addEventListener("focus", on);
      note.addEventListener("mouseleave", off);
      note.addEventListener("blur", off);
    }
  }

  // --- Plugins -------------------------------------------------------------------------------

  // PluginSettings.svelte and ObsidianSettings.svelte, with what each setting brings beside them.
  const PLUGINS = {
    gitlab: {
      name: "GitLab",
      intro: "Your GitLab issues and merge requests as todos next to your own: what is assigned to you, what you review, where you are mentioned. Warp can look them up.",
      head: "Connections",
      row: ["Lab GitLab", "Signed in as aweber. 3 items, fetched 13:41."],
      fields: [
        ["todos", "To-do list (mentions, review requests, failed pipelines)", true],
        ["issues", "Issues assigned to me", true],
        ["reviews", "Merge requests I review", true],
        ["authored", "My open merge requests", false],
      ],
      hint: "Tokens are kept encrypted on this device and are never synced.",
      actions: ["Add another connection", "Fetch now"],
    },
    moodle: {
      name: "Moodle",
      intro: "Your Moodle courses next to your chats: assignments still due as todos, deadlines and course events in the calendar, Moodle messages as chats. Warp can look them up, and it reads your Moodle notifications.",
      head: "Connections",
      row: ["University Moodle", "Signed in as aweber. 2 items, fetched 13:38."],
      fields: [
        ["assignments", "Assignments still due as todos", true],
        ["activities", "Quizzes, forums and other activities to do as todos", false],
        ["calendar", "Deadlines and course events in the calendar", true],
        ["messages", "Messages as chats", true],
        ["notifications", "Notifications for Warp", true],
      ],
      hint: "Sign in with a security key, which works with single sign-on, or your password. If your Moodle gives out no key, a calendar link brings deadlines and events.",
      actions: ["Add another connection", "Fetch now"],
    },
    obsidian: {
      name: "Obsidian",
      intro: "A vault's notes show up as a folder of your notes and stay in sync with Obsidian.",
      head: "Vaults",
      row: ["Reading vault", "214 notes, synced 13:44"],
      vault: true,
      fields: [],
      hint: "The vault stays on this device and is not synced. Connect it on each device that has a copy, for example through Obsidian Sync or a cloud drive.",
      actions: ["Connect another vault", "Sync now"],
    },
  };
  const plug = {
    open: "gitlab",
    on: Object.fromEntries(
      Object.values(PLUGINS).flatMap((p) => p.fields.map(([k, , v]) => [k, v])),
    ),
    done: new Set(),
  };

  const plugCard = (id, title, chips, link) =>
    plug.done.has(id)
      ? ""
      : `<div class="card linked"><span class="ctx-logo">${serviceLogo(link.plugin)}</span><span class="ctx-main"><span class="proj" style="--p:var(--label-${link.hue})">${esc(link.project)}</span><span class="ctx-ref">${esc(link.ref)}</span><span class="comp-fill"></span><span class="ctx-why" title="${esc(link.why)}">${icon(link.icon, "ic ic-14")}</span></span><button type="button" class="circle" data-plug-done="${id}" aria-label="Done">${icon("check", "ic ic-12")}</button><span class="sg-main"><span class="sg-top"><b>${esc(title)}</b></span><span class="sg-meta">${chips}</span></span></div>`;
  const dueChip = (t) => `<span class="due">${icon("clock", "ic")}${t}</span>`;
  const shelf = (ic, title, body) =>
    body ? `<div class="pl-shelf"><p class="pl-h">${icon(ic, "ic ic-14")}${title}</p>${body}</div>` : "";

  // What a connection brings, in the look it has where it lands.
  function pluginBrings(id) {
    const on = plug.on;
    if (id === "gitlab") {
      const gl = (project, hue, ref, ic, why) => ({ plugin: "gitlab", project, hue, ref, icon: ic, why });
      const cards = [
        on.reviews ? plugCard("g1", "Improve keyboard navigation in the study dashboard", label("Research", "blue").replace('class="lbl"', 'class="lbl lbl-sm"'), gl("Study dashboard", "red", "!42", "eye", "Review requested, by Sofia Romano")) : "",
        on.todos ? plugCard("g2", "Pipeline failed on the evaluation branch", dueChip("Today"), gl("Eval scripts", "teal", "#118", "info", "Pipeline failed")) : "",
        on.issues ? plugCard("g3", "Export the session list as CSV", dueChip("Fri 30 Oct"), gl("Study dashboard", "red", "#97", "user", "Assigned to you, by Lukas Hoffmann")) : "",
        on.authored ? plugCard("g4", "Add a plain-text mode to the note exporter", "", gl("Lab tools", "purple", "!7", "edit", "Opened by you")) : "",
      ].join("");
      return shelf("todo", "On your todo board", cards) + `<p class="pl-foot">${icon("check", "ic ic-14")}With the api scope, ticking one off clears its GitLab to-dos, and you can close it from Weft.</p>`;
    }
    if (id === "moodle") {
      const ml = (project, hue, ref, ic, why) => ({ plugin: "moodle", project, hue, ref, icon: ic, why });
      const cards = [
        on.assignments ? plugCard("m1", "Grade exercise sheet 5", dueChip("Mon 26 Oct"), ml("Human-AI Interaction", "purple", "Assignment", "cal", "Assignment due Mon 26 Oct")) : "",
        on.activities ? plugCard("m2", "Weekly reading quiz", dueChip("Wed 28 Oct"), ml("Human-AI Interaction", "purple", "Quiz", "cal", "Quiz closes Wed 28 Oct")) : "",
      ].join("");
      const cal = on.calendar
        ? `<div class="pl-cal"><span class="ev-chip" style="--l:var(--label-orange)"><b>HCI lecture</b><small>15:00-16:30, H1</small></span><span class="ev-chip moment" style="--l:var(--label-orange)"><b>Sheet 5 due</b><small>12:00</small></span></div>`
        : "";
      const chat = on.messages
        ? `<div class="chat-row static pl-chat">${avatar("HT", 3, "av av-32 av-room")}<span class="cr-main"><span class="cr-top"><span class="cr-name"><span>HCI tutors</span></span><span class="time">12:30</span></span><span class="cr-mid"><span class="cr-prev">Elena: Sheet 5 is graded, the marks are in Moodle.</span></span><span class="cr-tags">${acctTag("aweber")}<span class="tag-logo">${serviceLogo("moodle")}</span></span></span></div>`
        : "";
      const notices = on.notifications
        ? `<p class="pl-warp">${logo("warp", 18)}<span>"Your submission for sheet 4 has been graded."</span></p>`
        : "";
      return (
        shelf("todo", "On your todo board", cards) +
        shelf("cal", "In your calendar", cal) +
        shelf("chat", "In your chats", chat) +
        shelf("spark", "Only Warp reads these", notices)
      );
    }
    return (
      shelf("note", "In your notes", `<div class="pl-tree"><span class="frow on-open"><span class="chev open">${icon("right", "ic ic-14")}</span>${icon("vault", "ic ic-16")}<span class="fname">Reading vault</span><span class="fcount">214</span></span><span class="frow nrow" style="padding-left:30px">${icon("note", "ic ic-16")}<span class="fname">Grounded assistants</span></span><span class="frow nrow" style="padding-left:30px">${icon("note", "ic ic-16")}<span class="fname">Trust in AI tools</span></span></div>`) +
      shelf("edit", "Reads Obsidian's syntax", `<div class="pl-note"><p>Citations help people calibrate trust, see <span class="wiki">[[Trust in AI tools]]</span>.</p><p><span class="wiki">#reading</span> <span class="wiki">#teaching</span></p></div>`) +
      `<p class="pl-foot">${icon("sync", "ic ic-14")}Edits go both ways. When a note changed on both sides, the other text is kept as a copy.</p>`
    );
  }

  const plugEl = $('[data-frag="plugins"]');
  function renderPlugins() {
    if (!plugEl) return;
    const p = PLUGINS[plug.open];
    const nav = (ic, name, cls = "") =>
      `<span class="set-nav${cls}">${icon(ic, "ic ic-16")}${name}</span>`;
    plugEl.innerHTML = `
      <aside class="set-side">
        <p class="set-title">Settings</p>
        ${nav("gear", "General")}
        <p class="set-h">Accounts</p>
        <span class="set-nav">${avatar("AW", 2, "av av-18")}uni.example</span>
        ${nav("mail", "Email")}
        <p class="set-h">Plugins</p>
        ${Object.entries(PLUGINS)
          .map(
            ([id, x]) =>
              `<button type="button" class="set-nav${id === plug.open ? " on" : ""}" data-plugin="${id}" aria-pressed="${id === plug.open}">${serviceLogo(id, 20)}${x.name}</button>`,
          )
          .join("")}
        <p class="set-h">App</p>
        ${nav("palette", "Appearance")}
        ${nav("bell", "Notifications")}
      </aside>
      <div class="set-page">
        <header class="set-head"><div class="set-name">${serviceLogo(plug.open, 32)}<h3>${p.name}</h3></div><p>${esc(p.intro)}</p></header>
        <p class="set-sec">${p.head}</p>
        <div class="set-group"><div class="set-row">${serviceLogo(plug.open, 32)}<span class="set-text"><b>${esc(p.row[0])}</b><small>${esc(p.row[1])}</small></span><span class="set-act">${icon(p.vault ? "sync" : "edit", "ic ic-14")}${p.vault ? "Sync now" : "Edit"}</span></div>${p.fields
          .map(
            ([k, l]) =>
              `<div class="set-row toggle-row"><span class="set-text">${esc(l)}</span><button type="button" class="switch${plug.on[k] ? " on" : ""}" data-plug-toggle="${k}" role="switch" aria-checked="${plug.on[k]}" aria-label="${esc(l)}"><i></i></button></div>`,
          )
          .join("")}</div>
        <div class="set-actions"><span class="set-act">${icon("plus", "ic ic-14")}${p.actions[0]}</span>${p.vault ? "" : `<span class="set-act">${icon("sync", "ic ic-14")}${p.actions[1]}</span>`}</div>
        <p class="set-hint">${esc(p.hint)}</p>
      </div>
      <div class="set-brings" aria-live="polite"><p class="set-sec">What it brings</p>${pluginBrings(plug.open)}</div>`;
  }
  if (plugEl) {
    renderPlugins();
    const tabs = $$("[data-plugin-tab]");
    const open = (id) => {
      plug.open = id;
      tabs.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.pluginTab === id)));
      renderPlugins();
    };
    tabs.forEach((b) => b.addEventListener("click", () => open(b.dataset.pluginTab)));
    plugEl.addEventListener("click", (e) => {
      let x;
      if ((x = e.target.closest("[data-plugin]"))) return open(x.dataset.plugin);
      if ((x = e.target.closest("[data-plug-toggle]"))) {
        const k = x.dataset.plugToggle;
        plug.on[k] = !plug.on[k];
        renderPlugins();
        $(`[data-plug-toggle="${k}"]`, plugEl)?.focus();
        return;
      }
      if ((x = e.target.closest("[data-plug-done]"))) {
        plug.done.add(x.dataset.plugDone);
        renderPlugins();
      }
    });
  }

  // --- Local by design -----------------------------------------------------------------------

  fill(
    '[data-frag="local"]',
    `
    <p class="st-title">Data and connections</p>
    <p class="st-sub">Everything Weft keeps, and everyone it talks to.</p>
    <div class="lc-block">
      <p class="st-h">Records</p>
      <div class="lc-row">${icon("folder")}<span><b>weft.db</b><small>48,301 events, 2 accounts, 1 mailbox</small></span><span class="lc-v">1.2 GB</span></div>
      <div class="lc-row">${icon("file")}<span><b>media</b><small>Files, images and voice messages</small></span><span class="lc-v">3.4 GB</span></div>
    </div>
    <div class="lc-block">
      <p class="st-h">Connections</p>
      <div class="lc-row">${icon("server")}<span><b>matrix.uni.example</b><small>Matrix, @anna:uni.example</small></span><span class="lc-ok">${icon("check", "ic ic-s")}Synced</span></div>
      <div class="lc-row">${icon("server")}<span><b>matrix.example.org</b><small>Matrix, @anna.weber:example.org</small></span><span class="lc-ok">${icon("check", "ic ic-s")}Synced</span></div>
      <div class="lc-row">${icon("mail")}<span><b>imap.uni.example</b><small>Mail, anna.weber@uni.example</small></span><span class="lc-ok">${icon("check", "ic ic-s")}Synced</span></div>
      <div class="lc-row">${serviceLogo("gitlab", 18)}<span><b>gitlab.lab.example</b><small>Plugin, your token stays on this device</small></span><span class="lc-ok">${icon("check", "ic ic-s")}Synced</span></div>
      <div class="lc-row">${icon("chip")}<span><b>localhost:11434</b><small>Inference server, 3 models installed</small></span><span class="lc-ok">${icon("check", "ic ic-s")}Ready</span></div>
    </div>`,
  );

  // --- Download dialog -----------------------------------------------------------------------

  const dialog = $(".dialog");
  if (dialog) {
    const NOTES = {
      windows:
        "Windows 10 and 11, 64-bit. The installer needs no administrator rights.",
      "mac-arm":
        "macOS on Apple silicon (M1 and later). Drag Weft to Applications.",
      "mac-intel": "macOS on Intel. Drag Weft to Applications.",
      "linux-appimage":
        "Linux, 64-bit, Ubuntu 22.04 or newer. Make the file executable and start it.",
      "linux-deb":
        "Debian and Ubuntu, 64-bit. Install the next .deb to update it.",
    };
    const LABEL = {
      windows: "Download for Windows",
      "mac-arm": "Download for Mac",
      "mac-intel": "Download for Mac (Intel)",
      "linux-appimage": "Download AppImage",
      "linux-deb": "Download .deb",
    };
    // The system picked, and the variant last picked for the systems that have more than one.
    let os = "windows";
    const pick = { mac: "mac-arm", linux: "linux-appimage" };
    const update = () => {
      const key = pick[os] ?? os;
      $$("[data-os]", dialog).forEach((b) =>
        b.setAttribute("aria-checked", String(b.dataset.os === os)),
      );
      $$("[data-mac], [data-linux]", dialog).forEach((b) =>
        b.setAttribute(
          "aria-checked",
          String((b.dataset.mac ?? b.dataset.linux) === key),
        ),
      );
      $$("[data-sub]", dialog).forEach((s) => (s.hidden = s.dataset.sub !== os));
      $("[data-os-note]", dialog).textContent = NOTES[key];
      const btn = $("[data-dl]", dialog);
      btn.textContent = LABEL[key];
      btn.dataset.asset = key;
      document.dispatchEvent(new CustomEvent("weft:asset"));
    };
    dialog.addEventListener("click", (e) => {
      const b = e.target.closest("[data-os], [data-mac], [data-linux]");
      if (!b) return;
      if (b.dataset.os) os = b.dataset.os;
      if (b.dataset.mac) pick.mac = b.dataset.mac;
      if (b.dataset.linux) pick.linux = b.dataset.linux;
      update();
    });
    window.weftSetPlatform = (p) => {
      if (!p) return;
      os = p.split("-")[0];
      if (os in pick) pick[os] = p;
      update();
    };
    update();
  }
})();
