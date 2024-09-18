import React, { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching for:', query);
  };

  return (
    <div className="flex justify-center py-6">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-5 py-4 text-black bg-white border border-[#9A9A9A] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#FF3C2F] transition duration-300 text-lg"
          placeholder="Search..."
        />
        <button
          onClick={handleSearch}
          className="bg-[#FF3C2F] text-white py-4 px-6 rounded-r-lg hover:bg-[#FF645C] transition duration-300 text-lg"
        >
          Search
        </button>
      </div>
    </div>
  );
}
