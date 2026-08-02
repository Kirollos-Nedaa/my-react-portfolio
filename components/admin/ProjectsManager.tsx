"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Project, MediaAsset } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";
import { Field, inputCls } from "./Field";

const EMPTY = {
  title: "",
  des: "",
  img: "",
  iconLists: [] as string[],
  link: "",
  repo: "",
  order: 0,
};

type FormState = typeof EMPTY & { iconInput: string };

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>({ ...EMPTY, iconInput: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, iconInput: "" });
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({
      title: p.title,
      des: p.des,
      img: p.img,
      iconLists: p.iconLists ?? [],
      link: p.link ?? "",
      repo: p.repo ?? "",
      order: p.order,
      iconInput: "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm({ ...EMPTY, iconInput: "" });
  }

  function addIcon() {
    const icon = form.iconInput.trim();
    if (!icon) return;
    if (form.iconLists.includes(icon)) { toast.error("Icon already added."); return; }
    setForm((f) => ({ ...f, iconLists: [...f.iconLists, icon], iconInput: "" }));
  }

  function removeIcon(icon: string) {
    setForm((f) => ({ ...f, iconLists: f.iconLists.filter((i) => i !== icon) }));
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.des.trim()) { toast.error("Description is required."); return; }
    if (!form.img.trim()) { toast.error("Project image is required."); return; }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        des: form.des.trim(),
        img: form.img.trim(),
        iconLists: form.iconLists,
        link: form.link.trim() || undefined,
        repo: form.repo.trim() || undefined,
        order: form.order,
      };

      const url = editing ? `/api/admin/projects/${editing.id}` : "/api/admin/projects";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const fieldErrors = (data?.details?.fieldErrors ?? {}) as Record<
          string,
          string[] | undefined
        >;
        const entry = Object.entries(fieldErrors).find(([, v]) => v?.length);
        throw new Error(
          entry
            ? `${entry[0]}: ${entry[1]![0]}`
            : data.error || "Save failed",
        );
      }

      toast.success(editing ? "Project updated." : "Project created.");

      if (editing) {
        setProjects((prev) => prev.map((p) => (p.id === editing.id ? data.data : p)));
      } else {
        setProjects((prev) => [...prev, data.data].sort((a, b) => a.order - b.order));
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
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted.");
      router.refresh();
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-white-100 text-sm mt-1">{projects.length} total · ordered by display order field</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-purple hover:opacity-90 text-black-100 text-sm font-semibold transition-opacity"
        >
          + Add project
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="text-center py-16 text-white-200 border border-dashed border-black-300 rounded-2xl">
            No projects yet. Add your first one above.
          </div>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 bg-black-200 border border-black-300 rounded-2xl p-4 hover:border-purple/30 transition-colors"
          >
            {/* Thumbnail */}
            <div
              className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
              style={{ backgroundColor: "#13162D" }}
            >
              {p.img ? (
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white-200 text-xs">No img</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{p.title}</h3>
              <p className="text-sm text-white-100 truncate">{p.des}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white-200 font-mono">order: {p.order}</span>
                {p.iconLists?.length > 0 && (
                  <span className="text-xs text-white-200">· {p.iconLists.length} icons</span>
                )}
                {p.link && <span className="text-xs text-purple">· live</span>}
                {p.repo && <span className="text-xs text-white-200">· github</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEdit(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white-100 hover:text-white hover:bg-black-100 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id, p.title)}
                disabled={deleting === p.id}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white-200 hover:text-red-400 hover:bg-red-400/5 transition-all disabled:opacity-40"
              >
                {deleting === p.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeForm}
          />
          <div className="relative min-h-screen flex items-start justify-center p-4 pt-12">
            <div className="relative w-full max-w-2xl bg-black-100 border border-black-300 rounded-2xl p-8 mb-12 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">
                {editing ? `Edit: ${editing.title}` : "New project"}
              </h2>

              <div className="space-y-5">
                <Field label="Title *">
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={inputCls}
                    placeholder="E-commerce Platform"
                  />
                </Field>

                <Field label="Description *" hint="Shown on the project card (2 lines max)">
                  <textarea
                    value={form.des}
                    onChange={(e) => setForm({ ...form, des: e.target.value })}
                    rows={2}
                    className={inputCls}
                    placeholder="A brief description of what this project does"
                  />
                </Field>

                <Field label="Project image * (Firebase Storage URL or upload below)">
                  <input
                    value={form.img}
                    onChange={(e) => setForm({ ...form, img: e.target.value })}
                    className={cn(inputCls, "mb-3")}
                    placeholder="https://storage.googleapis.com/..."
                  />
                  <FileUpload
                    folder="projects"
                    onUpload={(asset: MediaAsset) => setForm({ ...form, img: asset.url })}
                    label="Upload project screenshot"
                  />
                  {form.img && (
                    <div
                      className="mt-2 h-28 rounded-xl overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: "#13162D" }}
                    >
                      <img src={form.img} alt="Preview" className="h-full object-contain" />
                    </div>
                  )}
                </Field>

                {/* Tech icon list */}
                <Field label="Tech icons (URL path e.g. /re.svg or full URL)">
                  <div className="flex gap-2 mb-2">
                    <input
                      value={form.iconInput}
                      onChange={(e) => setForm({ ...form, iconInput: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIcon())}
                      className={cn(inputCls, "flex-1")}
                      placeholder="/re.svg or https://..."
                    />
                    <button
                      type="button"
                      onClick={addIcon}
                      className="px-4 py-2.5 rounded-lg bg-purple/20 hover:bg-purple/30 text-purple text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {form.iconLists.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.iconLists.map((icon) => (
                        <div
                          key={icon}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black-200 border border-black-300 text-xs"
                        >
                          <img src={icon} alt="" className="w-4 h-4 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <span className="text-white-100 max-w-[140px] truncate">{icon}</span>
                          <button
                            onClick={() => removeIcon(icon)}
                            className="text-white-200 hover:text-red-400 transition-colors ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Live demo URL">
                    <input
                      value={form.link}
                      onChange={(e) => setForm({ ...form, link: e.target.value })}
                      className={inputCls}
                      placeholder="https://myproject.com"
                    />
                  </Field>
                  <Field label="GitHub repo URL">
                    <input
                      value={form.repo}
                      onChange={(e) => setForm({ ...form, repo: e.target.value })}
                      className={inputCls}
                      placeholder="https://github.com/Kirollos-Nedaa/..."
                    />
                  </Field>
                </div>

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

              {/* Footer */}
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
                  {saving ? "Saving…" : editing ? "Save changes" : "Create project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
