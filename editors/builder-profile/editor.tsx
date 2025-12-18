import { TextInput, Textarea } from "@powerhousedao/document-engineering";
import { User, Users, Settings, FileText, Copy, Info } from "lucide-react";
import {
  toast,
  ToastContainer,
  DocumentToolbar,
} from "@powerhousedao/design-system/connect";
import { actions } from "../../document-models/builder-profile/index.js";
import { useCallback, useEffect, useRef } from "react";
import { useSelectedBuilderProfileDocument } from "../../document-models/builder-profile/hooks.js";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
} from "@powerhousedao/reactor-browser";
import type {
  BuilderSkill,
  BuilderScope,
  BuilderStatus,
  TeamType,
} from "../../document-models/builder-profile/gen/types.js";
import { SkillsSection } from "./components/SkillsSection.js";
import { ScopesSection } from "./components/ScopesSection.js";
import { LinksSection } from "./components/LinksSection.js";
import { ContributorsSection } from "./components/ContributorsSection.js";
import { ProfilePreview } from "./components/ProfilePreview.js";
import { ImageUrlInput } from "./components/ImageUrlInput.js";
import { MarkdownEditor } from "./components/markdown-editor.js";

const STATUS_OPTIONS: {
  value: BuilderStatus;
  label: string;
  color: string;
}[] = [
  { value: "ACTIVE", label: "Active", color: "bg-emerald-500" },
  { value: "INACTIVE", label: "Inactive", color: "bg-slate-400" },
  { value: "ON_HOLD", label: "On Hold", color: "bg-amber-500" },
  { value: "COMPLETED", label: "Completed", color: "bg-sky-500" },
  { value: "ARCHIVED", label: "Archived", color: "bg-slate-300" },
];

