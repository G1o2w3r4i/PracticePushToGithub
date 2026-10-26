import { useState, ReactNode } from "react";
import "./AddIssueModal.css";

export interface IssueFormData {
  issueHeader: string;
  originalIssue: string;
  tech: "IT" | "FinOps";
  repeatFinding: "No" | "Yes";
  criticality: "Critical" | "Major" | "Minor";
  soxReportable: "No" | "Yes";
  accountableFunction: string;
  processArea: string;
  issueCauseType: string;
  primaryContact: string;
  secondaryContact: string;
}

interface AIInsights {
  updatedIssueHeader: string;
  rootCause: string;
  impact: string;
  description: string;
  recommendation: string;
}

const initialForm: IssueFormData = {
  issueHeader: "",
  originalIssue: "",
  tech: "IT",
  repeatFinding: "No",
  criticality: "Major",
  soxReportable: "No",
  accountableFunction: "",
  processArea: "",
  issueCauseType: "",
  primaryContact: "",
  secondaryContact: ""
};

const FUNCTION_OPTIONS = ["Engineering", "Finance", "Operations", "Risk & Compliance"];
const PROCESS_AREA_OPTIONS = ["Access Management", "Change Management", "Data Integrity", "Vendor Management"];
const CAUSE_TYPE_OPTIONS = ["Process Gap", "System Error", "Human Error", "Control Design"];
const CONTACT_OPTIONS = ["Alex Johnson", "Priya Nair", "Sam Chen", "Maria Gomez"];

interface Props {
  onCancel: () => void;
  onSave: (data: IssueFormData & { aiInsights?: AIInsights }) => void;
  mode?: "create" | "edit";
  initialData?: Partial<IssueFormData>;
}

