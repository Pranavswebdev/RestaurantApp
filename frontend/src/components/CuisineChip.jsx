export default function CuisineChip({ label, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
        isSelected
          ? 'bg-primary text-white border-primary'
          : 'bg-surface text-meta border-line hover:border-primary'
      }`}
    >
      {label}
    </button>
  );
}
