import React, { useState } from 'react';
import { Search, Loader, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    fetch('https://godrej-ai-hack.onrender.com/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setResult(`Error: ${data.error}`);
          setSources([]);
        } else {
          setResult(data.answer);
          setSources(data.sources.slice(0, 6)); // Show only top 6 sources
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setResult(`Error: ${error}`);
        setSources([]);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 bg-black text-white">
      <h1 className="text-4xl font-bold mb-8 text-[#FF3C2F]">AI-Powered Search</h1>
      <div className="flex w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-5 py-4 text-white bg-gray-800 border-2 border-gray-700 rounded-l-lg focus:outline-none focus:border-[#FF3C2F] transition duration-300 text-lg"
          placeholder="Ask me anything..."
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-[#FF3C2F] text-white py-4 px-6 rounded-r-lg hover:bg-[#FF645C] transition duration-300 text-lg flex items-center justify-center min-w-[120px]"
        >
          {isLoading ? <Loader className="animate-spin" /> : <><Search className="mr-2" /> Search</>}
        </button>
      </div>

      <div className="mt-8 p-6 w-full max-w-4xl bg-gray-900 rounded-lg shadow-xl border border-gray-800">
        {result ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-[#FF3C2F]">Search Results</h2>
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mb-6">
            <div className="prose prose-invert max-w-none mb-6 leading-relaxed space-y-4 text-left">

                {/* Nicely spaced paragraphs */}
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>

            {sources.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-[#FF3C2F]">Top Sources:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sources.map((source, index) => (
                    <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-lg hover:shadow-lg transition duration-300">
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        {`Source ${index + 1}`}
                        <ExternalLink className="ml-1 w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // Placeholder message when there are no results
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-400">Patience is the key to knowledge.</p>
          </div>
        )}
      </div>
    </div>
  );
}
