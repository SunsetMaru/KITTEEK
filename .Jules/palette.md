## 2024-05-18 - Keyboard Accessibility for Custom Interactive Elements
**Learning:** Custom interactive elements (like article cards or custom cassettes) with click handlers are invisible to keyboard users and screen readers unless explicitly marked up. It was surprising how much custom UI lacked this fundamental accessibility trait.
**Action:** Always ensure that interactive non-button elements have `tabindex="0"`, `role="button"`, a visible focus state (e.g., `focus-visible`), and handle `Enter` and `Space` key events.
