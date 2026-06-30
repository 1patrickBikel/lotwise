import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

const content = {
  media: { title: "Media planner", copy: "Generate the eight required filenames, track photos, and prepare practical buyer-facing copy.", bullets: ["Hero, group, detail, and condition photos", "Scale, lot card, location, and pickup boundary", "Consistent filenames tied to the lot ID"] },
  buyers: { title: "Buyer CRM", copy: "Qualify buyers by category, budget, curation preference, pickup readiness, and bulk-lot understanding.", bullets: ["Track source, broker, and protected period", "Score purchase readiness", "Recommend appropriate lots"] },
  sales: { title: "Sales tracker", copy: "Move lots from available to reserved, sold, and picked up while protecting payment and pickup rules.", bullets: ["Collected-sale commission calculations", "Buyer and reservation details", "Paid-before-pickup controls"] },
};

export function PlaceholderView({ view, onNavigate }) {
  const item = content[view];
  return <div className="view-stack"><section className="page-heading"><div><p className="eyebrow">Workflow module</p><h1>{item.title}</h1><p>{item.copy}</p></div></section><section className="panel roadmap-panel"><span className="roadmap-panel__badge">Foundation ready</span><h2>This workflow is mapped into the data model.</h2><div>{item.bullets.map((bullet) => <p key={bullet}><CheckCircle weight="fill" /> {bullet}</p>)}</div><p className="roadmap-note">The first working build focuses on the required inventory, measurement, pricing, lot-card, dashboard, and export core. This module is the next implementation pass.</p><button className="primary-button" onClick={() => onNavigate("lots")}>Work with lots now <ArrowRight /></button></section></div>;
}
