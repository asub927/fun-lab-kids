import { Link } from "react-router-dom";
import { listStandards } from "../data/standards";

export function CatalogPage() {
  const standards = listStandards();

  return (
    <div className="page catalog">
      <h1 className="hero-title">Standards Catalog</h1>
      <p className="lead">
        Browse NCSCOS-aligned standards. Grade 2 showcase labs are fully playable; other grades are
        catalog-only in P0.
      </p>
      <div className="table-wrap">
        <table>
          <caption className="sr-only">North Carolina K–5 standards in Inquiry Island</caption>
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
                      Open Lab
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
    </div>
  );
}
