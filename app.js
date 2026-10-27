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

  const users = (c) => Object.fromEntries(c.map((v, i) => [`user-${i}`, v]));
  const LABEL_NAMES = [
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "purple",
    "pink",
    "brown",
    "gray",
  ];
  const labels = (c) =>
    Object.fromEntries(c.map((v, i) => [`label-${LABEL_NAMES[i]}`, v]));
  const LIGHT_SHADOW =
    "0 1px 2px rgb(20 20 30 / 0.06), 0 0 0 1px rgb(20 20 30 / 0.05)";
  const DARK_SHADOW =
    "0 1px 2px rgb(0 0 0 / 0.4), 0 0 0 1px rgb(255 255 255 / 0.05)";

  const PRESETS = [
    {
      id: "light",
      name: "Light",
      scheme: "light",
      vars: {
        app: "#eef1f5",
        panel: "#ffffff",
        sunk: "#f6f8fa",
        hover: "#eef1f5",
        active: "#e8ecf2",
        line: "#e3e7ed",
        line2: "#d2d8e1",
        text: "#131a25",
        muted: "#526071",
        faint: "#7a8597",
        accent: "#3b5bdb",
        "on-accent": "#ffffff",
        ok: "#1d7a4a",
        warn: "#b26b00",
        danger: "#c93838",
        shadow: LIGHT_SHADOW,
        ...users([
          "#3b5bdb",
          "#c2365a",
          "#1b7646",
          "#a9530e",
          "#6d45c4",
          "#0e7480",
          "#9030ad",
          "#5f8f12",
        ]),
        ...labels([
          "#d93a3f",
          "#e0670f",
          "#c79200",
          "#2b8f57",
          "#0f8f82",
          "#3b5bdb",
          "#7e45c4",
          "#c73a8f",
          "#94693f",
          "#76808c",
        ]),
      },
    },
    {
      id: "dark",
      name: "Dark",
      scheme: "dark",
      vars: {
        app: "#0e1014",
        panel: "#16191e",
        sunk: "#12151a",
        hover: "#1c2027",
        active: "#22262e",
        line: "#252a32",
        line2: "#333944",
        text: "#e7e9ee",
        muted: "#a0a7b4",
        faint: "#727a89",
        accent: "#7c9cff",
        "on-accent": "#0b0d11",
        ok: "#4fd18b",
        warn: "#f5b84a",
        danger: "#ff7070",
        shadow: DARK_SHADOW,
        ...users([
          "#7c9cff",
          "#ff8fa3",
          "#5fd08f",
          "#f0a35a",
          "#b49aff",
          "#4dd4d4",
          "#d98bf0",
          "#a3d95b",
        ]),
        ...labels([
          "#ff7070",
          "#ff9a4d",
          "#f5c84c",
          "#5fd08f",
          "#4dd4c4",
          "#7c9cff",
          "#b49aff",
          "#ff8fc8",
          "#c99a74",
          "#9aa3b0",
        ]),
      },
    },
    {
      id: "midnight",
      name: "Midnight",
      scheme: "dark",
      vars: {
        app: "#000000",
        panel: "#0b0b0e",
        sunk: "#060608",
        hover: "#141418",
        active: "#1c1c22",
        line: "#1a1a20",
        line2: "#2a2a33",
        text: "#f2f2f5",
        muted: "#a0a0ab",
        faint: "#6a6a75",
        accent: "#8b7bff",
        "on-accent": "#000000",
        ok: "#3ee08f",
        warn: "#ffc04d",
        danger: "#ff5c7a",
        shadow: DARK_SHADOW,
        ...users([
          "#8b7bff",
          "#ff7aa8",
          "#3ee08f",
          "#ff9248",
          "#e08bff",
          "#3fd8e8",
          "#c58bff",
          "#b8e64d",
        ]),
        ...labels([
          "#ff5c7a",
          "#ff9248",
          "#ffd24d",
          "#3ee08f",
          "#3fd8c8",
          "#7b8bff",
          "#c58bff",
          "#ff7ad1",
          "#d1a27a",
          "#a0a0ab",
        ]),
      },
    },
    {
      id: "nord",
      name: "Nord",
      scheme: "dark",
      vars: {
        app: "#272c36",
        panel: "#2e3440",
        sunk: "#2b303b",
        hover: "#3b4252",
        active: "#434c5e",
        line: "#3b4252",
        line2: "#4c566a",
        text: "#eceff4",
        muted: "#c0c8d6",
        faint: "#8a93a6",
        accent: "#88c0d0",
        "on-accent": "#2e3440",
        ok: "#a3be8c",
        warn: "#ebcb8b",
        danger: "#bf616a",
        shadow: DARK_SHADOW,
        ...users([
          "#81a1c1",
          "#bf616a",
          "#a3be8c",
          "#d08770",
          "#b48ead",
          "#8fbcbb",
          "#c895bf",
          "#ebcb8b",
        ]),
        ...labels([
          "#bf616a",
          "#d08770",
          "#ebcb8b",
          "#a3be8c",
          "#8fbcbb",
          "#81a1c1",
          "#b48ead",
          "#c895bf",
          "#a98a6d",
          "#8a93a6",
        ]),
      },
    },
    {
      id: "dracula",
      name: "Dracula",
      scheme: "dark",
      vars: {
        app: "#1e1f29",
        panel: "#282a36",
        sunk: "#21222c",
        hover: "#343746",
        active: "#44475a",
        line: "#343746",
        line2: "#44475a",
        text: "#f8f8f2",
        muted: "#c3c6d6",
        faint: "#7f84a3",
        accent: "#bd93f9",
        "on-accent": "#282a36",
        ok: "#50fa7b",
        warn: "#f1fa8c",
        danger: "#ff5555",
        shadow: DARK_SHADOW,
        ...users([
          "#8be9fd",
          "#ff79c6",
          "#50fa7b",
          "#ffb86c",
          "#bd93f9",
          "#66d9c7",
          "#d6a4ff",
          "#a6e22e",
        ]),
        ...labels([
          "#ff5555",
          "#ffb86c",
          "#f1fa8c",
          "#50fa7b",
          "#8be9fd",
          "#8aa4ff",
          "#bd93f9",
          "#ff79c6",
          "#cfa47c",
          "#9ea3c0",
        ]),
      },
    },
    {
      id: "mocha",
      name: "Catppuccin",
      scheme: "dark",
      vars: {
        app: "#11111b",
        panel: "#1e1e2e",
        sunk: "#181825",
        hover: "#292c3c",
        active: "#313244",
        line: "#313244",
        line2: "#45475a",
        text: "#cdd6f4",
        muted: "#a6adc8",
        faint: "#7f849c",
        accent: "#cba6f7",
        "on-accent": "#1e1e2e",
        ok: "#a6e3a1",
        warn: "#f9e2af",
        danger: "#f38ba8",
        shadow: DARK_SHADOW,
        ...users([
          "#89b4fa",
          "#f38ba8",
          "#a6e3a1",
          "#fab387",
          "#cba6f7",
          "#94e2d5",
          "#f5c2e7",
          "#b4befe",
        ]),
        ...labels([
          "#f38ba8",
          "#fab387",
          "#f9e2af",
          "#a6e3a1",
          "#94e2d5",
          "#89b4fa",
          "#cba6f7",
          "#f5c2e7",
          "#e3b99c",
          "#9399b2",
        ]),
      },
    },
    {
      id: "solarized",
      name: "Solarized",
      scheme: "light",
      vars: {
        app: "#eee8d5",
        panel: "#fdf6e3",
        sunk: "#f5eedb",
        hover: "#eee8d5",
        active: "#e6dfc8",
        line: "#e6dfc8",
        line2: "#d6cfb6",
        text: "#073642",
        muted: "#586e75",
        faint: "#93a1a1",
        accent: "#268bd2",
        "on-accent": "#fdf6e3",
        ok: "#859900",
        warn: "#b58900",
        danger: "#dc322f",
        shadow: LIGHT_SHADOW,
        ...users([
          "#268bd2",
          "#d33682",
          "#859900",
          "#cb4b16",
          "#6c71c4",
          "#2aa198",
          "#a33ea1",
          "#b58900",
        ]),
        ...labels([
          "#dc322f",
          "#cb4b16",
          "#b58900",
          "#859900",
          "#2aa198",
          "#268bd2",
          "#6c71c4",
          "#d33682",
          "#8f6e4a",
          "#839496",
        ]),
      },
    },
    {
      id: "contrast",
      name: "High contrast",
      scheme: "dark",
      vars: {
        app: "#000000",
        panel: "#000000",
        sunk: "#0a0a0a",
        hover: "#1a1a1a",
        active: "#262626",
        line: "#5c5c5c",
        line2: "#9a9a9a",
        text: "#ffffff",
        muted: "#e0e0e0",
        faint: "#bdbdbd",
        accent: "#ffd400",
        "on-accent": "#000000",
        ok: "#3dff8b",
        warn: "#ffd400",
        danger: "#ff4d4d",
        shadow: "0 0 0 1px #5c5c5c",
        ...users([
          "#5cc8ff",
          "#ff7ab6",
          "#3dff8b",
          "#ffa64d",
          "#d79bff",
          "#4dffff",
          "#ff8cff",
          "#c6ff4d",
        ]),
        ...labels([
          "#ff4d4d",
          "#ffa64d",
          "#ffd400",
          "#3dff8b",
          "#4dffff",
          "#5cc8ff",
          "#d79bff",
          "#ff8cff",
          "#e0aa70",
          "#cfcfcf",
        ]),
      },
    },
  ];
  const ACCENTS = [
    "#3b5bdb",
    "#8b7bff",
    "#c58bff",
    "#ff79c6",
    "#ff6b6b",
    "#ff9f5a",
    "#f5b84a",
    "#4fd18b",
    "#4dd4d4",
  ];
  const ACCENT_NAMES = [
    "blue",
    "iris",
    "lilac",
    "pink",
    "coral",
    "orange",
    "amber",
    "green",
    "teal",
  ];

  /** Text colour readable on top of `hex` (as in theme.ts). */
  function onColor(hex) {
    const m = hex
      .replace("#", "")
      .match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (!m) return "#000";
    const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? "#0b0d11" : "#ffffff";
  }

  // The mail badge among a chat's instance tags, tuned per preset (theme.ts `mail-tag`).
  const MAIL_TAG = {
    light: "#4f7686",
    dark: "#8fb3c2",
    midnight: "#8fbfd0",
    nord: "#8fbcbb",
    dracula: "#9fc4d4",
    mocha: "#8fbfcf",
    solarized: "#4a8a8c",
    contrast: "#7fdfff",
  };

  // Everything set under "Make it yours" restyles every fragment; theme, accent and corners are
  // remembered, message style and density start at the app's defaults on every visit.
  const DEFAULT_LOOK = {
    preset: "light",
    accent: null,
    layout: "flat",
    density: "comfortable",
    radius: 12,
  };
  const { preset, accent, radius } = store.get("weft-site-look") ?? {};
  const look = {
    ...DEFAULT_LOOK,
    ...(preset ? { preset } : {}),
    ...(accent ? { accent } : {}),
    ...(Number.isFinite(radius) ? { radius } : {}),
  };
  if (!PRESETS.some((p) => p.id === look.preset)) look.preset = "light";

  function applyLook() {
    const preset = PRESETS.find((p) => p.id === look.preset);
    const root = document.documentElement;
    const vars = { ...preset.vars };
    if (look.accent) {
      vars.accent = look.accent;
      vars["on-accent"] = onColor(look.accent);
    }
    vars["mail-tag"] = MAIL_TAG[preset.id];
    for (const [k, v] of Object.entries(vars))
      root.style.setProperty(`--${k}`, v);
    root.style.setProperty("--r", `${look.radius}px`);
    root.style.setProperty("--r2", `${Math.round(look.radius * 0.67)}px`);
    root.dataset.scheme = preset.scheme;
    root.style.setProperty("--scheme", preset.scheme);
    // Message style and density restyle every chat on the page, like the app's timeline.
    root.dataset.layout = look.layout;
    root.dataset.density = look.density;
    store.set("weft-site-look", {
      preset: look.preset,
      accent: look.accent,
      radius: look.radius,
    });
  }
  applyLook();

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
          { chip: "calendar" },
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
      unread: 1,
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
        ["jonas", "11:14", "Abstract is at 248 words, we have 2 to spare."],
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
  // rooms a circle, mail senders a squircle.
  const roomAv = (r, cls) =>
    r.mail ? `${cls} av-mail` : r.dm ? cls : `${cls} av-room`;
  const acctTag = (a) =>
    a === "mail"
      ? `<span class="tag tag-mail" title="Mail">${icon("mail", "ic ic-12")}</span>`
      : `<span class="tag tag-${a}">${a}</span>`;
  const label = (name, color) =>
    `<span class="lbl" style="--l:var(--label-${color})">${esc(name)}</span>`;

  // EventTile.svelte: name, account tag (linked chats), time, the AI's tags, the lock; continuation
  // rows show their time in the gutter on hover; read receipts sit at the bottom right.
  function messageHtml(m, i, list, lock = true) {
    const [who, time, text, x = {}] = m;
    const p = person(who);
    const mine = who === "anna";
    const prev = list[i - 1];
    const cont =
      prev && prev[0] === who && !x.quote && !x.mail && !prev[3]?.mail;
    const body = esc(text).replace(
      /@Anna Weber/,
      `<span class="mention"><span class="pill-av">A</span>Anna Weber</span>`,
    );
    const q = x.quote && person(x.quote[0]);
    const quote = x.quote
      ? `<span class="quote"><span class="q-head">${icon("reply", "ic ic-s")}${avatar(initials(q.name), q.c, "av av-14")}<b style="color:var(--user-${q.c})">${esc(q.name)}</b></span><span class="q-text">${esc(x.quote[1])}</span></span>`
      : "";
    const chip = x.chip
      ? `<span class="chip${x.chip === "needs reply" ? " chip-reply" : ""}">${x.chip === "needs reply" ? icon("reply", "ic ic-12") : "→ "}${x.chip}</span>`
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
        ${cont ? "" : `<div class="msg-head"><b class="who" data-person="${who}" style="color:var(--user-${p.c})">${esc(p.name)}</b>${tag}<span class="time">${esc(time)}</span>${chip}${lock && !x.mail ? icon("lock", "ic ic-lock") : ""}</div>`}
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
    const lbl = t.label
      ? label(...t.label).replace('class="lbl"', 'class="lbl lbl-sm"')
      : "";
    const check = sugg
      ? `<span class="circle dashed">${icon("plus", "ic ic-12")}</span>`
      : `<button type="button" class="circle${done ? " on" : ""}" data-done="${t.id}" aria-pressed="${done}" aria-label="Done">${icon("check", "ic ic-12")}</button>`;
    return `<div class="card${done ? " done" : ""}${sugg ? " sugg-card" : ""}">
      ${check}
      <span class="sg-main">
        <span class="sg-top"><b>${esc(t.title)}</b>${sugg ? `<span class="sg-acts"><button type="button" class="sm btn-ui" data-take="${t.id}">Add</button>${icon("close", "ic ic-14")}</span>` : ""}</span>
        ${done ? "" : t.quote ? `<span class="sg-q">“${esc(t.quote)}”</span>` : t.note ? `<span class="sg-note">${esc(t.note)}</span>` : ""}
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
      reply: true,
      label: ["Conference", "pink"],
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
  ];
  const ALLDAY = [
    { day: 3, title: "Faculty retreat", cal: "purple" },
    { day: 4, title: "CHI abstract deadline", cal: "blue" },
  ];
  const FOUND = [
    {
      id: "f1",
      title: "Coffee with Mira",
      when: "Sun 25 Oct, 10:00",
      from: ["example", "Mira Schulz"],
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
      id: "f2",
      title: "GPU cluster maintenance",
      when: "Sat 31 Oct, 08:00",
      from: ["uni", "Machine Learning Lab"],
    },
  ];

  const TODOS = {
    sugg: [
      {
        id: "s1",
        title: "Send camera-ready checklist to Daniel",
        quote:
          "@Anna Weber could you send the camera-ready checklist to Daniel before Friday?",
        due: "Fri 30 Oct",
        label: ["Thesis supervision", "purple"],
        from: "Machine Learning Lab",
      },
      {
        id: "s2",
        title: "Submit September travel expense report",
        quote: "Reminder: travel expense reports for September are due…",
        due: "Sat 31 Oct",
        label: ["Admin", "orange"],
        from: "CS Department",
      },
    ],
    today: [
      {
        id: "t1",
        title: "Reply to reviewers (workshop paper)",
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
        title: "Feedback on Daniel's thesis chapter 2",
        due: "Mon 26 Oct",
        label: ["Thesis supervision", "purple"],
        from: "Daniel Okafor",
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
  ];

  // Profiles: what the person page shows beyond their messages.
  const PROFILE = {
    daniel: {
      status: "Writing chapter 3",
      messages: 148,
      events: [
        ["Tue 27 Oct", "14:00", "Thesis meeting with Daniel", "Office 3.12"],
      ],
      picked: [
        [
          "Feedback on Daniel's thesis chapter 2",
          "Mon 26 Oct",
          "Thesis supervision",
          "purple",
        ],
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
        .replace(/`(.+?)`/g, "<code>$1</code>");
    const lines = src.split("\n");
    let html = "",
      i = 0,
      task = 0;
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

  // --- App windows -----------------------------------------------------------------------------

  const hhmm = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  const fmtH = (h) =>
    `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
  // Catch-up summaries: [headline, sentence, room, times of the messages each point cites].
  const AWAY = [
    [
      "Jonas is waiting on you.",
      "He asked about the reviewer responses from the workshop paper and wants the camera-ready checklist sent to Daniel before Friday.",
      "lab",
      ["13:09", "12:21"],
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
        "Jonas asks you to send Daniel the camera-ready checklist before Friday, and whether you have read the reviewer responses from the workshop paper.",
        ["12:21", "13:09"],
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
        "Mira booked the hotel and suggests dinner with Tom near the Naschmarkt on the first evening.",
        ["08:30", "13:11"],
      ],
    ],
  };
  const cites = (times) =>
    times.map((t) => `<span class="cite-t">${t}</span>`).join("");

  const COVERS = {
    timeline: "Show timeline",
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
      note: "n1",
      noteMode: "preview",
      sent: {},
      read: new Set([room]),
      readMail: new Set(["m6"]),
      last: {},
      notes: Object.fromEntries(NOTES.map((n) => [n.id, n.body])),
      catchup,
      awayDismissed: false,
      gpuAdded: false,
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
        <div class="rail-top">${logo("weft", 30)}<span class="wordmark">Weft</span>${eye}<button type="button" class="rail-eye${s.view === "timeline" ? " is-on" : ""}" data-view="timeline" aria-pressed="${s.view === "timeline"}" title="Timeline">${icon("bell")}</button></div>
        <span class="rail-search">${icon("search")}<span>Search everything</span><kbd>Ctrl K</kbd></span>
        <p class="rail-h">Workspace</p>
        <div class="rail-items">${item("chats", "chat", "Chats", 19)}${item("inbox", "mail", "Inbox", unreadMail)}${item("calendar", "cal", "Calendar", 1)}${item("todos", "todo", "Todos", openTodos)}${item("notes", "note", "Notes")}</div>
        <p class="rail-h folders"><span class="grow">Folders</span>${icon("plus", "ic ic-16")}</p>
        <div class="rail-items rail-folders">${folder("school", "teal", "Teaching", 6)}${folder("box", "amber", "Admin")}</div>
        <span class="rail-warp"><span class="aurora"></span>${logo("warp", 22)}<span class="wordmark">Warp</span></span>
        <span class="rail-item">${icon("gear", "ic ic-20")}<span>Settings</span></span>
        <span class="rail-me"><span class="av-wrap">${avatar("AW", 0, "av av-32")}<i class="online"></i></span><span class="me-text"><b>Anna Weber</b><small>Online</small></span><span class="rail-eye">${icon("panel")}</span></span>
      </aside>`;
    }

    // Chats
    function chatsView() {
      const row = (r) => {
        const unread = !s.read.has(r.id) && r.unread;
        const badge = unread
          ? `<em class="${r.reply ? "badge" : "badge badge-q"}">${r.reply ? icon("reply", "ic ic-16") : ""}${r.unread}</em>`
          : "";
        const tags = r.acct.map(acctTag).join("");
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
      // SuggestionTray.svelte: what the assistant picked up, folded above the composer.
      const picked =
        r.id === "lab"
          ? `<div class="picked"><span class="pk-spark">${icon("spark", "ic ic-16")}</span><b>Picked up from this chat</b><em>3</em><span class="comp-fill"></span><span class="picked-add">Add all</span><span class="pk-fold">${icon("up", "ic ic-16")}</span></div>`
          : "";
      const hb = (ic, label, n) =>
        `<span class="hb" title="${label}">${icon(ic, ic === "video" ? "ic ic-22" : "ic ic-20")}${n ? `<em>${n}</em>` : ""}</span>`;
      return `<div class="list-pane">
          <div class="lp-head"><b>Chats</b><span class="lp-sort">${icon("sort")}Recent</span><span class="lp-new">${icon("edit")}</span></div>
          <span class="lp-filter">${icon("search")}<span>Filter chats and people</span><span class="slash">/</span></span>
          <div class="lp-tabs"><span class="on">All</span><span>People</span><span>Rooms</span><span>Linked</span></div>
          <div class="lp-accts">${["uni", "example", "mail"].map((a) => acctTag(a).replace('class="tag', 'class="tag bordered')).join("")}</div>
          <div class="lp-rows">
            <p class="lp-h">${icon("star", "ic ic-s")}Favourites</p>
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
            <span class="tl-title"><b>${r.linked ? icon("link", "ic ic-16") : ""}${esc(r.name)}${r.acct.map(acctTag).join("")}</b><small>${r.lock ? icon("lock", "ic ic-12") : ""}${sub}</small></span>
            <button type="button" class="tl-btn catch btn-ui${s.catchup === r.id ? " is-on" : ""}" data-catchup aria-pressed="${s.catchup === r.id}">Catch up</button>
            <span class="tl-tools">${hb("search", "Search in this chat")}${hb("spark", "Picked up")}${hb("thread", "Threads")}${hb("pin", "Pinned", r.id === "lab" ? 2 : 0)}${hb("panel", "Details")}</span>
          </div>
          ${gate(`${s.catchup === r.id ? catchupCard(r) : ""}<div class="tl-body"><div class="tl-inner">${msgs.map((m, i, l) => messageHtml(m, i, l, r.lock)).join("")}</div></div>
            ${
              r.mail
                ? `<p class="comp-state">Email is read-only in Weft. Answer from your mail program.</p>`
                : `<form class="composer">
              ${picked}
              <label class="sr" for="compose-${uid}">Message ${esc(r.name)}</label>
              <input id="compose-${uid}" autocomplete="off" placeholder="Message ${esc(r.name)}" />
              <div class="comp-row"><span class="tool">${icon("plus", "ic ic-20")}</span><span class="tool">${icon("clip")}</span><span class="tool">${icon("at")}</span><span class="tool">${icon("smile")}</span><span class="comp-fill"></span><span class="tool">${icon("mic")}</span><button class="send" type="submit">Send ${icon("send", "ic ic-16")}</button></div>
            </form>`
            }`)}
        </div>`;
    }

    // Inbox
    // The chat's catch-up ("Catch up" in the chat header): a short summary that cites its messages.
    function catchupCard(r) {
      const points = CATCHUP[r.id];
      const unread = r.unread ? `${r.unread} unread` : "since you last read";
      return `<div class="cu-card">
        <div class="cu-head"><b>While you were away</b><small>${unread}</small><span class="comp-fill"></span>${icon("sync", "ic ic-16")}<button type="button" class="cu-dismiss" data-catchup>Dismiss</button></div>
        ${
          points
            ? `<ol class="cu-points">${points.map(([h, t, times], i) => `<li><span class="cu-n">${String(i + 1).padStart(2, "0")}</span><p><b>${esc(h)}</b> ${esc(t)} ${cites(times)}</p></li>`).join("")}</ol>`
            : `<p class="empty">Nothing new since you last read this chat.</p>`
        }
        
      </div>`;
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
      ];
      // TimelineItemActions.svelte: what the assistant found in a message, right under it.
      const pick = s.gpuAdded
        ? `<p class="tg-done"><i>${icon("check", "ic ic-12")}</i>GPU cluster maintenance is in your calendar</p>`
        : `<div class="tg-sugg">${icon("cal")}<span><b>GPU cluster maintenance</b><small>Sat 31 Oct, 08:00, GPU cluster</small></span><span class="sm">Dismiss</span><button type="button" class="sm primary btn-ui" data-gpu>${icon("plus", "ic ic-14")}Calendar</button></div>`;
      return `<div class="tline">
        <div class="tline-bar"><span class="comp-fill"><b class="page-title">Timeline</b><small>Saturday 24 October</small></span>
          <div class="seg-ui seg-inline"><span class="on">All <em>16</em></span><span>Mentions <em>4</em></span><span>Needs reply <em>8</em></span><span>Picked up <em>8</em></span></div><span class="tl-refresh">${icon("sync", "ic ic-18")}</span></div>
        ${gate(`<div class="tline-body"><div class="tline-main">
          ${
            s.awayDismissed
              ? ""
              : `<div class="cu-card cu-wide">
            <div class="cu-head">${icon("spark", "ic ic-16 ic-ai")}<b>While you were away</b><small>Since yesterday, 13:40</small><span class="comp-fill"></span><button type="button" class="cu-dismiss" data-away>Dismiss</button></div>
            <ol class="cu-points">${AWAY.map(([h, t, room, times], i) => `<li><span class="cu-n">${String(i + 1).padStart(2, "0")}</span><p><b>${esc(h)}</b> ${esc(t)}<span class="cu-meta"><button type="button" class="cu-src" data-room="${room}">${esc(roomById(room).name)}</button>${cites(times)}</span></p></li>`).join("")}</ol>
          </div>`
          }
          <div class="tl-day"><p class="side-h">Today</p>
          ${runCardHtml(lab, lmsgs, "13:24", `<div class="run-extra">${pick}</div>`)}</div>
        </div>
        <aside class="tline-aside">
          <p class="side-h">Due <em class="cnt">${due.filter((t) => !s.done.has(t.id)).length}</em></p>
          ${
            due
              .filter((t) => !s.done.has(t.id))
              .map(
                (t) =>
                  `<p class="due-row"><button type="button" class="check" data-done="${t.id}" aria-pressed="false" aria-label="Done">${icon("check", "ic ic-12")}</button><span>${esc(t.title)}</span>${t.overdue ? `<em class="overdue-txt">overdue</em>` : ""}</p>`,
              )
              .join("") || `<p class="empty">Nothing due.</p>`
          }
          <p class="side-h">Today</p>
          <p class="today-row"><span class="row-time">11:00</span><span>Call with Mira</span></p>
          <p class="today-row"><span class="row-time">16:30</span><span>Writing block: CHI abstract</span></p>
          <p class="side-h">Unread</p>
          ${unread.map((r) => `<button type="button" class="unread-row" data-room="${r.id}">${avatar(r.av, r.c, roomAv(r, "av av-xs"))}<span>${esc(r.name)}</span>${r.reply ? `<em class="at">${icon("at", "ic ic-12")}</em>` : ""}<em>${r.unread}</em></button>`).join("") || `<p class="empty">All caught up.</p>`}
        </aside></div>`)}
      </div>`;
    }

    function inboxView() {
      const shown = INBOX.filter(
        (m) =>
          s.mailFilter === "all" ||
          (s.mailFilter === "answer" ? m.reply : m.kind === "Person"),
      );
      const m = INBOX.find((x) => x.id === s.mail);
      const row = (x) => {
        const unread = x.unread && !s.readMail.has(x.id);
        const tags = `${x.reply ? `<span class="chip chip-reply chip-sm">${icon("reply", "ic ic-12")}needs reply</span>` : ""}${x.label ? label(...x.label).replace('class="lbl"', 'class="lbl lbl-sm"') : ""}`;
        return `<button type="button" class="mail-item${x.id === s.mail ? " on" : ""}${unread ? " unread" : ""}" data-mail="${x.id}" aria-pressed="${x.id === s.mail}">
        ${avatar(initials(x.from), x.c, "av av-38 av-mail")}
        <span class="mi-main">
          <span class="mi-top"><b>${esc(x.from)}</b><span class="time">${x.time}</span></span>
          <span class="mi-sub"><span>${esc(x.subject)}</span></span>
          ${s.privacy ? "" : `<span class="mi-prev">${x.file ? icon("clip", "ic ic-14") : ""}<span>${esc(x.body[1] ?? x.body[0])}</span></span>`}
          ${tags ? `<span class="mi-tags">${tags}</span>` : ""}
        </span>
      </button>`;
      };
      const f = (k, l, n) =>
        `<button type="button" class="pill${s.mailFilter === k ? " on" : ""}" data-filter="${k}" aria-pressed="${s.mailFilter === k}">${l}${n ? `<em>${n}</em>` : ""}</button>`;
      const added = m.event && s.added.has(m.id);
      return `<div class="list-pane mail-list">
          <div class="lp-head"><b>Inbox</b><span class="lp-icons"><span class="on" title="Threads">${icon("thread", "ic ic-18")}</span><span title="Refresh">${icon("sync", "ic ic-18")}</span></span></div>
          <div class="pills">${f("all", "All")}${f("answer", "To answer", INBOX.filter((x) => x.reply).length)}${f("people", "People", INBOX.filter((x) => x.kind === "Person").length)}<span class="pill">Notifications</span><span class="pill">Newsletters</span><span class="pill">Spam</span></div>
          <div class="mail-rows">${shown.map(row).join("")}</div>
        </div>
        <div class="reader">
          <div class="mail-head">
            <h3 class="rd-subject">${esc(m.subject)}</h3>
            <div class="rd-from">${avatar(initials(m.from), m.c, "av av-40 av-mail")}<span><b>${esc(m.from)}</b><small>${esc(m.addr)}</small></span>
              <span class="rd-actions"><span class="tl-btn">${icon("note", "ic ic-16")}Add to note</span><span class="tl-btn">${icon("link", "ic ic-16")}Add to a chat</span><span class="tl-btn primary">${icon("plus", "ic ic-16")}Follow</span></span></div>
            <div class="rd-meta"><span>${m.time.includes(":") ? `Today, ${m.time}` : m.time}</span><span>to</span><span class="who-chip">${avatar("AW", 0, "av av-20")}Anna Weber</span></div>
            <div class="rd-kind"><div class="seg-ui seg-inline">${["Person", "Notification", "Newsletter", "Spam"].map((k) => `<span class="${k === m.kind ? "on" : ""}">${k}</span>`).join("")}</div>${m.reply ? `<span class="chip chip-reply">${icon("reply", "ic ic-12")}needs reply</span>` : ""}${m.label ? label(...m.label) : ""}<span class="rd-sorted">Sorted by nimble-v3</span></div>
          </div>
          <div class="rd-body">${m.body.map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("")}
            ${m.file ? `<span class="rd-file"><span class="file-ic">${icon("file", "ic ic-14")}</span><b>${esc(m.file[0])}</b><small>${m.file[1]}</small></span>` : ""}
          ${
            m.event
              ? `<div class="rd-events"><p class="found-h"><span class="spark">${icon("spark", "ic ic-16")}</span><b>Events in this mail</b><em>1</em></p>
            ${
              added
                ? `<p class="ai-done"><i>${icon("check", "ic ic-12")}</i>${esc(m.event.title)} is in your calendar</p>`
                : `<div class="ev-card"><span class="ev-date"><small>${m.event.mon}</small><b>${m.event.day}</b></span>
              <span class="ev-main"><b>${esc(m.event.title)}</b><small><span>${icon("clock", "ic ic-12")}${m.event.when}</span><span>${icon("mappin", "ic ic-12")}${m.event.where}</span></small></span>
              <button type="button" class="ai-add btn-ui" data-add-event="${m.id}">${icon("plus", "ic ic-16")}Add</button><span class="ai-x">${icon("close", "ic ic-18")}</span>
            </div>`
            }</div>`
              : ""
          }
          </div>
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
      const cals = `<div class="cal-cals"><p class="side-h">Calendars</p>${[
        ["Personal", "blue", "local"],
        ["Picked up from chats", "purple", "auto"],
        ["CS Colloquium", "teal", "feed"],
      ]
        .map(
          ([n, c, k]) =>
            `<p class="cal-row"><i class="cal-box" style="--l:var(--label-${c})">${icon("check", "ic")}</i><span>${n}</span><small>${k}</small></p>`,
        )
        .join("")}</div>`;
      const found = `<div class="cal-found"><p class="side-h">Found in chats <em class="cnt">${FOUND.filter((f) => !s.taken.has(f.id)).length}</em></p>${FOUND.map(
        (
          f,
        ) => `<div class="found${s.taken.has(f.id) ? " taken" : ""}"><b>${esc(f.title)}</b><small>${f.when}</small><small class="from">${acctTag(f.from[0]).replace('class="tag', 'class="tag tag-sm')} ${esc(f.from[1])}</small>
        ${s.taken.has(f.id) ? `<p class="ai-done"><i>${icon("check", "ic ic-12")}</i>Added to your calendar</p>` : `<span class="found-act"><button type="button" class="primary btn-ui" data-found="${f.id}">Add</button><span>Dismiss</span></span>`}</div>`,
      ).join("")}</div>`;
      const hours = Array.from(
        { length: H1 - H0 },
        (_, i) =>
          `<span class="hr" style="top:${i * ROW}px">${i ? fmtH(H0 + i) : ""}</span>`,
      ).join("");
      const lines = Array.from(
        { length: H1 - H0 },
        (_, i) => `<i style="top:${i * ROW}px"></i>`,
      ).join("");
      const ev = (e) =>
        `<span class="ev${e.added ? " ev-new" : ""}" style="--l:var(--label-${e.cal});top:${(e.from - H0) * ROW + 1}px;height:${(e.to - e.from) * ROW - 3}px"><b>${e.chat ? icon("spark", "ic") : e.repeat ? icon("repeat", "ic") : ""}${esc(e.title)}</b><small>${fmtH(e.from)}-${fmtH(e.to)}${e.where ? `, ${esc(e.where)}` : ""}</small></span>`;
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
          ${gate(`<div class="cal-bar"><span class="tl-btn">Today</span><span class="cal-nav">${icon("left")}</span><span class="cal-nav">${icon("right")}</span><b class="cal-title">October 2026</b><span class="hweek">W43</span><span class="comp-fill"></span><div class="seg-ui seg-inline"><span>Day</span><span class="on">Week</span><span>Month</span></div><span class="send">${icon("plus", "ic ic-16")}New event</span></div>
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
          <div class="cal-ask"><div class="bar">${icon("spark")}<span>Lunch with Sofia on Tuesday at 12:30, find an hour with Mira next week…</span><span class="go">${icon("send", "ic ic-16")}</span></div></div>`)}
        </div>`;
    }

    // Todos
    function todosView() {
      const card = (t, sugg, col) =>
        todoCardHtml(t, { sugg, done: s.done.has(t.id), col });
      const sugg = TODOS.sugg.filter((t) => !s.taken.has(t.id));
      const upcoming = [
        ...TODOS.sugg.filter((t) => s.taken.has(t.id)),
        ...TODOS.upcoming,
      ];
      const done = [...TODOS.today, ...TODOS.upcoming].filter((t) =>
        s.done.has(t.id),
      );
      const col = (ic, name, n, body, cls = "", extra = "") =>
        `<div class="col${cls}"><p class="fl-col"><span class="c-icon">${icon(ic, "ic ic-16")}</span><b>${name}</b><em>${n}</em>${extra}</p><div class="col-cards">${body}</div></div>`;
      return `<div class="todo-page">
          <div class="todo-bar"><span class="comp-fill"><b class="page-title">Todos</b><small>Saturday 24 October</small></span><div class="seg-ui seg-inline"><span class="on">${icon("cal", "ic ic-16")}By date</span><span>${icon("label", "ic ic-16")}By label</span></div><span class="send">${icon("plus", "ic ic-16")}New todo</span></div>
          <div class="todo-labels">${[
            ["All", ""],
            ["Research", "blue"],
            ["Teaching", "green"],
            ["Thesis supervision", "purple"],
            ["Conference", "pink"],
            ["Admin", "orange"],
          ]
            .map(
              ([n, c], i) =>
                `<span class="lbl-pill${i ? "" : " on"}"${c ? ` style="--c:var(--label-${c})"` : ""}>${c ? `<i></i>` : ""}${n}</span>`,
            )
            .join(
              "",
            )}<span class="lbl-pill manage">${icon("gear", "ic ic-14")}Labels</span></div>
          ${gate(`<div class="todo-board">
            ${col("spark", "From your chats", sugg.length, sugg.length ? sugg.map((t) => card(t, true)).join("") : `<p class="empty">Nothing new from your chats.</p>`, " col-sugg", sugg.length ? `<span class="c-link">Add all</span>` : "")}
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
      const row = (
        x,
      ) => `<button type="button" class="note-item${x.id === s.note ? " on" : ""}" data-note="${x.id}" aria-pressed="${x.id === s.note}">
        <b>${esc(x.title)}</b>${
          s.privacy
            ? ""
            : `<span class="ni-prev">${esc(
                s.notes[x.id]
                  .split("\n")
                  .find((l) => l.trim() && !/^([#>|-]|\d+\.)/.test(l.trim()))
                  ?.replace(/\]\([^)]*\)/g, " ")
                  .replace(/[*\[\]]/g, "")
                  .trim() ?? "",
              )}</span>`
        }<span class="ni-meta"><span>${x.time}</span>${icon("link", "ic ic-12")}<span>${esc(x.chat)}</span></span></button>`;
      const mode = (k, ic, t) =>
        `<button type="button" role="radio" class="nt-tool" aria-checked="${s.noteMode === k}" data-mode="${k}" title="${t}">${icon(ic)}</button>`;
      const tool = (ic, t) =>
        `<span class="nt-tool" title="${t}">${icon(ic)}</span>`;
      return `<div class="list-pane notes-list">
          <div class="lp-head"><b>Notes</b><span class="nt-add">${icon("plus")}</span></div>
          <span class="lp-filter">${icon("search")}<span>Search notes</span></span>
          <div class="note-rows">${NOTES.map(row).join("")}</div>
        </div>
        <div class="note-pane">
          ${gate(`<div class="note-bar">
            <div class="nt-modes" role="radiogroup" aria-label="Note mode">${mode("edit", "edit", "Markdown")}${mode("split", "split", "Side by side")}${mode("preview", "eye", "Preview")}</div>
            <span class="nt-sep"></span>${tool("bold", "Bold")}${tool("title", "Heading")}${tool("list", "List")}${tool("todo", "Checklist")}${tool("chat", "Link a message")}${tool("clip", "Embed a file")}<span class="nt-tool on" title="Linked to a chat">${icon("link")}</span>
            <span class="comp-fill"></span><span class="nt-saved">Saved ${n.time}</span>${tool("send", "Send to a chat")}${tool("trash", "Delete note")}</div>
          <div class="note-body mode-${s.noteMode}">
            <div class="nt-title"><b>${esc(n.title)}</b><span class="note-chat">${icon("link", "ic ic-12")}Linked to ${esc(n.chat)}</span></div>
            <div class="nt-panes">
              <label class="sr" for="md-${uid}">Markdown of ${esc(n.title)}</label>
              <textarea id="md-${uid}" class="md-src" spellcheck="false">${esc(body)}</textarea>
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
            ${pr.picked ? sec("Picked up from your chats", pr.picked.length, pr.picked.map(([title, due]) => `<div class="prow"><span class="pr-glyph ai">${icon("todo", "ic ic-18")}</span><span class="pr-text"><span class="pr-line">${esc(title)}</span><span class="pr-meta">Due ${due}</span></span><span class="pr-tiny">${icon("plus", "ic ic-18")}</span><span class="pr-tiny">${icon("close", "ic ic-16")}</span></div>`).join("")) : ""}
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
      const body = $(".tl-body", el);
      if (body) body.scrollTop = body.scrollHeight;
      if (focus) $(focus, el)?.focus();
      el.dispatchEvent(
        new CustomEvent("weft:view", { detail: s.view, bubbles: true }),
      );
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
      if (hit("[data-catchup]")) {
        s.catchup = s.catchup === s.room ? null : s.room;
        return render();
      }
      if (hit("[data-away]")) {
        s.awayDismissed = true;
        return render();
      }
      if (hit("[data-gpu]")) {
        s.gpuAdded = true;
        return toast("Added “GPU cluster maintenance” to your calendar");
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
      if ((x = hit("[data-filter]"))) {
        s.mailFilter = x.dataset.filter;
        return render();
      }
      if ((x = hit("[data-add-event]"))) {
        const m = INBOX.find((y) => y.id === x.dataset.addEvent);
        s.added.add(m.id);
        return toast(`Added “${m.event.title}” to your calendar`);
      }
      if ((x = hit("[data-found]"))) {
        const f = FOUND.find((y) => y.id === x.dataset.found);
        s.taken.add(f.id);
        if (f.add) s.cal.push({ ...f.add, added: true });
        return toast(`Added “${f.title}” to your calendar`);
      }
      if ((x = hit("[data-take]"))) {
        s.taken.add(x.dataset.take);
        return toast("Added to your todos");
      }
      if ((x = hit("[data-done]"))) {
        const id = x.dataset.done;
        s.done.has(id) ? s.done.delete(id) : s.done.add(id);
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
      if (!e.target.matches(".md-src")) return;
      s.notes[s.note] = e.target.value;
      $(".md", el).innerHTML = md(e.target.value);
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
  if (heroEl) mountWindow(heroEl, { catchup: "lab" });

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
    const count = (k) =>
      hits.filter((h) =>
        k === "work" ? !["chat", "mail"].includes(h.d.kind) : h.d.kind === k,
      ).length;
    const scope = (label, n, on) =>
      `<span class="scope${on ? " on" : ""}">${label}${n != null ? `<em>${n}</em>` : ""}</span>`;
    const filters = `<div class="res-filters">${scope("All", hits.length, true)}${scope("Messages", count("chat"))}${scope("Mail", count("mail"))}${scope("Workspace", count("work"))}<span class="comp-fill"></span><span class="dd">Any room${icon("down", "ic ic-16")}</span><span class="dd">Anyone${icon("down", "ic ic-16")}</span><span class="dd">Any time${icon("down", "ic ic-16")}</span></div>`;
    let first = true;
    const row = ({ d }) => {
      const sel = first ? " on" : "";
      const enter = first ? `` : "";
      first = false;
      if (d.kind === "chat")
        return `<div class="res${sel}">${avatar(initials(d.who), d.c, "av av-32")}<span class="res-main"><span class="res-top"><b>${esc(d.who)}</b><span>in ${esc(d.where)}</span>${acctTag(d.acct).replace('class="tag', 'class="tag tag-sm')}<span class="comp-fill"></span><span>${esc(d.time)}</span></span><span class="res-text">${highlight(d.text, terms)}</span></span>${enter}</div>`;
      if (d.kind === "mail")
        return `<div class="res${sel}">${avatar(initials(d.who), d.c, "av av-32 av-mail")}<span class="res-main"><span class="res-top"><b>${esc(d.who)}</b><span>in ${esc(d.chat ?? "Inbox")}</span><span class="comp-fill"></span><span>${esc(d.time)}</span></span><span class="res-subject">${highlight(d.where, terms)}</span><span class="res-text muted">${highlight(d.text, terms)}</span></span>${enter}</div>`;
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
          "Workspace",
          by((k) => k !== "chat" && k !== "mail"),
        )}</div>`
      : `${filters}<p class="res-empty">Nothing in the sample records matches “${esc(q.value)}”.</p>`;
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
      ${avatar(initials(m.from), m.from === "Mira Schulz" ? 1 : 3, "av av-mail")}
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
      "jonas",
      "13:44",
      "@Anna Weber could you send the camera-ready checklist to Daniel before Friday?",
      { mention: true },
    ];
    flow.innerHTML = `
      <div class="fl-chat">
      <div class="fl-head">${avatar("ML", 5, "av av-s av-room")}<b>Machine Learning Lab</b>${acctTag("uni")}</div>
      <div class="fl-msgs">
        ${messageHtml(["lukas", "13:13", "Heads-up: the GPU cluster is down for maintenance on Saturday 08:00-14:00."], 0, [])}
        ${messageHtml(ask, 1, [["lukas"], ask])}
      </div>
      <div class="fl-sugg">
        <p class="fl-sh"><span class="pk-spark">${icon("spark", "ic ic-16")}</span><b>Picked up from this chat</b><em>1</em><span class="comp-fill"></span><span class="pk-fold">${icon("down", "ic ic-16")}</span></p>
        <div class="sugg">
          <span class="leaf">${icon("todo", "ic ic-22")}</span>
          <span class="s-text">
            <span class="s-line"><b>Send camera-ready checklist to Daniel</b>${label("Thesis supervision", "purple").replace('class="lbl"', 'class="lbl lbl-sm"')}</span>
            <span class="s-meta"><span>${icon("cal", "ic ic-14")}Due Fri 30 Oct</span></span>
          </span>
          <span class="ai-add">${icon("plus", "ic ic-16")}Add</span><span class="ai-x">${icon("close", "ic ic-18")}</span>
        </div>
      </div>
      </div>
      <div class="fl-board">
        <div class="col">
          <p class="fl-col"><span class="c-icon">${icon("cal", "ic ic-16")}</span><b>Upcoming</b><em>7</em></p>
          <div class="col-cards">
            <p class="fl-day">Fri 30 Oct</p>
            ${todoCardHtml({ id: "f1", title: "Send camera-ready checklist to Daniel", due: "Fri 30 Oct", label: ["Thesis supervision", "purple"], from: "Machine Learning Lab" }).replace('class="card"', 'class="card new"')}
            <p class="fl-day">Tue 27 Oct</p>
            ${todoCardHtml({ id: "f2", title: "Book train to Vienna", due: "Tue 27 Oct", label: ["Conference", "pink"] })}
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
        ["search", "Searched “CHI paper deadline abstract”", "3 found"],
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
        ["search", "Searched “lab meeting room”", "2 found"],
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
      <div class="wp-head">${logo("warp", 28)}<b>Warp</b><span class="wp-model">gemma4:e4b, on this computer</span></div>
      <p class="wp-q"><span>${esc(a.q)}</span></p>
      <div class="wp-steps">${a.steps.map(([ic, t, n]) => `<p class="wp-step">${icon(ic)}<span>${esc(t)}</span><em>${n}</em></p>`).join("")}</div>
      <div class="wp-answer">
        <p class="wp-p">${cite(intro)}</p>
        <ul>${points.map((p) => `<li class="wp-p">${cite(p)}</li>`).join("")}</ul>
      </div>
      <details class="wp-src"><summary>Sources <em>${a.sources.length}</em></summary>
        ${a.sources.map(([ic, where, text], i) => `<p class="wp-s"><span class="cite">${i + 1}</span>${icon(ic, "ic ic-s")}<b>${esc(where)}</b><span>${esc(text)}</span></p>`).join("")}
      </details>
      <div class="wp-comp"><span>Ask a follow-up…</span><span class="wp-send">${icon("send", "ic ic-s")}</span></div>`;
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

  function renderSettings() {
    if (!settings) return;
    settings.innerHTML = `
      <p class="st-title">Appearance</p>
      <p class="st-sub">Applies to every account on this device.</p>
      <div class="st-block" data-part="theme">
        <p class="st-h">Theme</p>
        <div class="presets" role="radiogroup" aria-label="Theme">${PRESETS.map(
          (p) => `
          <button type="button" role="radio" aria-checked="${p.id === look.preset}" data-set="preset" data-val="${p.id}" class="preset">
            <span class="sw" style="background:${p.vars.app}"><i style="background:${p.vars.panel}"></i><i style="background:${p.vars.accent}"></i></span>${p.name}
          </button>`,
        ).join("")}
        </div>
      </div>
      <div class="st-block" data-part="accent">
        <p class="st-h">Accent colour</p>
        <div class="accents" role="radiogroup" aria-label="Accent colour">
          <button type="button" role="radio" aria-checked="${!look.accent}" aria-label="Theme default" title="Theme default" data-set="accent" data-val="" class="acc acc-default" style="--a:${PRESETS.find((p) => p.id === look.preset).vars.accent};--on:${PRESETS.find((p) => p.id === look.preset).vars["on-accent"]}">${icon("auto", "ic ic-s")}</button>
          ${ACCENTS.map((c, i) => `<button type="button" role="radio" aria-checked="${look.accent === c}" aria-label="Accent ${ACCENT_NAMES[i]}" data-set="accent" data-val="${c}" class="acc" style="--a:${c}"></button>`).join("")}
        </div>
      </div>
      <div class="st-block" data-part="style">
        <p class="st-h">Message style</p>
        ${seg(
          "layout",
          [
            ["flat", "Flat"],
            ["bubbles", "Bubbles"],
            ["split", "Split"],
          ],
          look.layout,
        )}
      </div>
      <div class="st-block" data-part="density">
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
        <p class="st-h st-h2">Corners <span>${look.radius} px</span></p>
        <input type="range" min="0" max="20" step="1" value="${look.radius}" data-set="radius" aria-label="Corners" />
      </div>
      <div class="st-block" data-part="css">
        <p class="st-h">Custom styles</p>
        <div class="css-row">${icon("file")}<span><b>user.css</b><small>3 rules. Loads last and overrides anything set on this page.</small></span><span class="st-btn">Show file</span></div>
        <span class="st-reset" role="button" tabindex="0" data-reset>Reset appearance</span>
      </div>`;
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
      const b = e.target.closest("button[data-set]");
      if (!b) return;
      const k = b.dataset.set;
      look[k] = k === "accent" ? b.dataset.val || null : b.dataset.val;
      if (k === "preset") look.accent = null;
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
      const out = $(".st-h2 span", settings);
      if (out) out.textContent = `${look.radius} px`;
    });
  }

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
