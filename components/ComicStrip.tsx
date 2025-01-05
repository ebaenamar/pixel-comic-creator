interface ComicStripProps {
  panels: string[];
  descriptions?: string[];
}

export default function ComicStrip({ panels, descriptions = [] }: ComicStripProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {panels.map((panel, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="aspect-square overflow-hidden rounded-lg border-4 border-gray-700 transition-transform duration-300 transform group-hover:scale-105 shadow-lg">
                <img
                  src={panel}
                  alt={`Comic panel ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                <div className="text-center">
                  <span className="text-white font-pixel text-sm block mb-2">Panel {index + 1}</span>
                  {descriptions[index] && (
                    <span className="text-gray-200 text-xs italic block">
                      {descriptions[index]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {descriptions.map((desc, index) => (
              <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-cyan-400 font-pixel text-sm mb-2">Panel {index + 1}</h3>
                <p className="text-gray-300 text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                // Download functionality will be added later
                const link = document.createElement('a');
                link.href = panels[0];
                link.download = 'comic-panel.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-pixel text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/20"
            >
              Download Comic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
