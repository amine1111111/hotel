We are continuing work on my hotel booking React frontend.

I want to implement **intent-based route preloading for desktop navigation**.

Current architecture:

* React + Vite
* React Router
* Pages are already lazy-loaded with `React.lazy()` in `src/router.jsx`
* `App.jsx` wraps `RouterProvider` in `<Suspense fallback={null}>`
* Navigation uses a custom GSAP page transition
* `CustomerNavigation` → `NavigationOverlay` → custom `usePageTransition`
* `usePageTransition` reveals/hides an 80-square `PageTransitionOverlay`
* `PageTransitionOverlay.jsx` is purely visual and must NOT contain preloading logic.

Goal:
When the user's mouse enters a navigation link, preload that destination's lazy page chunk. When they click, the page should ideally already be loaded, while our existing GSAP transition still runs normally.

Use:

* `mouseenter` for desktop intent
* `focus` for keyboard accessibility
* Don't preload every route automatically.
* Keep lazy loading as the default.
* Avoid unnecessary architecture or wrapper components.
* Keep route preloading separate from the visual transition system.
* Do not modify `PageTransitionOverlay.jsx`.

Before changing anything, inspect my current `NavigationOverlay.jsx` and any related navigation component/hooks so the implementation matches the existing architecture.

Implement this as a clean, senior-level solution with minimal changes and explain exactly which files/functions change. Give me complete updated files when code changes are needed. Test each step before moving to the next.
