# JOSHWAY Platform — Build Status

*Last updated: July 1, 2026*

## Live URLs

| Resource | URL |
|----------|-----|
| **Production** | https://joshway-platform.vercel.app |
| **GitHub** | https://github.com/AllianceOptimalLLC/joshway-platform |
| **Vercel dashboard** | https://vercel.com/allianceoptimal/joshway-platform |
| **Security report** | `docs/security-review-report.html` (Gmail-copy-friendly tables) |

## What's done

### Infrastructure
- [x] New repo `AllianceOptimalLLC/joshway-platform`
- [x] Vercel project linked to GitHub (auto-deploy on `main`)
- [x] Federated Supabase clients (4 legacy DBs, separate env keys each)
- [x] `.env.example` + local `.env.local` (gitignored)

### Frontend
- [x] Unified shell — sidebar nav, JOSHWAY brand (cyan/purple), Plus Jakarta Sans
- [x] Login gate + demo personas with session persistence
- [x] Role-based `ModuleGuard` (students see Academy+Mission, agents see Connect+Base Camp, etc.)
- [x] All 4 modules with polished UI
- [x] Connect **Kanban + Table** pipeline views
- [x] Live/mock data badges per module
- [x] Email masking for Mission Control live student rows

### Data layer
- [x] **Federated reads** from same Supabase DBs as Lovable apps
- [x] Mock fallback when RLS blocks anon or tables empty
- [x] Live today: Connect stages, Mission `user_progress` + `bridge_programs`
- [x] Mock fallback: Connect contacts (RLS), Academy courses (empty), Base Camp apps (empty)

### Security posture (new build)
- [x] No hardcoded cross-project keys in frontend
- [x] No unsigned admin sessions
- [x] PII masking in Mission preview
- [x] Security review HTML report (25 findings)

## What's NOT done yet

| Item | Notes |
|------|-------|
| **Unified Supabase Auth** | Demo personas only; real SSO is next |
| **Write operations** | Read-only federation preview |
| **Full feature parity** | ~10% of Lovable features ported; shell + core views |
| **Mission Control auth rewrite** | Required before production cutover |
| **DNS** | `platform.joshway.org` not configured |
| **Lovable apps retirement** | Still running in parallel |

## Architecture

```
joshway-platform.vercel.app
├── /login          Demo persona picker
├── /               Role-aware home
├── /academy   ──▶  antkbpprjyrhqhbfwjue (Academy DB)
├── /connect   ──▶  eybpnlmlyzomrrzqzirz (Connect DB)
├── /basecamp  ──▶  rfsbzejgkbrdqzbjhxuu (Base Camp DB)
└── /mission   ──▶  uthunexsjpurvuriipnz (Mission Control DB)
```

Old Lovable apps continue using the **same four databases** — safe parallel operation.

## Try it

1. Open https://joshway-platform.vercel.app
2. Pick **David Chen (admin)** to see all 4 modules
3. Check **Mission Control** — should show **Live DB** badge + real student names
4. Check **Connect** — live pipeline stages, mock contacts (until auth)
5. Switch persona from sidebar footer

## Next session priorities

1. Supabase Auth for `@joshway.org` staff (Google SSO)
2. Port Connect contact detail + authenticated reads
3. Academy course player shell from Lovable `Course.tsx`
4. Mission admin routes behind signed JWT pattern
5. Custom domain + cutover plan