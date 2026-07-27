"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteConfig, MediaAsset } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";
import { Field, inputCls } from "./Field";

type FormState = Omit<SiteConfig, "id" | "updatedAt">;

const DEFAULTS: FormState = {
  heroName: "Kirollos",
  heroTagline: "Full-Stack Developer based in Egypt.",
  heroDescription: "Transforming Concepts into Seamless User Experiences",
  email: "kirollosnedaa@gmail.com",
  githubUrl: "https://github.com/Kirollos-Nedaa",
  linkedinUrl: "https://www.linkedin.com/in/kirollos-nedaa/",
  whatsappLink: "https://wa.me/201094959678",
  cvUrl: "/CV - Kirollos Nedaa.pdf",
};

export function SiteConfigEditor({ initialConfig }: { initialConfig: SiteConfig | null }) {
  const [form, setForm] = useState<FormState>(
    initialConfig
      ? {
          heroName: initialConfig.heroName,
          heroTagline: initialConfig.heroTagline,
          heroDescription: initialConfig.heroDescription,
          email: initialConfig.email,
          githubUrl: initialConfig.githubUrl,
          linkedinUrl: initialConfig.linkedinUrl,
          whatsappLink: initialConfig.whatsappLink,
          cvUrl: initialConfig.cvUrl ?? "",
        }
      : DEFAULTS
  );
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast.success("Settings saved. Live on the portfolio within 60 seconds.");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="text-white-100 text-sm mt-1">
          Changes go live within 60 seconds — no rebuild, no redeploy.
        </p>
      </div>

      <div className="space-y-6">
        {/* Hero */}
        <fieldset className="bg-black-200 border border-black-300 rounded-2xl p-6 space-y-4">
          <legend className="text-xs font-mono text-purple uppercase tracking-widest px-1 -mt-9 bg-black-200 rounded">
            Hero section
          </legend>

          <Field label="Your name" hint="Appears as: Hi! I'm [name]">
            <input
              value={form.heroName}
              onChange={(e) => setForm({ ...form, heroName: e.target.value })}
              className={inputCls}
              placeholder="Kirollos"
            />
          </Field>

          <Field label="Tagline" hint='Appears after your name: a [tagline]'>
            <input
              value={form.heroTagline}
              onChange={(e) => setForm({ ...form, heroTagline: e.target.value })}
              className={inputCls}
              placeholder="Full-Stack Developer based in Egypt."
            />
          </Field>

          <Field label="Hero description" hint="Large animated text at the top of the hero">
            <textarea
              value={form.heroDescription}
              onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
              rows={2}
              className={inputCls}
              placeholder="Transforming Concepts into Seamless User Experiences"
            />
          </Field>
        </fieldset>

        {/* CV */}
        <fieldset className="bg-black-200 border border-black-300 rounded-2xl p-6 space-y-4">
          <legend className="text-xs font-mono text-purple uppercase tracking-widest px-1 -mt-9 bg-black-200 rounded">
            CV / Resume
          </legend>

          <Field label="CV URL" hint="Paste a Firebase Storage URL or upload a new PDF below">
            <input
              value={form.cvUrl}
              onChange={(e) => setForm({ ...form, cvUrl: e.target.value })}
              className={cn(inputCls, "mb-3")}
              placeholder="https://storage.googleapis.com/..."
            />
            <FileUpload
              folder="documents"
              accept={{ "application/pdf": [".pdf"] }}
              maxSizeMB={10}
              onUpload={(asset: MediaAsset) => setForm({ ...form, cvUrl: asset.url })}
              label="Upload new CV PDF (max 10 MB)"
            />
            {form.cvUrl && (
              <p className="text-xs text-purple mt-2 truncate">✓ {form.cvUrl}</p>
            )}
          </Field>
        </fieldset>

        {/* Contact & Social */}
        <fieldset className="bg-black-200 border border-black-300 rounded-2xl p-6 space-y-4">
          <legend className="text-xs font-mono text-purple uppercase tracking-widest px-1 -mt-9 bg-black-200 rounded">
            Contact & social links
          </legend>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputCls}
              placeholder="kirollosnedaa@gmail.com"
            />
          </Field>

          <Field label="GitHub URL">
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className={inputCls}
              placeholder="https://github.com/Kirollos-Nedaa"
            />
          </Field>

          <Field label="LinkedIn URL">
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              className={inputCls}
              placeholder="https://www.linkedin.com/in/kirollos-nedaa/"
            />
          </Field>

          <Field label="WhatsApp link">
            <input
              value={form.whatsappLink}
              onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
              className={inputCls}
              placeholder="https://wa.me/201094959678"
            />
          </Field>
        </fieldset>
      </div>

      {/* Save */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2.5 rounded-xl bg-purple hover:opacity-90 text-black-100 text-sm font-semibold transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
