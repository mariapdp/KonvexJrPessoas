<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Form templates live in src/lib/forms.ts and business rules (visibility, alerts, 360/clima thresholds) in src/lib/rules.ts; data persists in browser localStorage for now — why: single-file source of truth mirroring the Anexos/Moldes.
