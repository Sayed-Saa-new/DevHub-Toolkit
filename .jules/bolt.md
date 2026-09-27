## 2026-03-30 - Pre-index static search collections to avoid keystroke string allocations

**Learning:** In client-side tool discovery interfaces, filter functions executed on every keystroke (`searchTools`) often construct template literals, perform array operations (`keywords.join(" ")`), and call `.toLowerCase()` dynamically across the entire collection. When searching static datasets, this creates repeated memory allocations and garbage collection pressure on every keystroke.
**Action:** Pre-index static dataset search strings into lowercased haystacks at module scope (`SEARCH_INDEX`). On query execution, filter directly against the pre-computed haystacks to achieve ~10x evaluation speedups and zero array/string allocations per item on keystrokes.
## 2026-03-30 - Parallelize batch async tasks using Promise.all

**Learning:** Sequential processing in client-side tools (such as awaiting `imageCompression` inside a `for...of` loop) causes linear $O(N)$ execution scaling. Concurrent execution with `Promise.all` allows web workers and background tasks to process images in parallel ($O(N/C)$ scaling), significantly reducing wall-clock processing time for image compression batches.
**Action:** Replace sequential `for...of` async loops with `Promise.all(ids.map(async ...))` while maintaining functional state updates and per-item `try/catch` error handling.
