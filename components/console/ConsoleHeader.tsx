export default function ConsoleHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="border-b border-base-800 px-8 py-8">
      <p className="text-sm font-mono uppercase tracking-wide text-amber mb-2">{eyebrow}</p>
      <h1 className="font-display font-semibold uppercase tracking-tight text-2xl sm:text-3xl text-base-50">
        {title}
      </h1>
      <p className="mt-2 text-sm text-base-400 max-w-2xl">{desc}</p>
    </div>
  );
}
