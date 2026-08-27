import { Link } from "react-router-dom";
import { listStandards } from "../data/standards";

export function CatalogPage() {
  const standards = listStandards();

  return (
    <div className="page catalog">
      <h1>Standards catalog</h1>
      <p className="lead">
        Browse NCSCOS-aligned standards. Grade 2 showcase labs are fully playable; other grades are
        catalog-only in P0.
      </p>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Grade</th>
            <th>Subject</th>
            <th>Strand</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {standards.map((s) => (
            <tr key={s.code}>
              <td>{s.code}</td>
              <td>{s.grade === 0 ? "K" : s.grade}</td>
              <td>{s.subject}</td>
              <td>{s.strand}</td>
              <td>
                {s.activityType.startsWith("showcase:") ? (
                  <Link
                    to={
                      s.subject === "math"
                        ? "/demo/math"
                        : s.subject === "ela"
                          ? "/demo/ela"
                          : "/demo/science"
                    }
                  >
                    Open lab
                  </Link>
                ) : (
                  s.activityType
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
