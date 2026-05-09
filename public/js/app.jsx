const rootNode = document.getElementById("root");
const pageNode = document.getElementById("page");
const initialDataNode = document.getElementById("initial-data");

const initialData = (() => {
  try {
    return initialDataNode ? JSON.parse(initialDataNode.textContent || "{}") : {};
  } catch {
    return {};
  }
})();

const page = pageNode?.dataset?.page || "";
const STATUS_OPTIONS = ["applied", "interview", "evaluation", "accepted", "rejected"];

const Navbar = () => (
  <div className="container">
    <div className="card row" style={{ justifyContent: "space-between" }}>
      <div className="row">
        <a href="/dashboard" className="btn btn-soft">Dashboard</a>
        <a href="/candidates" className="btn btn-soft">Candidates</a>
        <a href="/applications" className="btn btn-soft">Applications</a>
        <a href="/apply" className="btn btn-soft">Public Apply</a>
      </div>
      <a href="/auth/logout" className="btn btn-danger">Logout</a>
    </div>
  </div>
);

const AuthPage = ({ title, submitPath, switchPath, switchLabel, includeConfirm, showApplyLink }) => (
  <div className="auth">
    <div className="card">
      <h1 className="title">{title}</h1>
      <p className="muted">HR admins can access candidate and application management.</p>
      <form method="POST" action={submitPath}>
        <label>Email<input name="email" type="email" required /></label>
        <label>Password<input name="password" type="password" minLength={6} required /></label>
        {includeConfirm ? (
          <label>Confirm Password<input name="confirmPassword" type="password" minLength={6} required /></label>
        ) : null}
        <button className="btn btn-primary" type="submit">{title}</button>
      </form>
      <p className="muted">Need another action? <a href={switchPath} className="btn-link">{switchLabel}</a></p>
      {showApplyLink ? (
        <p className="muted">Applicant? <a href="/apply" className="btn-link">Apply for a job</a></p>
      ) : null}
    </div>
  </div>
);

const DashboardPage = () => {
  const stats = initialData.statusStats || [];
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="header">
          <h1 className="title">HR Dashboard</h1>
        </div>
        <div className="grid">
          <div className="card"><h3>Total Candidates</h3><h2>{initialData.totalCandidates || 0}</h2></div>
          <div className="card"><h3>Total Applications</h3><h2>{initialData.totalApplications || 0}</h2></div>
          {stats.map((s) => (
            <div className="card" key={s._id}><h3>{s._id}</h3><h2>{s.count}</h2></div>
          ))}
        </div>
      </div>
    </>
  );
};

