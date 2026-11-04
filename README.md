<p align="center">
  <img src="assets/readme/banner.png" alt="Weft: your chats, woven into one. A Matrix client for Windows, macOS and Linux." width="100%" />
</p>

<p align="center">
  <b>Your chats, woven into one.</b><br />
  A Matrix client for Windows, macOS and Linux that keeps every account, your mail and
  servers long gone in one searchable record on your own computer.
</p>

<p align="center">
  <a href="https://github.com/smilefx/weft-app/releases/latest"><b>Download</b></a> |
  <a href="https://weft.lucaar.dev/">Website</a> |
  <a href="https://github.com/smilefx/weft-app/releases">All releases</a>
</p>

---

## What Weft does

- **Search every chat at once.** Full-text search across every account, encrypted rooms
  and imported history included.
- **All your accounts, one list.** Sign in to as many homeservers as you have. When you
  use several Matrix servers that are not federated, link people and rooms across them and
  Weft shows them as one chat, with the right account for each message.
- **History from servers that shut down.** Import an Element export (JSON or zip). The
  messages slot into the room at their original time, attachments included.
- **Mail next to your chats.** Add a mail account (IMAP and SMTP) and write, answer and
  forward mail from Weft. A local model sorts it into what needs a reply, which label it
  belongs to and what is spam.
- **Encrypted, keys backed up.** End-to-end encryption with cross-signing, key backup and
  recovery. Weft signs in as one more device, so Element and your phone stay in sync.
- **Everything around the chat.** A timeline that sums up what you missed, a calendar that
  finds dates in messages, a todo board, notes that quote what was said, and a page for
  every person.
- **The calendar you already use.** Connect iCloud, Nextcloud, Fastmail, mailbox.org, Posteo
  or any other CalDAV server and add, change and delete its events from Weft, in both
  directions. Google, Outlook and course timetables come in as `.ics` subscriptions.
- **From message to todo.** A small model on your machine reads new messages and suggests
  todos and events with a title, a date and a label. Nothing is added without you.
- **Warp, an assistant for your records.** Ask your chats anything: Warp searches, reads
  what matters and answers in a few sentences with numbered sources. It can propose todos,
  notes and replies, you decide what happens.
- **AI when you want it.** One setting hides Warp, summaries and every suggestion. Chats,
  search and the workspace stay.
- **Privacy mode.** Sharing your screen in a lecture or a meeting? Privacy mode covers the
  open chat or mail and hides previews in your lists.
- **Plugins for the rest of your work.** GitLab issues and merge requests become todos,
  Moodle brings assignments, deadlines and messages, and an Obsidian vault becomes a folder of
  your notes. See [Plugins](#plugins).
- **Make it yours.** Thirteen themes, each in light and dark, or your own made from scratch or
  imported from a file. Any accent colour, three message styles, adjustable density and
  corners, and a `user.css` that loads last and reloads as you save.
- **English or German**, for the app and everything the assistant writes.

## Plugins

Plugins bring your other tools into Weft, so their work lands where your own already is. They
are built in, so there is nothing to install: connect one under _Settings -> Plugins_.

| Plugin   | What it brings                                                                                                                                                                                  | How you connect it                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| GitLab   | Your To-Do List, assigned issues, merge requests to review and, if you want, your own merge requests, as todos that link back.                                                                  | A personal access token, for gitlab.com or your institution's GitLab. `read_api` to read, `api` to also mark to-dos done and close issues. |
| Moodle   | Assignments still due and, if you want, quizzes and other activities as todos. Deadlines and course events in the calendar. Moodle messages as chats you can answer in plain text. Notifications for Warp. | A security key, which works with single sign-on, or your password. If your Moodle gives out no key, a calendar link brings deadlines and events only. |
| Obsidian | A vault as a folder of your notes, in sync both ways, with wiki links, embeds, tags and properties. If a note changes on both sides, the other text is kept as a copy.                          | The vault's folder on your computer.                                                                     |

Warp can look all of it up, and search finds it like everything else. GitLab and Moodle are
fetched every five minutes, and you can connect several servers of each. Tokens are stored
encrypted on your computer and never synced, so you connect each computer on its own, and a
vault stays on the computer it is on. Plugins from others can't be installed yet.

## Your data stays on your machine

Weft is a service that runs inside the app on your own computer. Messages, imports, todos
and notes stay in your data folder. There is no Weft cloud and no Weft
account. Your other computers get your todos, notes and events through an encrypted room
on your own Matrix account, and your settings, folders and labels come along. Passwords
never sync: calendar passwords and plugin tokens are encrypted on each device with a key in
your system keychain, and every computer adds the account itself.

The assistant features use an inference server on your machine with an OpenAI-compatible
API, such as [Ollama](https://ollama.com). Without one, chats, search and the workspace work
as usual.

## Install

Download the installer for your system from the
[latest release](https://github.com/smilefx/weft-app/releases/latest):

| System                    | File                 |
| ------------------------- | -------------------- |
| Windows 10 and 11, 64-bit | `..._x64-setup.exe`  |
| macOS, Apple silicon      | `..._aarch64.dmg`    |
| macOS, Intel              | `..._x64.dmg`        |
| Linux, 64-bit             | `..._amd64.AppImage` |
| Debian and Ubuntu, 64-bit | `..._amd64.deb`      |

Weft keeps itself up to date: it checks shortly after it starts and every six hours,
downloads a signed update in the background and asks you to restart when it is ready.

**Windows says it protected your PC.** Weft is not signed with a paid certificate yet, so
SmartScreen warns on the first install. Choose _More info_, then _Run anyway_. Updates after
that do not warn. The installer needs no administrator rights.

**macOS will not open it.** Drag Weft to Applications and open it. If macOS refuses, open
_System Settings -> Privacy & Security_ and choose _Open Anyway_. If it says the app is
damaged, run this once in Terminal:

```bash
xattr -dr com.apple.quarantine /Applications/Weft.app
```

**Linux.** Weft needs Ubuntu 22.04 or newer, or another distribution of that age. Make the
AppImage executable (`chmod +x Weft_*.AppImage`) and start it. It updates itself. The `.deb`
installs with `sudo apt install ./Weft_*_amd64.deb` and does not update itself: install the
next one. The tray icon needs AppIndicator support, which GNOME gets from its AppIndicator
extension.

## Coming soon

- **Container.** The same service in a container on your own server, with Weft in the
  browser.
- **Open source.** The source code of the app and the service, published here.

Watch this repository (_Watch -> Custom -> Releases_) to hear when they land.

## Report a problem or suggest something

Use [Issues](https://github.com/smilefx/weft-app/issues) in this repository, for the app
as well as the website. Search first, so if someone already reported it, add what you know
there.

For a bug, please include:

- your Weft version and your system (Windows, macOS on Apple silicon or Intel, or your
  Linux distribution),
- what you did, what you expected and what happened instead,
- a screenshot or the error text, if there is one.

Chats and mail are personal. Do not paste message content, tokens, passwords or exports
into an issue. Instead describe the problem in made-up words, and blur names in screenshots.

## Questions

**Do I need a Matrix account?** Yes. Any homeserver works, your organisation's or a public
one, with password or single sign-on. Mail and calendar accounts and plugins are optional.

**Can I keep using other clients?** Yes. Weft signs in as one more device of your account,
so everything stays in sync with your other clients, encryption keys included.

**Where is my data stored?** In one file and a media folder inside your user data
folder. Back it up like any other file. Remove an account and its
data goes with it.

---

People, chats and mail on the website are made up. Matrix is an open standard of the
Matrix.org Foundation.
