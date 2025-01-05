export default function Header() {
  return (
    <header className="relative text-center py-16 mb-12 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent animate-pulse delay-75"></div>
        </div>
        {/* Pixel art overlay */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '6px 6px'
        }}></div>
      </div>

      {/* Main title with glitch effect */}
      <div className="relative">
        <h1 className="text-6xl font-bold mb-6 font-pixel text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-text-shift">
          Lynch Pixel Comics
        </h1>
        
        {/* Glitch effect layers */}
        <div className="absolute top-0 left-0 right-0 text-6xl font-bold font-pixel text-red-500/30 animate-glitch-1 select-none">
          Lynch Pixel Comics
        </div>
        <div className="absolute top-0 left-0 right-0 text-6xl font-bold font-pixel text-blue-500/30 animate-glitch-2 select-none">
          Lynch Pixel Comics
        </div>

        <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto font-pixel leading-relaxed">
          Transform your stories into surreal pixel art comics inspired by the dreamlike world of David Lynch
        </p>

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center space-x-4">
          <div className="w-16 h-1 bg-red-500/50 animate-pulse"></div>
          <div className="w-16 h-1 bg-purple-500/50 animate-pulse delay-75"></div>
          <div className="w-16 h-1 bg-blue-500/50 animate-pulse delay-150"></div>
        </div>
      </div>
    </header>
  );
}
