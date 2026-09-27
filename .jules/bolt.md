## 2026-03-30 - Parallelize batch async tasks using Promise.all

**Learning:** Sequential processing in client-side tools (such as awaiting `imageCompression` inside a `for...of` loop) causes linear $O(N)$ execution scaling. Concurrent execution with `Promise.all` allows web workers and background tasks to process images in parallel ($O(N/C)$ scaling), significantly reducing wall-clock processing time for image compression batches.
**Action:** Replace sequential `for...of` async loops with `Promise.all(ids.map(async ...))` while maintaining functional state updates and per-item `try/catch` error handling.
