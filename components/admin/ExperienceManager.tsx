"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkExperience, MediaAsset } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";
import { Field, inputCls } from "./Field";

const EMPTY = { title: "", desc: "", thumbnail: "", order: 0 };

export function ExperienceManager({ initialItems }: { initialItems: WorkExperience[] }) {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WorkExperience | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(item: WorkExperience) {
    setEditing(item);
    setForm({
      title: item.title,
      desc: item.desc,
      thumbnail: item.thumbnail,
      order: item.order,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.desc.trim()) { toast.error("Description is required."); return; }
    if (!form.thumbnail.trim()) { toast.error("Logo/thumbnail is required."); return; }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        desc: form.desc.trim(),
        thumbnail: form.thumbnail.trim(),
        order: form.order,
      };

      const url = editing ? `/api/admin/experience/${editing.id}` : "/api/admin/experience";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      toast.success(editing ? "Experience updated." : "Experience added.");

      if (editing) {
        setItems((prev) => prev.map((i) => (i.id === editing.id ? data.data : i)));
      } else {
        setItems((prev) => [...prev, data.data].sort((a, b) => a.order - b.order));
      }

      closeForm();
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Entry deleted.");
      router.refresh();
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Work Experience</h1>
          <p className="text-white-100 text-sm mt-1">
            {items.length} {items.length === 1 ? "entry" : "entries"} · displayed with animated moving borders
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-purple hover:opacity-90 text-black-100 text-sm font-semibold transition-opacity"
        >
          + Add entry
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-center py-16 text-white-200 border border-dashed border-black-300 rounded-2xl">
            No experience entries yet.
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-black-200 border border-black-300 rounded-2xl p-4 hover:border-purple/30 transition-colors"
          >
            {/* Logo */}
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#04071d] flex items-center justify-center p-2">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
              ) : (
                <span className="text-white-200 text-xs">No logo</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-white-100 line-clamp-1">{item.desc}</p>
              <span className="text-xs text-white-200 font-mono">order: {item.order}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEdit(item)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white-100 hover:text-white hover:bg-black-100 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id, item.title)}
                disabled={deleting === item.id}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white-200 hover:text-red-400 hover:bg-red-400/5 transition-all disabled:opacity-40"
              >
                {deleting === item.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative min-h-screen flex items-start justify-center p-4 pt-12">
            <div className="relative w-full max-w-xl bg-black-100 border border-black-300 rounded-2xl p-8 mb-12 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">
                {editing ? "Edit experience entry" : "New experience entry"}
              </h2>

              <div className="space-y-5">
                <Field
                  label="Title *"
                  hint='e.g. "Senior Full-Stack Developer @ Acme Corp"'
                >
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={inputCls}
                    placeholder="Senior Full-Stack Developer @ Company"
                  />
                </Field>

                <Field label="Description *">
                  <textarea
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    rows={4}
                    className={inputCls}
                    placeholder="What you built, led, or achieved in this role"
                  />
                </Field>

                <Field label="Company logo * (Firebase Storage URL or upload below)">
                  <input
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    className={cn(inputCls, "mb-3")}
                    placeholder="https://storage.googleapis.com/..."
                  />
                  <FileUpload
                    folder="logos"
                    accept={{
                      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".svg"],
                    }}
                    onUpload={(asset: MediaAsset) =>
                      setForm({ ...form, thumbnail: asset.url })
                    }
                    label="Upload company logo"
                  />
                  {form.thumbnail && (
                    <div className="mt-2 w-24 h-24 rounded-xl bg-[#04071d] flex items-center justify-center p-3">
                      <img
                        src={form.thumbnail}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </Field>

                <Field label="Display order" hint="Lower numbers appear first">
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className={cn(inputCls, "w-32")}
                    min={0}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-black-300">
                <button
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg text-sm text-white-100 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-purple hover:opacity-90 text-black-100 text-sm font-semibold transition-opacity disabled:opacity-50"
                >
                  {saving ? "Saving…" : editing ? "Save changes" : "Add entry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
