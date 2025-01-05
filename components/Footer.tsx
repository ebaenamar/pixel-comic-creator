export default function Footer() {
  const downloadComic = () => {
    // TODO: Implement comic download functionality
  };

  return (
    <footer className="mt-8 text-center">
      <button
        onClick={downloadComic}
        className="px-6 py-3 bg-magenta-500 hover:bg-magenta-600 rounded-lg font-pixel"
      >
        Download Comic
      </button>
    </footer>
  );
}
