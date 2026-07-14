# Marcador Continental

Scoreboard for the Spanish card game "Continental". npm workspaces monorepo with a web app (Next.js) and a mobile app (Expo/React Native), sharing game logic.

```
apps/web/       # Next.js 16 (App Router) web app
apps/mobile/    # Expo (SDK 57) + Expo Router mobile app, Android-first
packages/core/  # shared game logic/types (@marcador/core)
```

See [CLAUDE.md](CLAUDE.md) for architecture details and [REQS.md](REQS.md) for product requirements.

## Prerequisites

- Node.js 22.13+ (or 20.19+) and npm 10+.
- For Android: [Android Studio](https://developer.android.com/studio) with the Android SDK, an emulator image (AVD), and `ANDROID_HOME`/`ANDROID_SDK_ROOT` pointing at the SDK (usually `~/Library/Android/sdk` on macOS).

Install all workspace dependencies once from the repo root:

```bash
npm install
```

## Web

```bash
npm run dev      # start dev server (Turbopack) at http://localhost:3000
npm run build    # production build (also runs the TypeScript check)
npm run start    # serve the production build
npm run lint     # ESLint
```

These are root-level scripts that proxy into `apps/web` — you can also `cd apps/web` and run the same script names directly.

## Deployment (Vercel)

`apps/web` is deployed on Vercel, linked to this GitHub repo: pushes to `develop`/other branches and PRs get preview deployments, merges to `main` deploy to production.

Because this is an npm workspaces monorepo (not a single-app repo), the project needs non-default Build & Development Settings in the Vercel dashboard:

- **Root Directory:** `apps/web` — tells Vercel where the Next.js app (and its `.next` output) actually lives, instead of the repo root.
- **Include source files outside of the Root Directory in the Build Step:** enabled — without this, Vercel only copies `apps/web` into the build sandbox and can't see `packages/core` or the root `package.json`/lockfile at all.
- **Install Command (override):** `cd ../.. && npm install`
- **Build Command (override):** `cd ../.. && npm run build --workspace=@marcador/web`

Root Directory + "include files outside the root" alone isn't enough: it makes the rest of the monorepo *visible* to the build, but Install/Build Commands still run with `apps/web` as their working directory by default. Since `apps/web/package.json` has no `workspaces` field of its own (only the root `package.json` does) and depends on `@marcador/core` via the workspace-only version `"*"`, a plain `npm install` run from `apps/web` doesn't know it's part of a workspace and tries (and fails) to fetch `@marcador/core` from the public npm registry instead of resolving it from `packages/core`. The `cd ../.. &&` in both overrides steps back up to the true repo root first, so npm resolves workspaces correctly — `next build` still runs with `apps/web` as its own cwd via the `--workspace` flag, so **Output Directory** stays the default (`.next`, relative to Root Directory).

## Mobile (Android)

1. **Start an emulator.** Open Android Studio's Device Manager and launch an AVD, or from the CLI:

   ```bash
   export ANDROID_HOME=~/Library/Android/sdk   # if not already set
   $ANDROID_HOME/emulator/emulator -list-avds  # see available AVDs
   $ANDROID_HOME/emulator/emulator -avd <avd-name>
   ```

   Confirm it's up with `adb devices` — it should list something like `emulator-5554  device`.

2. **Start the Expo dev server targeting Android:**

   ```bash
   npm run mobile:android
   ```

   This runs `expo start --android` inside `apps/mobile`, which installs Expo Go on the emulator (first run only) and opens the project in it automatically.

   Alternatively, `npm run mobile` just starts the Metro bundler (`expo start`) without launching anything — press `a` in that terminal to open on Android once an emulator/device is connected, `w` for web, or scan the QR code with Expo Go on a physical device.

### Troubleshooting

- **"Something went wrong" in Expo Go, with a `Failed to download remote update` / DNS error in `adb logcat`:** the emulator's virtual network can come up broken (DNS resolution fails entirely, even for `www.google.com`). Cold-restart it with an explicit DNS server:

  ```bash
  emulator -avd <avd-name> -no-snapshot -dns-server 8.8.8.8,8.8.4.4
  ```

- **Expo Go can't reach the dev server even though the network is fine:** `expo start --android` sometimes advertises the LAN IP (`exp://<lan-ip>:8081`), which emulators can't always reach. Use the loopback address instead:

  ```bash
  adb reverse tcp:8081 tcp:8081
  cd apps/mobile && npx expo start --android --localhost
  ```

  If Expo Go is already open, you can also connect manually: open the app, tap **Enter URL**, and type `127.0.0.1:8081`.

- **Confirm the app is actually in the foreground:** `adb shell dumpsys window | grep mCurrentFocus` — it should show `host.exp.exponent/.experience.ExperienceActivity`, not `ErrorActivity` or the launcher.

### Debug APK build (standalone, no Expo Go)

For testing outside Expo Go — a real installable app icon on the emulator, not the Expo Go wrapper.

1. **Start an emulator** (see step 1 above) and confirm it's visible with `adb devices`.

2. **Build and install the debug APK:**

   ```bash
   cd apps/mobile
   npx expo run:android --variant debug
   ```

   First run generates the native `android/` project (gitignored, regenerated on demand — this is Expo's "prebuild" step) and can take several minutes since it's a full Gradle build. This command also starts the Metro dev server itself (like `expo start` does) and keeps running in that terminal — leave it open while you test, since the debug APK loads JS from it over `adb reverse`, same as a dev build, just without the Expo Go wrapper app.

   The built APK ends up at `apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk` if you need the file itself (e.g. to install on a different emulator/device).

3. **Install that APK manually elsewhere** (skip the Gradle build, just push an already-built APK to another running emulator/device — still needs the same Metro server from step 2 reachable via `adb reverse tcp:8081 tcp:8081` for JS):

   ```bash
   adb install apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk
   ```

   Use `adb install -r ...` to reinstall over an existing copy without uninstalling first.

This gets you a real installed app icon (not the Expo Go wrapper) and access to native modules Expo Go's managed runtime doesn't support — useful for catching issues that only show up outside Expo Go. It still needs the Metro dev server (step 2) running for JS, unlike a full release/production build.
