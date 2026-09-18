export default function InfoBanner({ title, paragraph }) {
  return (
    <div className="bg-card border-border my-4 flex rounded-lg border p-4 shadow-md">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">{paragraph}</p>
      </div>
    </div>
  );
}
