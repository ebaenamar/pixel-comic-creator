interface ComicStripProps {
  panels: string[];
}

export default function ComicStrip({ panels }: ComicStripProps) {
  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {panels.map((panel, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-800 rounded-lg overflow-hidden"
          >
            <img
              src={panel}
              alt={`Comic panel ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