export default function Editor() {
  const [doc, dispatch] = useSelectedBuilderProfileDocument();
  const state = doc?.state.global;

  const parentFolder = useParentFolderForSelectedNode();

  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  const idGeneratedRef = useRef(false);

  // Auto-generate ID if not present (only once)
  useEffect(() => {
    if (!state?.id && !idGeneratedRef.current && dispatch) {
      idGeneratedRef.current = true;
      dispatch(
        actions.updateProfile({
          id: doc.header.id,
        })
      );
    }
  }, [state?.id, dispatch, doc?.header.id]);

  // Format date as "09 DEC 2025 10:52:30"
  const formatLastModified = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  };

  // Generate slug from name
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  // Handle basic profile field changes
  const handleFieldChange = useCallback(
    (field: string, value: string | null) => {
      if (!dispatch) {
        toast(`Failed to update ${field} - no dispatch function`, {
          type: "error",
        });
        return;
      }

      if (field === "name" && value && value.trim()) {
        const slug = generateSlug(value);
        dispatch(actions.updateProfile({ name: value, slug }));
      } else {
        dispatch(actions.updateProfile({ [field]: value }));
      }
    },
    [dispatch, generateSlug]
  );

  // Handle status change
  const handleStatusChange = useCallback(
    (status: BuilderStatus) => {
      if (!dispatch) return;
      dispatch(actions.updateProfile({ status }));
    },
    [dispatch]
  );

  // Handle type change
  const handleTypeChange = useCallback(
    (type: TeamType) => {
      if (!dispatch) return;
      dispatch(actions.updateProfile({ type }));
    },
    [dispatch]
  );

  // Skill handlers
  const handleAddSkill = useCallback(
    (skill: BuilderSkill) => {
      if (!dispatch) return;
      dispatch(actions.addSkill({ skill }));
    },
    [dispatch]
  );

  const handleRemoveSkill = useCallback(
    (skill: BuilderSkill) => {
      if (!dispatch) return;
      dispatch(actions.removeSkill({ skill }));
    },
    [dispatch]
  );

  // Scope handlers
  const handleAddScope = useCallback(
    (scope: BuilderScope) => {
      if (!dispatch) return;
      dispatch(actions.addScope({ scope }));
    },
    [dispatch]
  );

  const handleRemoveScope = useCallback(
    (scope: BuilderScope) => {
      if (!dispatch) return;
      dispatch(actions.removeScope({ scope }));
    },
    [dispatch]
  );

  // Link handlers
  const handleAddLink = useCallback(
    (link: { id: string; url: string; label?: string }) => {
      if (!dispatch) return;
      dispatch(
        actions.addLink({ id: link.id, url: link.url, label: link.label })
      );
    },
    [dispatch]
  );

  const handleEditLink = useCallback(
    (link: { id: string; url: string; label?: string }) => {
      if (!dispatch) return;
      dispatch(
        actions.editLink({ id: link.id, url: link.url, label: link.label })
      );
    },
    [dispatch]
  );

  const handleRemoveLink = useCallback(
    (id: string) => {
      if (!dispatch) return;
      dispatch(actions.removeLink({ id }));
    },
    [dispatch]
  );

  // Contributor handlers
  const handleAddContributor = useCallback(
    (contributorPHID: string) => {
      if (!dispatch) return;
      dispatch(actions.addContributor({ contributorPHID }));
    },
    [dispatch]
  );

  const handleRemoveContributor = useCallback(
    (contributorPHID: string) => {
      if (!dispatch) return;
      dispatch(actions.removeContributor({ contributorPHID }));
    },
    [dispatch]
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <style>
        {`
          .builder-editor input, .builder-editor textarea, .builder-editor select {
            font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .builder-editor .section-card {
            background: white;
            border: 1px solid rgba(0, 0, 0, 0.06);
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02);
            transition: box-shadow 0.2s ease, transform 0.2s ease;
          }
          .builder-editor .section-card:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04);
          }
          .builder-editor .field-label {
            font-size: 0.8125rem;
            font-weight: 600;
            color: #374151;
            letter-spacing: -0.01em;
            margin-bottom: 0.5rem;
            display: block;
          }
          .builder-editor .field-hint {
            font-size: 0.75rem;
            color: #9CA3AF;
            margin-top: 0.375rem;
            letter-spacing: -0.01em;
          }
          .builder-editor .meta-value {
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
            font-size: 0.8125rem;
            color: #6B7280;
            background: #F9FAFB;
            padding: 0.5rem 0.75rem;
            border-radius: 8px;
            border: 1px solid #E5E7EB;
          }
          .builder-editor .type-toggle {
            display: flex;
            background: #F3F4F6;
            border-radius: 10px;
            padding: 4px;
            gap: 4px;
          }
          .builder-editor .type-toggle button {
            flex: 1;
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #6B7280;
            background: transparent;
          }
          .builder-editor .type-toggle button.active {
            background: white;
            color: #111827;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .builder-editor .type-toggle button:not(.active):hover {
            color: #374151;
            background: rgba(255, 255, 255, 0.5);
          }
          .builder-editor .status-select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.75rem center;
            background-repeat: no-repeat;
            background-size: 1.25em 1.25em;
            padding-right: 2.5rem;
          }
        `}
      </style>

      <DocumentToolbar document={doc} onClose={handleClose} />

      <div className="builder-editor p-6 max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="section-card p-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Builder Profile
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Configure your builder identity and capabilities
            </p>
          </div>
        </div>

        {/* Profile Preview */}
        {state && <ProfilePreview state={state} />}

        {/* Metadata Section */}
        <div className="section-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Info size={18} className="text-slate-600" />
            </span>
            Metadata
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Builder ID */}
            <div>
              <label className="field-label">Builder ID</label>
              <div className="flex items-center gap-2">
                <code className="meta-value flex-1 truncate">
                  {doc?.header.id}
                </code>
                <button
                  type="button"
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  title="Copy Builder ID"
                  onClick={() => {
                    void navigator.clipboard.writeText(doc?.header.id || "");
                    toast("Copied Builder ID!", { type: "success" });
                  }}
                >
                  <Copy size={16} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Last Modified */}
            <div>
              <label className="field-label">Last Modified</label>
              <div className="meta-value">
                {state?.lastModified
                  ? formatLastModified(state.lastModified)
                  : "Never modified"}
              </div>
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="section-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <User size={18} className="text-indigo-600" />
            </span>
            Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Builder Name */}
            <div>
              <label className="field-label">Builder Name</label>
              <TextInput
                className="w-full"
                defaultValue={state?.name || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (e.target.value !== state?.name) {
                    handleFieldChange("name", e.target.value);
                  }
                }}
                placeholder="Enter your name or team name"
              />
            </div>

            {/* Code */}
            <div>
              <label className="field-label">Code</label>
              <TextInput
                className="w-full"
                defaultValue={state?.code || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (e.target.value !== state?.code) {
                    handleFieldChange("code", e.target.value);
                  }
                }}
                placeholder="Short identifier"
              />
              <p className="field-hint">Unique code for quick reference</p>
            </div>

            {/* Slug - Full width */}
            <div className="md:col-span-2">
              <label className="field-label">Profile Slug</label>
              <TextInput
                className="w-full"
                value={state?.slug || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleFieldChange("slug", e.target.value);
                }}
                placeholder="your-profile-slug"
              />
              <p className="field-hint">
                Auto-generated from name. Lowercase, hyphens only.
              </p>
            </div>

            {/* Profile Icon */}
            <div className="md:col-span-2">
              <ImageUrlInput
                label="Profile Image"
                value={state?.icon || ""}
                onChange={(value) => handleFieldChange("icon", value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
        </div>

        {/* Status & Type Section */}
        <div className="section-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Settings size={18} className="text-amber-600" />
            </span>
            Status & Type
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="field-label">Current Status</label>
              <select
                className="status-select w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={state?.status || ""}
                onChange={(e) => {
                  if (e.target.value) {
                    handleStatusChange(e.target.value as BuilderStatus);
                  }
                }}
              >
                <option value="" disabled>
                  Select status...
                </option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Type Toggle */}
            <div>
              <label className="field-label">Profile Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  onClick={() => handleTypeChange("INDIVIDUAL")}
                  className={state?.type === "INDIVIDUAL" ? "active" : ""}
                >
                  <span className="flex items-center justify-center gap-2">
                    <User size={16} />
                    Individual
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("TEAM")}
                  className={state?.type === "TEAM" ? "active" : ""}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Users size={16} />
                    Team
                  </span>
                </button>
              </div>
              <p className="field-hint">
                {state?.type === "TEAM"
                  ? "Teams can add contributors to their profile"
                  : "Individual profiles represent a single builder"}
              </p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="section-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <FileText size={18} className="text-emerald-600" />
            </span>
            About
          </h3>

          <div>
            <MarkdownEditor
              label="What is the builder profile about?"
              height={350}
              value={state?.description || ""}
              onChange={() => {}}
              onBlur={(value: string) =>
                handleFieldChange("description", value)
              }
            />
            <p className="field-hint">
              A compelling description helps others understand your capabilities
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <SkillsSection
          skills={state?.skils || []}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
        />

        {/* Scopes Section */}
        <ScopesSection
          scopes={state?.scopes || []}
          onAddScope={handleAddScope}
          onRemoveScope={handleRemoveScope}
        />

        {/* Links Section */}
        <LinksSection
          links={state?.links || []}
          onAddLink={handleAddLink}
          onEditLink={handleEditLink}
          onRemoveLink={handleRemoveLink}
        />

        {/* Contributors Section - Only shown for TEAM type */}
        {state?.type === "TEAM" && (
          <ContributorsSection
            contributors={state.contributors}
            onAddContributor={handleAddContributor}
            onRemoveContributor={handleRemoveContributor}
          />
        )}

        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}
