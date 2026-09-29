const DISCORD_INVITE =
  "https://discord.com/oauth2/authorize?client_id=1546212103004622948";

const GITHUB_URL = "https://github.com/notgonnaleo/ideal-umbrella";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08080c] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-350px] h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[160px]" />
        <div className="absolute right-[-250px] top-[35%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[-300px] left-[-200px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold shadow-lg shadow-indigo-500/20">
            U
          </div>

          <div>
            <div className="font-semibold tracking-tight">Umbrella</div>
            <div className="text-[11px] text-zinc-500">
              Discord Activity
            </div>
          </div>
        </a>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          GitHub
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-20 text-center md:pt-28">
        <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
          <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]" />
          Discord Activity
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-[-0.04em] sm:text-6xl md:text-7xl">
          Share your screen
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            with your Discord server.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
          Umbrella is a simple Discord Activity for sharing your screen with
          everyone in your voice chat.
        </p>

        <div className="mt-10">
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 font-semibold shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400"
          >
            <DiscordIcon />
            Add Umbrella to Discord
            <span>→</span>
          </a>
        </div>

        <p className="mt-5 text-xs text-zinc-600">
          Add Umbrella to your server before using the Activity.
        </p>

        {/* Product Preview */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute inset-0 rounded-3xl bg-indigo-500/15 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111116] shadow-2xl shadow-black/50">
            <div className="flex h-11 items-center border-b border-white/10 bg-[#15151b] px-4">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/60" />
                <span className="h-3 w-3 rounded-full bg-green-400/60" />
              </div>

              <div className="mx-auto rounded-md bg-black/30 px-20 py-1.5 text-xs text-zinc-600">
                Umbrella
              </div>

              <div className="w-12" />
            </div>

            <div className="grid min-h-[380px] grid-cols-[200px_1fr]">
              <aside className="border-r border-white/10 bg-[#0d0d12] p-4 text-left">
                <div className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                  Umbrella
                </div>

                <div className="rounded-lg bg-indigo-500/10 px-3 py-3 text-sm text-indigo-300">
                  Screen Share
                </div>

                <div className="mt-2 px-3 py-3 text-sm text-zinc-600">
                  Participants
                </div>
              </aside>

              <div className="flex items-center justify-center bg-[#09090d] p-8">
                <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#111116] shadow-xl">
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-zinc-900 via-[#151522] to-indigo-950/40">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
                        <ScreenIcon />
                      </div>

                      <p className="font-medium">
                        Your screen is being shared
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        3 people are watching
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                    <span className="text-xs text-zinc-600">
                      Umbrella
                    </span>

                    <span className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">
                      Stop sharing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              How to use
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Start sharing in four steps.
            </h2>

            <p className="mt-4 text-zinc-500">
              No complicated setup. Add Umbrella, join a voice chat, and
              start sharing.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
            <GuideStep
              number="01"
              title="Invite Umbrella to your server"
              description="Add Umbrella to your Discord server using the button above."
            />

            <GuideStep
              number="02"
              title="Join a voice chat"
              description="Go into any voice channel in the Discord server where Umbrella was added."
            />

            <GuideStep
              number="03"
              title="Open the Activity"
              description="Open Umbrella from the Activities menu in your voice chat."
            />

            <GuideStep
              number="04"
              title="Share your screen"
              description="Choose the screen or window you want to share and start broadcasting."
            />
          </div>

          {/* Installation CTA */}
          <div className="mt-12 text-center">
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-semibold transition hover:bg-indigo-400"
            >
              <DiscordIcon />
              Add Umbrella to Discord
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Features
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Just screen sharing.
          </h2>

          <p className="mt-4 text-zinc-500">
            Umbrella keeps the experience simple and focused.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Feature
            icon={<BoltIcon />}
            title="Simple"
            description="Join a voice chat, open the Activity, and start sharing."
          />

          <Feature
            icon={<UsersIcon />}
            title="Built for communities"
            description="Share your screen with the people already hanging out in your Discord voice channel."
          />

          <Feature
            icon={<ShieldIcon />}
            title="Discord-based"
            description="Umbrella works directly from your Discord server and voice chat."
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent p-10 text-center sm:p-16">
          <div className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to share?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-zinc-500">
              Add Umbrella to your Discord server and start sharing your
              screen.
            </p>

            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-zinc-200"
            >
              <DiscordIcon />
              Add to Discord
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-medium text-zinc-400">Umbrella</span>
            <span className="mx-2">·</span>
            Discord Activity
          </div>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}

function GuideStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition hover:border-indigo-400/20 hover:bg-white/[0.04]">
      <div className="flex items-start gap-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 font-mono text-sm text-indigo-400">
          {number}
        </div>

        <div>
          <h3 className="text-lg font-semibold">{title}</h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.54 5.06A16.85 16.85 0 0 0 15.44 3.8l-.5 1.02a15.6 15.6 0 0 0-5.88 0L8.56 3.8a16.85 16.85 0 0 0-4.1 1.26C1.87 8.88 1.17 12.4 1.52 15.88a16.7 16.7 0 0 0 5.04 2.54l1.22-1.65c-.67-.25-1.3-.56-1.9-.92l.47-.36c3.67 1.7 7.64 1.7 11.27 0l.48.36c-.6.36-1.24.67-1.91.92l1.22 1.65a16.7 16.7 0 0 0 5.04-2.54c.4-4.03-.69-7.52-2.91-10.82ZM8.68 14.15c-1.1 0-2-.99-2-2.21s.88-2.22 2-2.22 2.02.99 2 2.22c0 1.22-.89 2.21-2 2.21Zm6.64 0c-1.1 0-2-.99-2-2.21s.88-2.22 2-2.22 2.02.99 2 2.22c0 1.22-.89 2.21-2 2.21Z" />
    </svg>
  );
}

function ScreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87M16.5 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
