# Copy — what's locked and what's placeholder

The source document locks the copy for the first four sections. Everything after that
was written to fill the layout in the same editorial voice, and is **yours to replace**.

Voice, if you want to keep it consistent: plain, specific, slightly understated. It
says what happens rather than selling it. No exclamation marks, no urgency, no
"revolutionise", no ALL-CAPS labels.

---

## Locked — do not reword

| Section | Copy |
|---|---|
| Hero heading | Your medicines. Made simpler. |
| Hero support | Order genuine medicines online or upload your prescription and let us take care of the rest. |
| Hero CTAs | Upload Prescription · Browse Medicines |
| Categories heading | Everything you need, in one place |
| Categories support | From everyday essentials to specialized care, find the medicines and health products you need. |
| Popular heading | Popular medicines |
| Popular support | Everyday essentials, ready when you need them. |
| Popular link | View all medicines → |

---

## Placeholder — replace at will

### Prescription upload — `components/sections/prescription-cta.tsx`
Heading "Have a prescription? Send it over." plus three supporting points (upload
formats, pharmacist check, record kept).

### How It Works — `components/sections/how-it-works.tsx`
Heading "Four steps, and you are done" plus the four step descriptions.

### Trust / Assurance — `components/sections/trust.tsx`
Heading "The boring parts, taken seriously" plus four claims:
licensed and inspected · a pharmacist reads every prescription · cold chain where it
matters · your prescription stays yours.

> ### ⚠️ These four are factual claims, not marketing
> They assert things about your licensing, staffing, cold-chain handling and data
> security. **Every one must be true of your actual pharmacy before you publish**, and
> some are legally meaningful.
>
> In particular: *"Prescriptions are stored encrypted, visible only to the pharmacist
> on your order. Never sold, never shared."* This is **not true of the default
> configuration.** In development, uploads sit on local disk and are served to anyone
> who guesses the URL. You must move file storage to S3 with signed URLs (see the
> production checklist in the root `README.md`) before this sentence is honest.

### Offers — `lib/offers.ts`
Four offers with codes `FIRST15`, `REFILL10` and two automatic ones. Replace with your
real promotions — the codes are display-only here and are **not** yet wired to Medusa
promotions, so a code shown on a card will not actually discount a cart until you
create the matching promotion in the admin.

### Testimonials — `components/sections/testimonials.tsx`
Three quotes attributed to Ananya R. (Bengaluru), Vikram S. (Pune), Meera J. (Chennai).

> **These are invented.** Publishing fabricated customer testimonials is deceptive
> advertising in most jurisdictions. Replace them with real, permissioned quotes or
> remove the section.

### FAQ — `components/sections/faq.tsx`
Six questions: genuine medicines · which need a prescription · what counts as valid ·
delivery time · returns · who can see my prescription. The answers describe a specific
way of operating — check each against how you actually work.

### Final CTA — `components/sections/final-cta.tsx`
"Order it once. Forget about it after that."

### Footer — `components/site/footer.tsx`
Column links, company details, and the legal line. You will need to add your **drug
licence number**, registered address, and the pharmacist-in-charge details if your
jurisdiction requires them displayed.

---

## Kept in sync with the backend — change both together

| Copy | Where | Must match |
|---|---|---|
| "JPG, PNG, WEBP, HEIC or PDF, up to 5 MB" | `prescription-cta.tsx`, `prescription-flow.tsx` | `ALLOWED_MIME_TYPES` and `MAX_PRESCRIPTION_BYTES` in `backend/src/api/` |
| Product names, compositions, pack sizes, prices | `lib/medusa/mock-data.ts` | `backend/src/scripts/seed.ts` — see the pinned table in `CONTRACT.md` |

> This bit an earlier pass: the UI advertised 10 MB while the server rejected anything
> over 5 MB, so a valid-looking upload failed with no explanation. If you change one
> side, change the other.
