# PromptForge Post-Deployment Lighthouse Comparison

**Target:** `https://www.promptforge.com.ng`  
**Deployment:** `dpl_DH8fwox9o9TXvD4rnodCbq3tk3LA`  
**Routes:** Home, Library, Blog  
**Categories:** Performance and Accessibility

| Route | Previous performance | New performance | Delta | Previous accessibility | New accessibility | Delta | New LCP | New TBT | New CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Home `/` | 49 | 52 | +3 | 100 | 100 | 0 | 6.1 s | 370 ms | 0 |
| Library `/library` | 38 | 54 | **+16** | 93 | 98 | +5 | 5.6 s | 390 ms | 0 |
| Blog `/blog` | 38 | 48 | **+10** | 100 | 100 | 0 | 6.6 s | 480 ms | 0 |

All three live routes returned HTTP 200 before auditing. Library layout shift improved from 0.267 to 0, Blog layout shift improved from 0.266 to 0, and the Library `aria-required-children` audit now passes. Performance results remain lab-sensitive, but all measured route scores improved in this run.
