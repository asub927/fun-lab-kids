import { Link } from "react-router-dom";
import { countCompleted } from "../services/progress";
import { listGrade2Standards } from "../data/standards";

export function Grade2HubPage() {
  const all = listGrade2Standards();
  const { done, total } = countCompleted(all.map((s) => s.code));

  return (
    <div className="page grade-2-hub">
      <p className="eyebrow">Grade 2</p>
      <h1 className="hero-title">Jordan&apos;s Learning Hub</h1>
      <p className="lead">
        Pick a subject to explore NC standards with your AI teammate. Progress saves on this device.
      </p>
      <p className="progress-summary" role="status">
        {done} of {total} standards completed
      </p>

      <div className="lab-cards" role="list">
        <Link to="/grade-2/math" className="lab-card accent-green" role="listitem">
          <span className="subject-tag">Math</span>
          <h2>Math Island</h2>
          <p>{listGrade2Standards("math").length} standards</p>
        </Link>
        <Link to="/grade-2/ela" className="lab-card accent-pink" role="listitem">
          <span className="subject-tag">ELA</span>
          <h2>Word Cove</h2>
          <p>{listGrade2Standards("ela").length} standards</p>
        </Link>
        <Link to="/grade-2/science" className="lab-card accent-orange" role="listitem">
          <span className="subject-tag">Science</span>
          <h2>Discovery Bay</h2>
          <p>{listGrade2Standards("science").length} standards</p>
        </Link>
      </div>
    </div>
  );
}
