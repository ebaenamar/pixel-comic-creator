interface Panel {
  url: string;
  description: string;
}

interface ComicStripProps {
  panels: Panel[];
}

export default function ComicStrip({ panels }: ComicStripProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {panels.map((panel, index) => (
          <div 
            key={index}
            className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={panel.url}
              alt={panel.description}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
              <p className="text-xs text-gray-200">
                {panel.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
