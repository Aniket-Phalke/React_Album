import React, { useEffect, useState } from "react";
import "./App.css";

const fetchAlbums = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/albums");
  const data = await response.json();
  return data;
};

const fetchAlbumById = async (id) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/photos?albumId=${id}`
  );
  const data = await response.json();
  return data;
};

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAlbums().then((data) => setAlbums(data));
  }, []);

  const handleCardClick = async (albumId) => {
    if (albumId === selectedAlbum) {
      setSelectedAlbum(null);
      return;
    }

    const albumItems = await fetchAlbumById(albumId);
    setSelectedAlbum({ id: albumId, items: albumItems });
  };

  const handleItemClicked = (itemId) => {
    if (selectedAlbum) {
      const updatedItems = selectedAlbum.items.map((item) =>
        item.id === itemId ? { ...item, seen: true } : item
      );
      setSelectedAlbum({ ...selectedAlbum, items: updatedItems });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getUnseenItemCount = (albumId) => {
    if (!selectedAlbum || selectedAlbum.id !== albumId) {
      return 0;
    }

    const totalItems = selectedAlbum.items.length;
    const seenItems = selectedAlbum.items.reduce(
      (count, item) => (item.seen ? count + 1 : count),
      0
    );
    return totalItems - seenItems;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Album</h1>
      </header>
      <div className="App-body">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="card-container">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className={`card ${
                selectedAlbum?.id === album.id ? "active" : ""
              }`}
              onClick={() => handleCardClick(album.id)}
            >
              <span className="card-label">{`${album.title} ${album.userId}`}</span>
              <div className="item-count">{getUnseenItemCount(album.id)}</div>
            </div>
          ))}
        </div>
        {selectedAlbum && (
          <div className="item-list">
            <h2>{`Items `}</h2>
            <ul>
              {selectedAlbum.items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleItemClicked(item.id)}
                  className={item.seen ? "seen" : ""}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
