import { useRef, useEffect } from 'react';

export default function CategoryTabs({ categories, activeCategory, onCategorySelect }) {
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeTab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      container.scrollLeft = activeTab.offsetLeft - containerRect.width / 2 + tabRect.width / 2;
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-0 z-20 border-y border-line bg-paper/90 backdrop-blur-md">
      <div
        ref={scrollContainerRef}
        className="no-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto px-5 py-3"
        style={{ scrollBehavior: 'smooth' }}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              ref={isActive ? activeTabRef : null}
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-ink text-cream'
                  : 'bg-cream text-ink/70 border border-line hover:border-saffron hover:text-saffron'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
