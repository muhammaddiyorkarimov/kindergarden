import React, { useState } from 'react';
import axios from 'axios';

function SearchInput() {
  const [searchQuery, setSearchQuery] = useState(''); // Foydalanuvchi tomonidan kiritilgan so'z
  const [searchResults, setSearchResults] = useState([]); // Qidiruv natijalari
  const [searchedPages, setSearchedPages] = useState([]); // Qidirilgan sahifalar ro'yxati

  const handleChange = (event) => {
    setSearchQuery(event.target.value); // Input o'zgarishlari bilan saqlash
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Boshqa sahifaga o'tkazilmagan qolib qolish

    // Sahifalar ro'yxati
    const pages = ['page1', 'page2', 'page3', 'page4', 'page5'];

    // Sahifalardagi ma'lumotlarni qidirish
    Promise.all(pages.map(page => {
			console.log(page);
        return axios.get(`https://example.com/${page}?search=${searchQuery}`)
            .then(response => {
                const results = response.data;
                // Qidirilgan so'z topilgan sahifani saqlash
                if (results.length > 0) {
                    setSearchedPages(prev => [...prev, page]);
                }
                return results;
            })
            .catch(error => {
                console.error(`Xatolik yuz berdi: Sahifa ${page}`, error);
                return [];
            });
    }))
    .then(results => {
        // Barcha sahifalardagi qidiruv natijalarini biriktirish
        const mergedResults = results.flat();
        setSearchResults(mergedResults);
    })
    .catch(error => {
        console.error('Xatolik yuz berdi:', error);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={searchQuery} onChange={handleChange} />
        <button type="submit">Qidirish</button>
      </form>
      {/* Qidiruv natijalari */}
      <p>Qidirilgan so'z topilgan sahifalar: {searchedPages.join(', ')}</p>
      <ul>
        {searchResults.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchInput;
