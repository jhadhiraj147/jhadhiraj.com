import { experiences, personal } from "@/lib/data";

const vanderbilt = experiences.find(company => company.id === "vanderbilt");
const google = experiences.find(company => company.id === "google");
const jobs = [
  { title: "Part Time SDE", company: "Vanderbilt University", period: personal.currentRolePeriod },
  { title: "SDE Intern", company: "Vanderbilt University", period: vanderbilt?.roles.find(role => role.title.includes("Intern"))?.period },
  { title: "SDE Intern", company: "Google", period: google?.roles[0]?.period },
];
const studies = [
  { title: "CS + Math", school: "Fisk University" },
  { title: "ECE", school: "Vanderbilt University" },
];

export default function ProfileSummary({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const Name = heading;
  const Group = heading === "h1" ? "h2" : "h3";

  return (
    <div className="space-y-5">
      <div>
        <Name className="text-[32px] leading-[40px] text-slate-900">{personal.name}</Name>
        <p className="mt-1 text-slate-700">{personal.focus}</p>
      </div>
      <div>
        <Group className="text-accent">jobs</Group>
        <ul className="mt-2 space-y-2">
          {jobs.map(job => <li key={`${job.company}-${job.title}`}>
            <p className="text-slate-900">{job.title} @ {job.company}</p>
            <p className="text-ink-400">{job.period}</p>
          </li>)}
        </ul>
      </div>
      <div>
        <Group className="text-accent">education</Group>
        <ul className="mt-2 space-y-2">
          {studies.map(study => <li key={study.school}>
            <p className="text-slate-900">{study.title} @ {study.school}</p>
          </li>)}
        </ul>
        <p className="mt-2 text-ink-400">Graduation: {personal.expectedGraduation}</p>
      </div>
    </div>
  );
}
