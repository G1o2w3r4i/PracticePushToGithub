import { useState } from "react";
import AddIssueModal, { IssueFormData } from "./components/AddIssueModal";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [savedIssue, setSavedIssue] = useState<IssueFormData | null>(null);

  const handleSave = (data: IssueFormData) => {
    // TODO: wire this to your Power Apps connector / Dataverse call, e.g.:
    // await IssuesService.CreateIssue.run(data)
    console.log("Issue saved:", data);
    setSavedIssue(data);
    setIsOpen(false);
  };

  return (
    <div className="app-shell">
      <div className="app-shell-bg">
        <button className="open-btn" onClick={() => setIsOpen(true)}>
          + Add Issue
        </button>
        {savedIssue && (
          <pre className="debug-output">{JSON.stringify(savedIssue, null, 2)}</pre>
        )}
      </div>

      {isOpen && (
        <AddIssueModal
          onCancel={() => setIsOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
