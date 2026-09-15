import { LogoMark } from "./Layout";

/**
 * Startup animation: icon → product name → tagline → thin progress indicator.
 * ~1.6s total, matte off-white background, smooth cubic-bezier easing.
 */
export function Splash({ fading }: { fading: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas transition-opacity duration-500 ease-out ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-splash-icon">
        <LogoMark />
      </div>
      <h1 className="animate-splash-title mt-6 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        API Documentation Agent
      </h1>
      <p className="animate-splash-sub mt-2 text-sm text-ink-soft">
        Keeping APIs and documentation in sync.
      </p>
      <div className="animate-splash-bar mt-9 h-[3px] w-44 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full w-1/3 rounded-full bg-blue-600 animate-load-bar" />
      </div>
    </div>
  );
}
