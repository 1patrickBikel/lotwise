export function MetricCard({ icon: Icon, label, value, helper, tone = "teal" }) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <span className="metric-card__icon"><Icon size={22} weight="duotone" /></span>
      <div><small>{label}</small><strong>{value}</strong><span>{helper}</span></div>
    </article>
  );
}
