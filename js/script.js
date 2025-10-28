// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

const spaceFacts = [
  "A day on Venus is longer than its year!",
  "There are more stars in the universe than grains of sand on all Earth's beaches.",
  "One million Earths could fit inside the Sun.",
  "Neutron stars can spin 600 times per second.",
  "The footprints on the Moon will be there for 100 million years.",
  "Space is completely silent because there's no atmosphere.",
  "The Milky Way galaxy is on a collision course with Andromeda.",
  "A spacesuit costs about $12 million dollars."
];

//Get UI elements.
const getImageBtn = document.getElementById('getImageBtn');
const gallery = document.getElementById('gallery');

getImageBtn.addEventListener('click', fetchSpaceImages);

function fetchSpaceImages() {
  gallery.innerHTML = `
    <div class="loading">
      <div class="loading-icon">🔄</div>
      <p>Loading space photos...</p>
    </div>
  `;

  fetch(apodData)
    .then(response => response.json())
    .then(data => {
      //Display the gallery with the fetched data.
      displayGallery(data);
    })
    .catch(error => {
      gallery.innerHTML = `
        <div class="error">
          <p>Error loading image</p>
        </div>
      `;
      console.error('Error fetching data:', error);
    });
}

//Function to display the gallery
function displayGallery(items) {
  gallery.innerHTML = '';

  //Loop through each item and create a gallery card.
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-card';

    let imageUrl = item.url;
    if (item.media_type === 'video' && item.thumbnail_url) {
      imageUrl = item.thumbnail_url;
    }

    //Add content to the card.
    card.innerHTML = `
      <img src="${imageUrl}" alt="${item.title}" class="gallery-image">
      <div class="gallery-info">
        <h3>${item.title}</h3>
        <p class="date">${item.date}</p>
        ${item.media_type === 'video' ? '<span class="video-badge">▶️ Video</span>' : ''}
      </div>
    `;

    card.addEventListener('click', () => openModal(item));
    gallery.appendChild(card);
  });
}

function openModal(item) {
  const modal = document.createElement('div');
  modal.className = 'modal';

  // Determine content based on media type
  let mediaContent = '';
  if (item.media_type === 'video') {
    // For videos, embed YouTube player
    mediaContent = `
      <iframe 
        class="modal-video" 
        src="${item.url}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
  } else {
    //For images, use hdurl if available, otherwise use url
    const imageUrl = item.hdurl || item.url;
    mediaContent = `<img src="${imageUrl}" alt="${item.title}" class="modal-image">`;
  }

  // Add content to modal
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      ${mediaContent}
      <div class="modal-info">
        <h2>${item.title}</h2>
        <p class="modal-date">${item.date}</p>
        <p class="modal-explanation">${item.explanation}</p>
        ${item.copyright ? `<p class="copyright">© ${item.copyright}</p>` : ''}
      </div>
    </div>
  `;

  // Add modal to the page
  document.body.appendChild(modal);

  //Close modal when clicking the close button.
  const closeBtn = modal.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Close modal when clicking outside the content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function displayRandomFact() {
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  const fact = spaceFacts[randomIndex];

  //Create fact section
  const factSection = document.createElement('div');
  factSection.className = 'space-fact';
  factSection.innerHTML = `
    <h3>🌟 Did You Know?</h3>
    <p>${fact}</p>
  `;

  //Insert fact section before the gallery
  const container = document.querySelector('.container');
  const gallery = document.getElementById('gallery');
  container.insertBefore(factSection, gallery);
}

//Display random fact when page loads
displayRandomFact();