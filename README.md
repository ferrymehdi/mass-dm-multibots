# 🤖 Mass DM Multi-Bots

A high-performance multi-token Discord bot system using **Bun**, **TypeScript**, and **discord.js** to mass message users across multiple clients simultaneously.

## ⚙️ Features

- 💬 Slash command `/mass-dm` for direct messaging all server members
- 🔐 Owner-only access to prevent abuse
- 🧠 Multi-client support — one bot per token
- 🚀 Built with [Bun](https://bun.sh/) for blazing-fast startup
- ✅ Type-safe command interface
- 📂 Modular code structure for scalability

## 📁 Project Structure

```

.
├── Commands/
│   ├── ping.ts        # Basic test command
│   └── mass-dm.ts     # Owner-only DM command
├── types/
│   └── index.d.ts     # Shared Command interface
├── index.ts           # Main entry point: loads clients and handlers
├── config.json        # Contains tokens and owners
├── tsconfig.json      # TypeScript configuration
├── bun.lock           # Bun's lockfile
├── package.json       # Bun project metadata and scripts

````

## 📦 Installation

> **Requirement:** Bun must be installed. [Install Bun →](https://bun.sh/docs/installation)

```bash
bun install
````

## 🚀 Usage

```bash
bun run index.ts
```

Make sure your `config.json` looks like this:

```json
{
  "tokens": [
    "YOUR_DISCORD_TOKEN_1",
    "YOUR_DISCORD_TOKEN_2"
  ],
  "owners": [
    "YOUR_DISCORD_USER_ID"
  ]
}
```

## ❗ Commands

| Command    | Description             | Permissions |
| ---------- | ----------------------- | ----------- |
| `/ping`    | Test bot responsiveness | Public      |
| `/mass-dm` | Send DM to server users | Owner only  |

> `/mass-dm` will attempt to DM all non-bot members of the current guild. Each bot token runs its own client and shares the command set.

## ✅ Permissions Required

To use `/mass-dm`, bots must have:

* `Read Messages`
* `Send Messages`
* `Send Direct Messages`
* `Use Application Commands`

## 🛡️ Disclaimer

This tool is for **educational** and **testing** purposes only.
Do **not** use it to spam or violate Discord's [Terms of Service](https://discord.com/terms). You are responsible for how you use this code.

---

## 🧠 Author

**Mehdi Ferry**
📧 [me@ferrymehdi.xyz](mailto:me@ferrymehdi.xyz)
🌐 [ferrymehdi.xyz](https://ferrymehdi.xyz)
