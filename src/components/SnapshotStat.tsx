interface SnapshotStatProps {
  label: string;
  value: string | number;
  helper: string;
}

export function SnapshotStat({ label, value, helper }: SnapshotStatProps) {
  return (
    <article className="panel">
      <p className="snapshot-stat__label">{label}</p>
      <p className="snapshot-stat__value font-mono">{value}</p>
      <p className="snapshot-stat__helper">{helper}</p>
    </article>
  );
}