const CandidateFormPage = ({ edit }) => {
  const candidate = initialData.candidate || {};
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h1 className="title">{edit ? "Edit Candidate" : "Add Candidate"}</h1>
          <form method="POST" action={edit ? `/candidates/update/${candidate._id}` : "/candidates"}>
            <label>Name<input name="name" defaultValue={candidate.name || ""} required /></label>
            <label>Email<input name="email" type="email" defaultValue={candidate.email || ""} required /></label>
            <label>Phone<input name="phone" defaultValue={candidate.phone || ""} /></label>
            <label>Age<input name="age" type="number" defaultValue={candidate.age || ""} /></label>
            <label>Country<input name="country" defaultValue={candidate.country || ""} /></label>
            <label>Skills (comma separated)<input name="skills" defaultValue={Array.isArray(candidate.skills) ? candidate.skills.join(", ") : ""} /></label>
            <label>About<textarea name="about" defaultValue={candidate.about || ""}></textarea></label>
            <div className="row">
              <button className="btn btn-primary" type="submit">{edit ? "Update Candidate" : "Create Candidate"}</button>
              <a href="/candidates" className="btn btn-soft">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const CandidatesPage = () => {
  const candidates = initialData.candidates || [];
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate and related data?")) return;
    await fetch(`/candidates/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="header">
          <h1 className="title">Candidates</h1>
          <a className="btn btn-primary" href="/candidates/add">Add Candidate</a>
        </div>
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Country</th><th>Actions</th></tr></thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.country || "-"}</td>
                  <td className="row">
                    <a className="btn btn-soft" href={`/candidates/${c._id}`}>View</a>
                    <a className="btn btn-soft" href={`/candidates/edit/${c._id}`}>Edit</a>
                    <button className="btn btn-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const CandidatePage = () => {
  const candidate = initialData.candidate || {};
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <div className="header">
            <h1 className="title">{candidate.name || "Candidate Details"}</h1>
            {initialData.applicationID ? <a className="btn btn-primary" href={`/applications/${initialData.applicationID}`}>View Application</a> : null}
          </div>
          <p><strong>Email:</strong> {candidate.email || "-"}</p>
          <p><strong>Phone:</strong> {candidate.phone || "-"}</p>
          <p><strong>Country:</strong> {candidate.country || "-"}</p>
          <p><strong>About:</strong> {candidate.about || "-"}</p>
          <a className="btn btn-soft" href="/candidates">Back</a>
        </div>
      </div>
    </>
  );
};

const ApplicationsPage = () => {
  const apps = initialData.applications || [];
  const names = new Map((initialData.candidateNames || []).map((c) => [String(c._id), c.name]));
  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title" style={{ marginBottom: 12 }}>Applications</h1>
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Candidate</th><th>Position</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a._id}>
                  <td>{names.get(String(a.candidateID)) || a.candidateID}</td>
                  <td>{a.position || "-"}</td>
                  <td><span className="badge">{a.status || "-"}</span></td>
                  <td><a className="btn btn-soft" href={`/applications/${a._id}`}>Details</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const ApplicationPage = () => {
  const app = initialData.application || {};
  const [status, setStatus] = React.useState(app.status || "applied");
  const [notes, setNotes] = React.useState([]);
  const [text, setText] = React.useState("");
  const [rating, setRating] = React.useState(3);
  const currentUserId = initialData.currentUser?.id;

  const loadNotes = React.useCallback(async () => {
    const res = await fetch(`/api/applications/${app._id}/notes`);
    if (res.status === 204) {
      setNotes([]);
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setNotes(data);
      const own = data.find((n) => n.authorID === currentUserId);
      if (own) {
        setText(own.text || "");
        setRating(own.rating || 3);
      }
    }
  }, [app._id, currentUserId]);

  React.useEffect(() => {
    if (app._id) loadNotes();
  }, [app._id, loadNotes]);

  const updateStatus = async () => {
    await fetch(`/api/applications/${app._id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    window.location.reload();
  };

  const saveNote = async () => {
    if (!currentUserId) return;
    const own = notes.find((n) => n.authorID === currentUserId);
    const url = own
      ? `/api/applications/${app._id}/notes/${currentUserId}`
      : `/api/applications/${app._id}/notes`;
    const method = own ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorID: currentUserId, text, rating: Number(rating) })
    });
    await loadNotes();
  };

  const removeNote = async () => {
    if (!currentUserId) return;
    await fetch(`/api/applications/${app._id}/notes/${currentUserId}`, { method: "DELETE" });
    setText("");
    setRating(3);
    await loadNotes();
  };

  return (
    <>
      <Navbar />
      <div className="container two-col">
        <div className="card">
          <h1 className="title">Application Details</h1>
          <p><strong>Candidate:</strong> {initialData.candidateName?.name || app.candidateID}</p>
          <p><strong>Position:</strong> {app.position || "-"}</p>
          <p><strong>Experience:</strong> {app.experience || "-"}</p>
          <p><strong>Skills:</strong> {app.skills || "-"}</p>
          <div className="row">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary" onClick={updateStatus}>Update Status</button>
          </div>
        </div>
        <div className="card">
          <h2 className="title">My HR Note</h2>
          <form onSubmit={(e) => { e.preventDefault(); saveNote(); }}>
            <label>Rating (1-5)<input min="1" max="5" type="number" value={rating} onChange={(e) => setRating(e.target.value)} /></label>
            <label>Note<textarea value={text} onChange={(e) => setText(e.target.value)}></textarea></label>
            <div className="row">
              <button className="btn btn-primary" type="submit">Save Note</button>
              <button className="btn btn-danger" type="button" onClick={removeNote}>Delete</button>
            </div>
          </form>
          <hr style={{ borderColor: "#dbe3f0", margin: "12px 0" }} />
          <h3 style={{ marginTop: 0 }}>All Notes</h3>
          {notes.map((n) => (
            <div className="note" key={`${n.applicationID}-${n.authorID}`}>
              <strong>Rating:</strong> {n.rating}/5
              <p>{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const ApplyPage = () => (
  <div className="container">
    <div className="card">
      <h1 className="title">Apply for a Position</h1>
      <p className="muted">Fill your profile and submit your job application.</p>
      <form method="POST" action="/api/apply/candidate">
        <div className="grid">
          <label>First Name<input name="first-name" required /></label>
          <label>Last Name<input name="last-name" required /></label>
          <label>Email<input type="email" name="email-address" required /></label>
          <label>Phone<input name="phone-number" required /></label>
          <label>Country<input name="country" required /></label>
          <label>Age<input type="number" name="age" required /></label>
        </div>
        <label>About<textarea name="about"></textarea></label>
        <label>Position
          <select name="position" required>
            {(initialData.positions || ["Cashier", "Tester", "Admin"]).map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <div className="grid">
          <label>Start Date<input type="date" name="start-date" /></label>
          <label>Minimum Pay<input type="number" name="min-pay" /></label>
          <label>Maximum Pay<input type="number" name="max-pay" /></label>
        </div>
        <label>Skills<input name="skills" /></label>
        <label>Experience<textarea name="experience"></textarea></label>
        <button className="btn btn-primary" type="submit">Submit Application</button>
      </form>
    </div>
  </div>
);

const ThankYouPage = () => (
  <div className="container">
    <div className="card">
      <h1 className="title">Application Submitted</h1>
      <p className="muted">Thank you for applying. Our HR team will review your profile soon.</p>
      <div className="row">
        <a className="btn btn-primary" href="/apply">Submit Another Application</a>
        <a className="btn btn-soft" href="/auth/login">Go to Main Page</a>
      </div>
    </div>
  </div>
);

const renderByPage = () => {
  switch (page) {
    case "login":
      return <AuthPage title="Login" submitPath="/auth/login" switchPath="/auth/register" switchLabel="Register admin account" includeConfirm={false} showApplyLink />;
    case "register":
      return <AuthPage title="Register" submitPath="/auth/register" switchPath="/auth/login" switchLabel="Login instead" includeConfirm showApplyLink={false} />;
    case "dashboard":
      return <DashboardPage />;
    case "candidates":
      return <CandidatesPage />;
    case "candidate":
      return <CandidatePage />;
    case "addCandidate":
      return <CandidateFormPage edit={false} />;
    case "editCandidate":
      return <CandidateFormPage edit />;
    case "applications":
      return <ApplicationsPage />;
    case "application":
      return <ApplicationPage />;
    case "apply":
      return <ApplyPage />;
    case "thankyou":
      return <ThankYouPage />;
    default:
      return <div className="container"><div className="card"><h1 className="title">Page not found</h1></div></div>;
  }
};

if (rootNode) {
  ReactDOM.createRoot(rootNode).render(renderByPage());
}
