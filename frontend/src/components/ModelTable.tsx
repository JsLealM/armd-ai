import { modelRows } from '../data/demoData';

export function ModelTable() {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>F1 macro</th>
            <th>Balanced accuracy</th>
            <th>Accuracy</th>
            <th>MSE</th>
          </tr>
        </thead>
        <tbody>
          {modelRows.map((row) => (
            <tr key={row.model}>
              <td>{row.model}</td>
              <td>{row.f1.toFixed(3)}</td>
              <td>{row.balanced.toFixed(3)}</td>
              <td>{row.accuracy.toFixed(3)}</td>
              <td>{row.mse.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
