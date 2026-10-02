---
status: accepted
---
# Tool spots are isolated from the Card spot

Each side-panel tool (Trade, Melt, Portfolio) holds its own **Tool spot**. It follows the Card spot until edited, then detaches; editing it never freezes a card or changes the product table, and only the tool's own reset re-attaches it. Previously a tool's spot edit was written back to the card, which silently changed table prices; staff need to run what-if scenarios for a customer without disturbing the prices everyone else is quoting from.

## Consequences

- Tool spots live in memory only and are lost on reload, so a stale hand-typed spot cannot silently survive a refresh. Frozen card spots keep their existing refresh behaviour.
- Ctrl+Z resets card spots and row ticks only; tools are reset individually.
- Copy table and Message customer use the Trade tool spot. The AI assistant uses the Card spot, and shows staff a note (not part of the reply) saying whether that spot is frozen, stale or healthy.
- Staleness is one shared constant (15 minutes) in `shared-types`, read by both the cards and the assistant.
