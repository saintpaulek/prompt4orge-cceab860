# PromptForge Lighthouse Comparison

**Target:** `https://www.promptforge.com.ng`  
**Audit date:** 17 September 2026  
**Categories:** Performance and Accessibility  
**Routes:** Home, Library, Blog

## Results

| Route | Previous performance | New performance | Previous accessibility | New accessibility | New LCP | New TBT | New CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home `/` | 58 | 49 | 94 | 100 | 6.3 s | 430 ms | 0 |
| Library `/library` | 50 | 38 | 87 | 93 | 5.5 s | 450 ms | 0.267 |
| Blog `/blog` | Not previously audited | 38 | Not previously audited | 100 | 6.5 s | 350 ms | 0.266 |

## Interpretation

Accessibility improved materially on Home, reaching 100, and Blog also reached 100. Library improved from 87 to 93. The mobile zoom restriction and install-prompt role issue no longer appear in the audit results.

The performance scores did not improve in this lab run. Lighthouse recorded faster First Contentful Paint on Home and Library than the prior run, but higher total blocking time and layout shift on the Library and Blog routes. The remaining Library accessibility issue is an `aria-required-children` finding on the prompt access filter: the container uses `role="tablist"` while its children are plain buttons rather than elements with `role="tab"`.

Lab results can vary with server region, cache state, and test timing. The next performance pass should focus on stabilizing Library/Blog layout during loading, reducing main-thread work in the remaining shared bundle, and correcting the access filter semantics.
