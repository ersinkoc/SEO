# TASKS

## Phase 1: Foundation

1. Initialize package metadata, strict TypeScript, build/test tooling.
2. Define all public types (`SeoInput`, `SeoReport`, `RuleDefinition`, config contracts).
3. Implement error taxonomy and validation guards.
4. Implement micro-kernel plugin hook execution model.

## Phase 2: Core Engine

5. Implement parser layer (`html`, `text`, `url`) with zero dependencies.
6. Implement tokenization and context builder.
7. Implement rule registry with built-in + custom rule registration.
8. Implement built-in 107-rule distribution by category.
9. Implement scorer with profile-weighted aggregation and grade mapping.
10. Implement `createSeoAnalyzer`, `analyzeSync`, `addRule`, `use`.

## Phase 3: Advanced Core

11. Implement depth scoping (`quick`, `standard`, `full`).
12. Implement selective category allow-list.
13. Implement batch methods (`analyzeBatchSync`, `analyzeBatch`).
14. Implement compare utilities (`diff`, `trend`, `benchmark`).
15. Implement JSON/Markdown/HTML/CSV formatters.

## Phase 4: AI Layer

16. Implement fetch-based OpenAI-compatible client.
17. Implement weighted score merger and fallback policy.
18. Implement AI timeout handling and parsing guards.
19. Add provider presets module.
20. Add AI orchestration strategy module.

## Phase 5: Documentation and DX

21. Expand README with architecture, API, examples, and status.
22. Maintain concise `llms.txt` for LLM-native usage.
23. Expand examples by feature category.
24. Keep SPECIFICATION/IMPLEMENTATION/TASKS aligned with shipped code.

## Phase 6: Verification

25. Run `npm run test`.
26. Run `npm run test:coverage`.
27. Run `npm run typecheck`.
28. Run `npm run build`.
29. Enforce zero runtime dependency and publishable package output.