export default function AddIssueModal({ onCancel, onSave, mode = "create", initialData }: Props) {
  const [form, setForm] = useState<IssueFormData>({ ...initialForm, ...initialData });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const update = <K extends keyof IssueFormData>(key: K, value: IssueFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  // Issue Header, Original Issue, Tech are mandatory. Tech always has a
  // default value from the pill selector, so the check mainly guards
  // Issue Header / Original Issue being left blank.
  const validateRequired = (): boolean => {
    const nextErrors: Record<string, boolean> = {
      issueHeader: !form.issueHeader.trim(),
      originalIssue: !form.originalIssue.trim(),
      tech: !form.tech
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleGenerate = () => {
    if (!validateRequired()) return;
    setIsGenerating(true);
    // TODO: replace with your real AI/Power Automate flow call, e.g.
    // const result = await IssueAIService.Synthesize.run(form);
    setTimeout(() => {
      setAiInsights({
        updatedIssueHeader: `AI Refined Finding v2 in System`,
        rootCause:
          "Enhanced Root Cause Analysis: Systemic telemetry & gain offset in production line exacerbated by legacy control override parameters under IT scope.",
        impact:
          "Escalated operational risk variance: Criticality level " +
          form.criticality +
          " with high potential compliance excursion impact.",
        description: `Detailed AI synthesized observation v2 for ${form.processArea || "process area"}.`,
        recommendation:
          "1. Enforce automated SHA-256 log checksums across process area.\n2. Mandate MFA override approval for Tech Lead.\n3. Schedule quarterly recalibration audits."
      });
      setIsGenerating(false);
    }, 900);
  };

  const handleSave = () => {
    if (!validateRequired()) return;
    onSave({ ...form, aiInsights: aiInsights ?? undefined });
  };

  const showAIPanel = aiInsights !== null;

  return (
    <div className="aim-overlay" role="dialog" aria-modal="true">
      <div className={`aim-modal ${showAIPanel ? "aim-modal--wide" : ""}`}>
        <div className="aim-header">
          <h2>{mode === "edit" ? "Edit Issue" : "Add Issue"}</h2>
          <button className="aim-close" onClick={onCancel} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="aim-body">
          {/* ---------- LEFT / MAIN FORM ---------- */}
          <div className="aim-form-col">
            {/* 1. Issue Header */}
            <Field label="Issue Header" required error={errors.issueHeader}>
              <input
                type="text"
                placeholder="Enter issue header..."
                value={form.issueHeader}
                onChange={(e) => update("issueHeader", e.target.value)}
                className={errors.issueHeader ? "aim-error" : ""}
              />
            </Field>

            {/* 2. Original Issue */}
            <Field label="Original Issue" required error={errors.originalIssue}>
              <textarea
                placeholder="Enter original finding text..."
                value={form.originalIssue}
                onChange={(e) => update("originalIssue", e.target.value)}
                className={errors.originalIssue ? "aim-error" : ""}
              />
            </Field>

            {/* 3. Tech | Repeat Finding */}
            <div className="aim-row">
              <Field label="Tech" required error={errors.tech}>
                <PillGroup
                  options={["IT", "FinOps"]}
                  value={form.tech}
                  onChange={(v) => update("tech", v as IssueFormData["tech"])}
                />
              </Field>
              <Field label="Repeat Finding" required>
                <PillGroup
                  options={["No", "Yes"]}
                  value={form.repeatFinding}
                  onChange={(v) => update("repeatFinding", v as IssueFormData["repeatFinding"])}
                />
              </Field>
            </div>

            {/* 4. Criticality (own row) */}
            <Field label="Criticality" required>
              <PillGroup
                options={["Critical", "Major", "Minor"]}
                value={form.criticality}
                onChange={(v) => update("criticality", v as IssueFormData["criticality"])}
                fullWidth
              />
            </Field>

            {/* 5. SOX Reportable | Accountable Function */}
            <div className="aim-row">
              <Field label="SOX Reportable" required>
                <PillGroup
                  options={["No", "Yes"]}
                  value={form.soxReportable}
                  onChange={(v) => update("soxReportable", v as IssueFormData["soxReportable"])}
                />
              </Field>
              <Field label="Accountable Function" required>
                <Select
                  placeholder="Select Function..."
                  value={form.accountableFunction}
                  onChange={(v) => update("accountableFunction", v)}
                  options={FUNCTION_OPTIONS}
                />
              </Field>
            </div>

            {/* Remaining fields, unchanged order */}
            <div className="aim-row">
              <Field label="Process Area" required>
                <Select
                  placeholder="Select Process Area..."
                  value={form.processArea}
                  onChange={(v) => update("processArea", v)}
                  options={PROCESS_AREA_OPTIONS}
                />
              </Field>
              <Field label="Issue Cause Type" required>
                <Select
                  placeholder="Select Cause Type..."
                  value={form.issueCauseType}
                  onChange={(v) => update("issueCauseType", v)}
                  options={CAUSE_TYPE_OPTIONS}
                />
              </Field>
            </div>

            <div className="aim-row">
              <Field label="Primary Business Contact">
                <Select
                  placeholder="Select Primary Contact..."
                  value={form.primaryContact}
                  onChange={(v) => update("primaryContact", v)}
                  options={CONTACT_OPTIONS}
                />
              </Field>
              <Field label="Secondary Business Contact">
                <Select
                  placeholder="Select Secondary Contact..."
                  value={form.secondaryContact}
                  onChange={(v) => update("secondaryContact", v)}
                  options={CONTACT_OPTIONS}
                />
              </Field>
            </div>

            {!showAIPanel && (
              <div className="aim-generate-row">
                <button className="aim-btn aim-btn--generate" onClick={handleGenerate} disabled={isGenerating}>
                  <span className="aim-sparkle">✦</span>
                  {isGenerating ? "Generating..." : "Generate & AI Synthesize"}
                </button>
              </div>
            )}
          </div>

          {/* ---------- RIGHT / AI PANEL ---------- */}
          {showAIPanel && aiInsights && (
            <div className="aim-ai-col">
              <div className="aim-ai-header">
                <h3>
                  <span className="aim-sparkle">✦</span> AI Synthesized Insights
                </h3>
                <button className="aim-btn aim-btn--regenerate" onClick={handleGenerate} disabled={isGenerating}>
                  ⟳ Re-generate with AI
                </button>
              </div>

              <AIField
                label="Updated Issue Header"
                required
                value={aiInsights.updatedIssueHeader}
                onChange={(v) => setAiInsights({ ...aiInsights, updatedIssueHeader: v })}
              />
              <AIField
                label="Root Cause"
                required
                textarea
                value={aiInsights.rootCause}
                onChange={(v) => setAiInsights({ ...aiInsights, rootCause: v })}
              />
              <AIField
                label="Impact"
                required
                textarea
                value={aiInsights.impact}
                onChange={(v) => setAiInsights({ ...aiInsights, impact: v })}
              />
              <AIField
                label="Description"
                required
                textarea
                value={aiInsights.description}
                onChange={(v) => setAiInsights({ ...aiInsights, description: v })}
              />
              <AIField
                label="Recommendation"
                required
                textarea
                rows={5}
                value={aiInsights.recommendation}
                onChange={(v) => setAiInsights({ ...aiInsights, recommendation: v })}
              />
            </div>
          )}
        </div>

        {showAIPanel && (
          <div className="aim-footer">
            <button className="aim-btn aim-btn--cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="aim-btn aim-btn--save" onClick={handleSave}>
              ✓ Save Issue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Reusable sub-components ---------------- */

function Field({
  label,
  required,
  error,
  children
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="aim-field">
      <label>
        {label} {required && <span className="aim-required">*</span>}
      </label>
      {children}
      {error && <span className="aim-error-text">This field is required</span>}
    </div>
  );
}

function PillGroup({
  options,
  value,
  onChange,
  fullWidth
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  fullWidth?: boolean;
}) {
  return (
    <div className={`aim-pill-group ${fullWidth ? "aim-pill-group--full" : ""}`}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            type="button"
            key={opt}
            className={`aim-pill ${active ? "aim-pill--active" : ""}`}
            onClick={() => onChange(opt)}
          >
            <span className="aim-radio-dot">{active ? "●" : "○"}</span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Select({
  placeholder,
  value,
  onChange,
  options
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={value ? "" : "aim-placeholder"}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function AIField({
  label,
  required,
  textarea,
  rows = 3,
  value,
  onChange
}: {
  label: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="aim-field">
      <div className="aim-ai-field-label">
        <label>
          {label} {required && <span className="aim-required">*</span>}
        </label>
        <button type="button" className="aim-add-remark">
          + Add Remark
        </button>
      </div>
      {textarea ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
