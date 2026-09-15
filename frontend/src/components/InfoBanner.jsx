export default function InfoBanner({ title, paragraph }) {
  return (
    <div className="p-4 bg-card rounded-lg my-4 flex border border-border shadow-md">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">{paragraph}</p>
      </div>
    </div>
  );
}
