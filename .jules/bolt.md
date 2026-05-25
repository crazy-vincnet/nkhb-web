## 2024-05-25 - React.memo with React.FC Type Definitions in TypeScript
**Learning:** When using `React.memo` to optimize functional components in a strict TypeScript environment, utilizing the standard `React.FC` type annotation on the variable assignment will cause a type collision. `React.FC` strictly types a function signature, whereas `React.memo` returns a `React.NamedExoticComponent` object. This causes a compilation error (e.g., `Type 'NamedExoticComponent<Props>' is not assignable to type 'FC<Props>'`).
**Action:** Always type the props inline within the component's arguments `function MyComponent({ prop1 }: Props)` and allow TypeScript to infer the resulting type when wrapping with `React.memo`.

## 2024-05-25 - Playwright Modal Triggering via postMessage
**Learning:** In applications where modals are triggered via cross-document messaging (e.g., `window.postMessage({ type: 'NKHB_OPEN_MODAL' }, '*')`), relying on UI locators and `.click()` in Playwright can sometimes lead to timeouts if the element is obscured or if event delegation takes longer than expected.
**Action:** If standard `.click()` fails or is flaky during verification, inject the message directly using `page.evaluate("window.postMessage({ type: 'NKHB_OPEN_MODAL', modalType: 'article' }, '*')")` to reliably test the state change logic.
