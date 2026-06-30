# Lotwise Working Notes

## Current status

- Public demo is usable for warehouse walkthroughs.
- Core print-stack, object inventory, lot building, checklist, and export flows are implemented.
- Framing extension checkpoint is complete and documented in `docs/13-framing-extension-checkpoint.md`.

## Current pause point

- The next substantial build phase is the framing measurements, estimates, and workflow extension from the private upstream framing requirements document.
- Public repo contents exclude private upstream source links and non-demo warehouse data.

## Validation baseline

- Run `pnpm test` for calculation coverage.
- Run `pnpm build` before release handoff.
- Preserve the current local-first storage behavior unless a persistence migration is explicitly in scope.
