import { TextInput, Textarea } from "@powerhousedao/document-engineering";
import { Settings, FileText, Copy, Info, X, Building2 } from "lucide-react";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import { actions } from "document-models/builder-profile";
import type { SetOpHubMemberInput } from "document-models/builder-profile";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelectedBuilderProfileDocument } from "document-models/builder-profile";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
  usePHToast,
} from "@powerhousedao/reactor-browser";
import type {
  BuilderSkill,
  BuilderScope,
  BuilderStatus,
} from "document-models/builder-profile";
import { SkillsSection } from "./components/SkillsSection.js";
import { ScopesSection } from "./components/ScopesSection.js";
import { LinksSection } from "./components/LinksSection.js";
import { ContributorsSection } from "./components/ContributorsSection.js";
import { ProfilePreview } from "./components/ProfilePreview.js";
import { ImageUrlInput } from "./components/ImageUrlInput.js";
import { MarkdownEditor } from "./components/markdown-editor.js";
const operatorIconUrl = "data:image/png;base64,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";

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

const DESCRIPTION_MAX_LENGTH = 350;

export default function Editor() {
  const [doc, dispatch] = useSelectedBuilderProfileDocument();
  const state = doc?.state.global;
  const toast = usePHToast();

  const parentFolder = useParentFolderForSelectedNode();

  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  const idGeneratedRef = useRef(false);
  const [descriptionValue, setDescriptionValue] = useState(
    state?.description || "",
  );
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<boolean | null>(
    null,
  );

  // Sync description state when document changes
  useEffect(() => {
    setDescriptionValue(state?.description || "");
  }, [state?.description]);

  // Auto-generate ID if not present (only once)
  useEffect(() => {
    if (!state?.id && !idGeneratedRef.current && dispatch) {
      idGeneratedRef.current = true;
      dispatch(
        actions.updateProfile({
          id: doc.header.id,
        }),
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
        toast?.(`Failed to update ${field} - no dispatch function`, {
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
    [dispatch, generateSlug],
  );

  // Handle status change
  const handleStatusChange = useCallback(
    (status: BuilderStatus) => {
      if (!dispatch) return;
      dispatch(actions.updateProfile({ status }));
    },
    [dispatch],
  );

  // Skill handlers
  const handleAddSkill = useCallback(
    (skill: BuilderSkill) => {
      if (!dispatch) return;
      dispatch(actions.addSkill({ skill }));
    },
    [dispatch],
  );

  const handleRemoveSkill = useCallback(
    (skill: BuilderSkill) => {
      if (!dispatch) return;
      dispatch(actions.removeSkill({ skill }));
    },
    [dispatch],
  );

  // Scope handlers
  const handleAddScope = useCallback(
    (scope: BuilderScope) => {
      if (!dispatch) return;
      dispatch(actions.addScope({ scope }));
    },
    [dispatch],
  );

  const handleRemoveScope = useCallback(
    (scope: BuilderScope) => {
      if (!dispatch) return;
      dispatch(actions.removeScope({ scope }));
    },
    [dispatch],
  );

  // Link handlers
  const handleAddLink = useCallback(
    (link: { id: string; url: string; label?: string }) => {
      if (!dispatch) return;
      dispatch(
        actions.addLink({ id: link.id, url: link.url, label: link.label }),
      );
    },
    [dispatch],
  );

  const handleEditLink = useCallback(
    (link: { id: string; url: string; label?: string }) => {
      if (!dispatch) return;
      dispatch(
        actions.editLink({ id: link.id, url: link.url, label: link.label }),
      );
    },
    [dispatch],
  );

  const handleRemoveLink = useCallback(
    (id: string) => {
      if (!dispatch) return;
      dispatch(actions.removeLink({ id }));
    },
    [dispatch],
  );

  // Contributor handlers
  const handleAddContributor = useCallback(
    (contributorPHID: string) => {
      if (!dispatch) return;
      dispatch(actions.addContributor({ contributorPHID }));
    },
    [dispatch],
  );

  const handleRemoveContributor = useCallback(
    (contributorPHID: string) => {
      if (!dispatch) return;
      dispatch(actions.removeContributor({ contributorPHID }));
    },
    [dispatch],
  );

  // Operator handler - shows confirmation dialog
  const handleSetOperator = useCallback(
    (isOperator: boolean) => {
      if (!dispatch) return;
      // If trying to change role, show confirmation dialog
      if (state?.isOperator !== isOperator) {
        setPendingRoleChange(isOperator);
        setShowRoleDialog(true);
      }
    },
    [dispatch, state?.isOperator],
  );

  // Operational Hub Member handler
  const handleSetOpHubMember = useCallback(
    (input: SetOpHubMemberInput) => {
      if (!dispatch) return;
      dispatch(actions.setOpHubMember(input));
    },
    [dispatch],
  );

  // Confirm role change after dialog
  const confirmRoleChange = useCallback(() => {
    if (!dispatch || pendingRoleChange === null) return;
    dispatch(actions.setOperator({ isOperator: pendingRoleChange }));
    setShowRoleDialog(false);
    setPendingRoleChange(null);
    toast?.(`Switched to ${pendingRoleChange ? "Operator" : "Builder"} profile`, {
      type: "success",
    });
  }, [dispatch, pendingRoleChange]);

  // Cancel role change
  const cancelRoleChange = useCallback(() => {
    setShowRoleDialog(false);
    setPendingRoleChange(null);
  }, []);

  // Dynamic role label based on isOperator flag
  const roleLabel = state?.isOperator ? "Operator" : "Builder";

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
          .builder-editor .status-select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.75rem center;
            background-repeat: no-repeat;
            background-size: 1.25em 1.25em;
            padding-right: 2.5rem;
          }
          .builder-editor .role-toggle {
            display: flex;
            background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
            border-radius: 12px;
            padding: 3px;
            gap: 3px;
            border: 1px solid rgba(0, 0, 0, 0.06);
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
          }
          .builder-editor .role-toggle button {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 0.5rem 0.875rem;
            font-size: 0.8125rem;
            font-weight: 500;
            border-radius: 9px;
            border: none;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            color: #64748B;
            background: transparent;
            white-space: nowrap;
          }
          .builder-editor .role-toggle button .role-icon {
            font-size: 0.875rem;
            transition: transform 0.2s ease;
          }
          .builder-editor .role-toggle button:hover:not(.active) {
            color: #475569;
            background: rgba(255, 255, 255, 0.6);
          }
          .builder-editor .role-toggle button.active {
            color: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
          }
          .builder-editor .role-toggle button.active.builder {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          }
          .builder-editor .role-toggle button.active.operator {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
          }
          .builder-editor .role-toggle button.active .role-icon {
            transform: scale(1.1);
          }
          .role-dialog-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.2s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .role-dialog {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 700px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease-out;
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .role-dialog-header {
            padding: 2rem 2rem 1.5rem 2rem;
            border-bottom: 1px solid #E5E7EB;
          }
          .role-dialog-content {
            padding: 2rem;
          }
          .role-comparison {
            display: grid;
            gap: 1rem;
            margin-top: 1rem;
          }
          .role-card {
            padding: 1.5rem;
            border: 2px solid #E5E7EB;
            border-radius: 12px;
            background: #F9FAFB;
            transition: all 0.2s ease;
          }
          .role-card.highlight {
            border-color: #3B82F6;
            background: #EFF6FF;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          .role-card-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
          }
          .role-icon-large {
            font-size: 1.5rem;
          }
          .role-features {
            list-style: none;
            padding: 0;
            margin: 1rem 0 0 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .role-features li {
            font-size: 0.875rem;
            color: #475569;
            padding-left: 0;
          }
          .role-dialog-actions {
            padding: 1.5rem 2rem 2rem 2rem;
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            border-top: 1px solid #E5E7EB;
          }
          .dialog-button {
            padding: 0.75rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.9375rem;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
          }
          .dialog-button-cancel {
            background: #F3F4F6;
            color: #374151;
          }
          .dialog-button-cancel:hover {
            background: #E5E7EB;
          }
          .dialog-button-confirm {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          }
          .dialog-button-confirm:hover {
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            transform: translateY(-1px);
          }
        `}
      </style>

      <DocumentToolbar document={doc} onClose={handleClose} />

      <div className="builder-editor p-6 max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header with Role Toggle */}
        <div className="section-card p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                {roleLabel} Team Profile
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Configure your {roleLabel.toLowerCase()} team identity and
                capabilities
              </p>
            </div>

            {/* Role Toggle */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="role-toggle">
                <button
                  type="button"
                  onClick={() => handleSetOperator(false)}
                  className={!state?.isOperator ? "active builder" : ""}
                >
                  <span className="role-icon">🔨</span>
                  Builder
                </button>
                <button
                  type="button"
                  onClick={() => handleSetOperator(true)}
                  className={state?.isOperator ? "active operator" : ""}
                >
                  <img
                    src={operatorIconUrl}
                    alt=""
                    className="role-icon"
                    style={{
                      width: 19,
                      height: 19,
                      filter: state?.isOperator ? "invert(1)" : "none",
                    }}
                  />
                  Operator
                </button>
              </div>
              <p className="text-xs text-slate-400 text-right max-w-[180px]">
                {state?.isOperator ? "Sells & buys services" : "Buys services"}
              </p>
            </div>
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
            {/* Builder/Operator ID */}
            <div>
              <label className="field-label">{roleLabel} ID</label>
              <div className="flex items-center gap-2">
                <code className="meta-value flex-1 truncate">
                  {doc?.header.id}
                </code>
                <button
                  type="button"
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  title={`Copy ${roleLabel} ID`}
                  onClick={() => {
                    void navigator.clipboard.writeText(doc?.header.id || "");
                    toast?.(`Copied ${roleLabel} ID!`, { type: "success" });
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
              <Info size={18} className="text-indigo-600" />
            </span>
            Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Builder/Operator Name */}
            <div>
              <label className="field-label">{roleLabel} Name</label>
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

            {/* Operational Hub Member */}
            <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Building2 size={18} className="text-violet-600" />
                </span>
                <label className="field-label mb-0">
                  Operational Hub Member
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                    Name
                  </label>
                  <TextInput
                    className="w-full"
                    defaultValue={state?.operationalHubMember?.name || ""}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      if (
                        e.target.value !== state?.operationalHubMember?.name
                      ) {
                        handleSetOpHubMember({ name: e.target.value || null });
                      }
                    }}
                    placeholder="Enter hub name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                    PHID
                  </label>
                  <TextInput
                    className="w-full"
                    defaultValue={state?.operationalHubMember?.phid || ""}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      if (
                        e.target.value !== state?.operationalHubMember?.phid
                      ) {
                        handleSetOpHubMember({ phid: e.target.value || null });
                      }
                    }}
                    placeholder="Enter hub PHID"
                  />
                </div>
              </div>
              <p className="field-hint mt-2">
                Link this profile to an operational hub member
              </p>
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
          </div>
        </div>

        {/* Description Section */}
        <div className="section-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <FileText size={18} className="text-emerald-600" />
            </span>
            Description & About
          </h3>

          <div className="space-y-6">
            {/* Short Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="field-label mb-0">Short Description</label>
                <span
                  className={`text-xs font-medium ${
                    descriptionValue.length > DESCRIPTION_MAX_LENGTH
                      ? "text-red-500"
                      : descriptionValue.length > DESCRIPTION_MAX_LENGTH * 0.9
                        ? "text-amber-500"
                        : "text-slate-400"
                  }`}
                >
                  {descriptionValue.length}/{DESCRIPTION_MAX_LENGTH}
                </span>
              </div>
              <Textarea
                className={`w-full ${
                  descriptionValue.length > DESCRIPTION_MAX_LENGTH
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : ""
                }`}
                value={descriptionValue}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setDescriptionValue(e.target.value);
                }}
                onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                  if (e.target.value !== state?.description) {
                    if (e.target.value.length > DESCRIPTION_MAX_LENGTH) {
                      toast?.(
                        `Description exceeds ${DESCRIPTION_MAX_LENGTH} character limit`,
                        { type: "error" },
                      );
                      return;
                    }
                    handleFieldChange("description", e.target.value);
                  }
                }}
                placeholder={`A brief summary of your ${roleLabel.toLowerCase()} profile`}
                rows={3}
                maxLength={DESCRIPTION_MAX_LENGTH + 50}
              />
              {descriptionValue.length > DESCRIPTION_MAX_LENGTH && (
                <p className="text-xs text-red-500 mt-1">
                  Description exceeds {DESCRIPTION_MAX_LENGTH} character limit.
                  Please shorten it to save.
                </p>
              )}
              <p className="field-hint">
                A short, plain-text description shown in previews and listings
              </p>
            </div>

            {/* About (Markdown) */}
            <div>
              <MarkdownEditor
                label="About"
                height={350}
                value={state?.about || ""}
                onChange={() => {}}
                onBlur={(value: string) => handleFieldChange("about", value)}
              />
              <p className="field-hint">
                A detailed description with markdown formatting to showcase your
                capabilities
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <SkillsSection
          skills={state?.skills || []}
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

        {/* Contributors Section */}
        <ContributorsSection
          contributors={state.contributors}
          onAddContributor={handleAddContributor}
          onRemoveContributor={handleRemoveContributor}
        />


        {/* Role Change Confirmation Dialog */}
        {showRoleDialog && (
          <div className="role-dialog-overlay">
            <div className="role-dialog">
              <div className="role-dialog-header relative">
                <h3 className="text-xl font-semibold text-slate-900 pr-8">
                  Switch to {pendingRoleChange ? "Operator" : "Builder"}?
                </h3>
                <button
                  type="button"
                  onClick={cancelRoleChange}
                  className="absolute top-0 right-0 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="role-dialog-content">
                <p className="text-slate-600 mb-4">
                  Before switching, make sure you understand the difference
                  between these roles:
                </p>

                <div className="role-comparison">
                  <div
                    className={`role-card ${!pendingRoleChange ? "highlight" : ""}`}
                  >
                    <div className="role-card-header">
                      <span className="role-icon-large">🔨</span>
                      <h4 className="text-lg font-semibold text-slate-900">
                        Builder
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Connect gives you the tools to run your builder operations
                      effectively. Manage your team members, edit your profile,
                      find work to complete and purchase supporting services.
                    </p>
                    <ul className="role-features">
                      <li>✓ Sign up to services</li>
                      <li>✓ Purchase services from Operators</li>
                      <li>✓ Manage service subscriptions</li>
                    </ul>
                  </div>

                  <div
                    className={`role-card ${pendingRoleChange ? "highlight" : ""}`}
                  >
                    <div className="role-card-header">
                      <img
                        src={operatorIconUrl}
                        alt=""
                        style={{ width: 24, height: 24 }}
                      />
                      <h4 className="text-lg font-semibold text-slate-900">
                        Operator
                      </h4>
                    </div>
                    <ul className="role-features">
                      <li>
                        ✓ Everything that a builder team can do PLUS, you have
                        services to sell to other builders and operators.
                      </li>
                      <li>✓ Create and offer services</li>
                      <li>✓ Sign up to other services</li>
                      <li>✓ Both sell and buy services</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="role-dialog-actions">
                <button
                  type="button"
                  onClick={cancelRoleChange}
                  className="dialog-button dialog-button-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmRoleChange}
                  className="dialog-button dialog-button-confirm"
                >
                  Continue as {pendingRoleChange ? "Operator" : "Builder"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
