import { Link } from "react-router-dom";
import { listStandards, isPlayable } from "../data/standards";

export function CatalogPage() {
  const standards = listStandards();

  return (
    <div className="page catalog">
      <h1 className="hero-title">Standards Catalog</h1>
      <p className="lead">
        The full skills catalog for North Carolina schools. Grade 2 skills are ready to play. More
        grades arrive soon.
      </p>
      <div className="table-wrap">
        <table>
          <caption className="sr-only">North Carolina K-5 skills in Inquiry Island</caption>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Grade</th>
              <th scope="col">Subject</th>
              <th scope="col">Strand</th>
              <th scope="col">Activity</th>
            </tr>
          </thead>
          <tbody>
            {standards.map((s) => (
              <tr key={s.code}>
                <td translate="no">{s.code}</td>
                <td className="tabular">{s.grade === 0 ? "K" : s.grade}</td>
                <td>{s.subject}</td>
                <td>{s.strand}</td>
                <td>
                  {isPlayable(s) ? (
                    <Link to={`/lab/${encodeURIComponent(s.code)}`}>Open Lab</Link>
                  ) : (
                    "Coming soon"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
