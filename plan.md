1. **Create `src/public/components/Modals.tsx`**: Extract the modal state (`isArticleModalOpen`, `isLetterModalOpen`, `isSampleModalOpen`) and `useEffect` listener from `App.tsx` into a new `Modals` component wrapped with `React.memo`.
2. **Update `src/public/App.tsx`**: Remove the modal state and the `useEffect` from `App.tsx`. Import and render the `<Modals />` component inside the `<Router>`. Add performance optimization comments (`⚡ Bolt Optimization: Extracted modal state to prevent full-page re-renders`).
3. **Run testing & verification**:
    - `npm ci`
    - Run `npm run lint` with `--max-warnings 0` (or greater if unedited code has warnings) to verify code quality.
    - Run `npm run build` to verify type checking and build.
    - Start `npm run preview &` to start the preview server, write a Playwright script to verify the site loads and the postMessage modal triggers work correctly.
    - Cleanup the preview server.
4. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
5. **Submit PR**: Submit with title `⚡ Bolt: Extract modal state to prevent App re-renders` and a description outlining what, why, impact, and measurement.
