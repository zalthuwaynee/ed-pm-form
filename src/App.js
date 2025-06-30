import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// --- Subcontractor Template ---
const emptySubcontractor = {
  company: "",
  contractNumber: "",
  subAdminName: "",
  subAdminEmail: "",
  subcontractType: "New",
  optOutReason: "",
  invoiceDate: "",
};

// --- Subcontractor Fields ---
function SubcontractorFields({ value, onChange, onDelete, showDelete, idx }) {
  return (
    <div className="flex flex-col items-center w-full mb-4 border-b border-blue-100 pb-2 last:border-b-0">
      <div className="mb-2 flex flex-col items-center w-full">
        <label className="block text-blue-700 font-semibold mb-1 text-xs tracking-wide">
          Subcontractor Company
        </label>
        <input
          type="text"
          className="w-full md:w-2/3 border border-blue-200 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none text-center text-sm"
          value={value.company}
          onChange={e => onChange("company", e.target.value)}
          required
        />
      </div>
      <div className="flex flex-row gap-3 justify-center w-full">
        <div className="flex flex-col w-40">
          <label className="text-blue-700 font-semibold mb-0.5 text-xs">1. Contract Number</label>
          <input
            type="text"
            className="border border-blue-200 rounded-md px-2 py-1 text-sm"
            value={value.contractNumber}
            onChange={e => onChange("contractNumber", e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col w-40">
          <label className="text-blue-700 font-semibold mb-0.5 text-xs">2. Sub Admin Name</label>
          <input
            type="text"
            className="border border-blue-200 rounded-md px-2 py-1 text-sm"
            value={value.subAdminName}
            onChange={e => onChange("subAdminName", e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col w-48">
          <label className="text-blue-700 font-semibold mb-0.5 text-xs">3. Sub Admin Email Address</label>
          <input
            type="email"
            className="border border-blue-200 rounded-md px-2 py-1 text-sm"
            value={value.subAdminEmail}
            onChange={e => onChange("subAdminEmail", e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col w-44">
          <label className="text-blue-700 font-semibold mb-0.5 text-xs">Subcontractor Status</label>
          <select
            className="border border-blue-200 rounded-md px-2 py-1 text-sm"
            value={value.subcontractType}
            onChange={e => onChange("subcontractType", e.target.value)}
          >
            <option value="New">New</option>
            <option value="Existing">Existing</option>
            <option value="Opt Out">Opt Out</option>
          </select>
        </div>
        <div className="flex flex-col w-44">
          <label className="text-blue-700 font-semibold mb-0.5 text-xs">Expected Invoice Date</label>
          <input
            type="date"
            className="border border-blue-200 rounded-md px-2 py-1 text-sm"
            value={value.invoiceDate}
            onChange={e => onChange("invoiceDate", e.target.value)}
            required={value.subcontractType !== "Opt Out"}
            disabled={value.subcontractType === "Opt Out"}
          />
        </div>
        {showDelete && (
          <div className="flex flex-col justify-end h-full ml-2">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-red-100 transition"
              onClick={onDelete}
              title="Delete Subcontractor"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {/* Conditionally show reason for opting out */}
      {value.subcontractType === "Opt Out" && (
        <div className="flex flex-col w-1/2 mt-2">
          <label className="text-blue-700 font-semibold mb-1 text-xs">Reason for opting out?</label>
          <input
            type="text"
            className="border border-blue-200 rounded-md px-2 py-1 text-sm"
            value={value.optOutReason}
            onChange={e => onChange("optOutReason", e.target.value)}
            required
          />
        </div>
      )}
    </div>
  );
}

// --- Subcontractor Summary (unchanged) ---
function SubcontractorSummary({ sub, expanded, onExpand, onDelete, idx }) {
  return (
    <div className="flex items-center bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-2 mb-2 shadow-sm text-sm">
      <button
        className="focus:outline-none mr-2"
        onClick={() => onExpand(idx)}
        title={expanded ? "Collapse" : "Expand"}
      >
        {expanded ? (
          <span className="text-lg font-bold text-blue-700">−</span>
        ) : (
          <span className="text-lg font-bold text-blue-700">+</span>
        )}
      </button>
      <span className="flex-1 truncate">
        <span className="font-medium text-blue-800">{sub.company || "Subcontractor"}</span>
        {" | Contract: "}
        <span className="text-blue-600">{sub.contractNumber || "N/A"}</span>
        {" | Sub Admin: "}
        <span className="text-blue-600">{sub.subAdminName || "N/A"}</span>
      </span>
      <button
        className="ml-2 p-1 rounded-full hover:bg-red-100"
        onClick={onDelete}
        title="Delete Subcontractor"
      >
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// --- Subcontractor List (unchanged) ---
function SubcontractorList({ subcontractors, expandedIdx, setExpandedIdx, onChange, onAdd, onDelete }) {
  return (
    <div className="w-full">
      {subcontractors.map((sub, idx) => (
        <div key={idx}>
          {expandedIdx === idx ? (
            <SubcontractorFields
              value={sub}
              onChange={(field, val) => onChange(idx, field, val)}
              onDelete={() => onDelete(idx)}
              showDelete={subcontractors.length > 1}
              idx={idx}
            />
          ) : (
            <SubcontractorSummary
              sub={sub}
              expanded={expandedIdx === idx}
              idx={idx}
              onExpand={setExpandedIdx}
              onDelete={() => onDelete(idx)}
            />
          )}
        </div>
      ))}
      <div className="flex justify-start">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.05 }}
          className="mt-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-5 py-1.5 rounded-xl shadow font-semibold flex items-center gap-1 text-sm"
          onClick={onAdd}
        >
          <span className="text-base">+</span> Add Subcontractor
        </motion.button>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [projects, setProjects] = useState([]);
  const [expandedProj, setExpandedProj] = useState(null);
  const [expandedSubIdxs, setExpandedSubIdxs] = useState([]);
  const [creatingProject, setCreatingProject] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
  const [newSubs, setNewSubs] = useState([{ ...emptySubcontractor }]);
  const [newSubExpanded, setNewSubExpanded] = useState(0);

  // PDF & Modal
  const [showSubmitOptions, setShowSubmitOptions] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const pdfRef = useRef();

  // Subcontractor handlers for new project
  const handleNewSubChange = (idx, field, val) => {
    setNewSubs(prev => prev.map((sub, i) =>
      i === idx ? { ...sub, [field]: val } : sub
    ));
  };
  const handleNewSubAdd = () => {
    setNewSubs(prev => [...prev, { ...emptySubcontractor }]);
    setNewSubExpanded(newSubs.length); // Expand the new blank
  };
  const handleNewSubDelete = (idx) => {
    setNewSubs(prev => prev.filter((_, i) => i !== idx));
    if (newSubExpanded === idx) setNewSubExpanded(null);
    else if (newSubExpanded > idx) setNewSubExpanded(newSubExpanded - 1);
  };

  // Create project
  const handleSubmitProject = (e) => {
    e.preventDefault();
    setProjects(prev => [
      ...prev,
      {
        name: newProjectName,
        subcontractors: newSubs
      }
    ]);
    setExpandedProj(projects.length);
    setExpandedSubIdxs(prev => [...prev, 0]); // first sub is open for new project
    setCreatingProject(false);
    setNewProjectName("");
    setNewSubs([{ ...emptySubcontractor }]);
    setNewSubExpanded(0);
  };

  // Project-level subcontractor handlers
  const handleProjSubChange = (projIdx, subIdx, field, val) => {
    setProjects(prev => prev.map((proj, i) =>
      i === projIdx
        ? {
            ...proj,
            subcontractors: proj.subcontractors.map((sub, j) =>
              j === subIdx ? { ...sub, [field]: val } : sub
            ),
          }
        : proj
    ));
  };
  const handleProjSubAdd = projIdx => {
    setProjects(prev => prev.map((proj, i) =>
      i === projIdx
        ? {
            ...proj,
            subcontractors: [
              ...proj.subcontractors,
              { ...emptySubcontractor }
            ],
          }
        : proj
    ));
    setExpandedSubIdxs(prev => {
      const arr = [...prev];
      arr[projIdx] = projects[projIdx].subcontractors.length; // expand the new one
      return arr;
    });
  };
  const handleProjSubDelete = (projIdx, subIdx) => {
    setProjects(prev => prev.map((proj, i) =>
      i === projIdx
        ? {
            ...proj,
            subcontractors: proj.subcontractors.filter((_, j) => j !== subIdx)
          }
        : proj
    ));
    setExpandedSubIdxs(prev => {
      const arr = [...prev];
      if (arr[projIdx] === subIdx) arr[projIdx] = null;
      else if (arr[projIdx] > subIdx) arr[projIdx]--;
      return arr;
    });
  };
  const handleDeleteProject = idx => {
    setProjects(prev => prev.filter((_, i) => i !== idx));
    setExpandedSubIdxs(prev => prev.filter((_, i) => i !== idx));
    if (expandedProj === idx) setExpandedProj(null);
    else if (expandedProj > idx) setExpandedProj(expandedProj - 1);
  };

  // Add project (after first)
  const handleAddProject = () => {
    setCreatingProject(true);
    setNewProjectName("");
    setNewSubs([{ ...emptySubcontractor }]);
    setNewSubExpanded(0);
  };

  // --- PDF Download ---
  const handleDownloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 1.2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('project-migration-form.pdf');
  };

  // --- Submit to Support (stub, needs backend!) ---
  const handleSubmitToSupport = async () => {
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 2500);
    // Here, you would POST the projects to a backend that emails the link+PDF to support
    // Example: await fetch('/api/submit', { method: 'POST', body: JSON.stringify({ projects }) })
    // and handle email logic in the backend (Node.js, Python, Zapier, etc.)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center py-8 px-2">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-8 mt-2 drop-shadow">
        PM Project Migration
      </h1>
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8">
          <div ref={pdfRef}>
            {/* --- Existing Projects --- */}
            {projects.map((project, idx) => (
              <ProjectCard
                key={idx}
                project={project}
                idx={idx}
                expanded={expandedProj}
                setExpanded={setExpandedProj}
                onSubChange={handleProjSubChange}
                onSubAdd={handleProjSubAdd}
                onSubDelete={handleProjSubDelete}
                onDeleteProject={projects.length > 1 ? handleDeleteProject : null}
                expandedSubIdxs={expandedSubIdxs}
                setExpandedSubIdxs={setExpandedSubIdxs}
              />
            ))}

            {/* --- New Project Form --- */}
            {creatingProject && (
              <form
                onSubmit={handleSubmitProject}
                className="flex flex-col items-center px-2 py-4 gap-2 w-full mt-2"
              >
                <div className="flex flex-row items-center justify-center gap-2 w-full mb-2">
                  <label className="font-medium text-blue-800 text-sm">Project Name</label>
                  <input
                    className="border border-blue-200 rounded-lg px-4 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    style={{ minWidth: "200px" }}
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    required
                  />
                </div>
                <SubcontractorList
                  subcontractors={newSubs}
                  expandedIdx={newSubExpanded}
                  setExpandedIdx={setNewSubExpanded}
                  onChange={handleNewSubChange}
                  onAdd={handleNewSubAdd}
                  onDelete={handleNewSubDelete}
                />
                <div className="flex justify-center w-full mt-2">
                  <motion.button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl transition text-sm flex items-center justify-center"
                    whileTap={{ scale: 0.94 }}
                  >
                    Submit Project
                  </motion.button>
                </div>
              </form>
            )}
          </div>

          {/* --- Add Project Button --- */}
          {!creatingProject && (
            <div className="flex justify-center mt-6">
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-2 rounded-2xl shadow-xl text-sm"
                onClick={handleAddProject}
              >
                + Add Project
              </motion.button>
            </div>
          )}

          {/* --- Big Submit Form Button --- */}
          <div className="flex justify-center mt-10">
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.05 }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-xl"
              onClick={() => setShowSubmitOptions(true)}
            >
              Submit Form
            </motion.button>
          </div>

          {/* --- Modal for PDF/Support --- */}
          <AnimatePresence>
            {showSubmitOptions && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-5"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                >
                  <h2 className="text-xl font-bold mb-2 text-blue-800">Export or Send Your Submission</h2>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.04 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow"
                    onClick={handleDownloadPDF}
                  >
                    Download as PDF
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.04 }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow"
                    onClick={handleSubmitToSupport}
                  >
                    Submit to Support
                  </motion.button>
                  <button className="mt-2 text-blue-700 underline" onClick={() => setShowSubmitOptions(false)}>
                    Cancel
                  </button>
                  {submitSuccess && (
                    <div className="text-green-700 font-bold mt-2">Form sent to support (stub)!<br />Implement backend for real email sending.</div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Project Card (unchanged from last version, paste your existing component here) ---
function ProjectCard({
  project,
  idx,
  expanded,
  setExpanded,
  onSubChange,
  onSubAdd,
  onSubDelete,
  onDeleteProject,
  expandedSubIdxs,
  setExpandedSubIdxs
}) {
  // ...Paste your last ProjectCard code from above...
  // It hasn't changed.
  return (
    <motion.div
      layout
      className="w-full max-w-5xl mb-4 mx-auto"
      initial={false}
      animate={{ boxShadow: expanded ? "0 8px 32px 0 rgba(0,88,255,0.07)" : "none" }}
    >
      <div className="flex items-center bg-blue-50 rounded-xl p-3 shadow cursor-pointer">
        <button
          className="focus:outline-none mr-2"
          tabIndex={-1}
          onClick={e => {
            e.stopPropagation();
            setExpanded(expanded === idx ? null : idx);
          }}
        >
          {expanded === idx ? (
            <span className="text-xl font-bold text-blue-700">−</span>
          ) : (
            <span className="text-xl font-bold text-blue-700">+</span>
          )}
        </button>
        <span
          className="font-semibold text-blue-800 text-base flex-1"
          onClick={() => setExpanded(expanded === idx ? null : idx)}
        >
          {project.name || "Untitled Project"}
        </span>
        {onDeleteProject && (
          <button
            className="ml-3 p-2 rounded-full hover:bg-red-100"
            onClick={() => onDeleteProject(idx)}
            title="Delete Project"
          >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <AnimatePresence>
        {expanded === idx && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-4 mt-2"
            layout
          >
            <SubcontractorList
              subcontractors={project.subcontractors}
              expandedIdx={expandedSubIdxs[idx]}
              setExpandedIdx={subIdx => setExpandedSubIdxs(prev => {
                const arr = [...prev];
                arr[idx] = arr[idx] === subIdx ? null : subIdx;
                return arr;
              })}
              onChange={(subIdx, field, val) => onSubChange(idx, subIdx, field, val)}
              onAdd={() => onSubAdd(idx)}
              onDelete={subIdx => onSubDelete(idx, subIdx)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
