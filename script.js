// ============================
// References to DOM elements
// ============================
const loginOverlay = document.getElementById('loginOverlay');
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const mainContent = document.getElementById('mainContent');

const poemContainer = document.getElementById('poemContainer');
const form = document.getElementById('poemForm');
const searchInput = document.getElementById('searchInput');

const userPoemsList = document.getElementById('userPoemsList');
const userLikesList = document.getElementById('userLikesList');

let poems = JSON.parse(localStorage.getItem('poems')) || [];
let currentUser = localStorage.getItem('currentUser') || '';

// ============================
// LOGIN HANDLING
// ============================
function loginUser() {
  const username = usernameInput.value.trim();
  if (!username) return;

  currentUser = username;
  localStorage.setItem('currentUser', currentUser);

  loginOverlay.style.display = 'none';
  mainContent.style.display = 'block';
  renderPoems();
}

// Auto-login if user already exists
if (currentUser) {
  loginOverlay.style.display = 'none';
  mainContent.style.display = 'block';
  renderPoems();
}

// Login button click
loginBtn.addEventListener('click', loginUser);

// ============================
// LOCAL STORAGE FUNCTIONS
// ============================
function savePoems() {
  localStorage.setItem('poems', JSON.stringify(poems));
}

// ============================
// CREATE POEM ELEMENT
// ============================
function createPoemElement(poem, index) {
  const poemDiv = document.createElement('div');
  poemDiv.className = 'poem fade-in';

  const h2 = document.createElement('h2');
  h2.innerText = poem.title;

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerText = `By ${poem.user} | Category: ${poem.category}`;

  const p = document.createElement('p');
  p.innerHTML = poem.text.replace(/\n/g, '<br>');

  // Like button
  const likeBtn = document.createElement('button');
  likeBtn.className = 'like-btn';
  likeBtn.innerText = `❤ ${poem.likes}`;
  likeBtn.addEventListener('click', () => {
    poems[index].likes++;
    likeBtn.innerText = `❤ ${poems[index].likes}`;
    savePoems();
    renderRightColumn();
  });

  poemDiv.appendChild(h2);
  poemDiv.appendChild(meta);
  poemDiv.appendChild(p);
  poemDiv.appendChild(likeBtn);

  return poemDiv;
}

// ============================
// RENDER LEFT POEMS FEED
// ============================
function renderPoems(filter = '') {
  poemContainer.innerHTML = '';
  let displayPoems = [...poems].reverse(); // latest first

  displayPoems.forEach((poem, index) => {
    if (
      poem.title.toLowerCase().includes(filter) ||
      poem.user.toLowerCase().includes(filter) ||
      poem.category.toLowerCase().includes(filter)
    ) {
      const poemElement = createPoemElement(poem, poems.indexOf(poem));
      poemContainer.appendChild(poemElement);
    }
  });

  renderRightColumn();
}

// ============================
// RENDER RIGHT COLUMN (My Poems & My Likes)
// ============================
function renderRightColumn() {
  // Clear lists
  userPoemsList.innerHTML = '';
  userLikesList.innerHTML = '';

  poems.forEach((poem, index) => {
    // My Poems
    if (poem.user === currentUser) {
      const li = document.createElement('li');
      li.innerText = `${poem.title} (${poem.category}) ❤ ${poem.likes}`;
      userPoemsList.appendChild(li);
    }

    // My Likes
    if (poem.likes > 0) {
      // Assume user liked any poem they clicked; you could expand with per-user likes
      const li = document.createElement('li');
      li.innerText = `${poem.title} by ${poem.user} (${poem.category}) ❤ ${poem.likes}`;
      userLikesList.appendChild(li);
    }
  });
}

// ============================
// SUBMIT POEM
// ============================
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!currentUser) return;

  const title = document.getElementById('poemTitle').value;
  const category = document.getElementById('poemCategory').value;
  const text = document.getElementById('poemText').value;

  const newPoem = { 
    user: currentUser, 
    title, 
    category, 
    text, 
    likes: 0
  };

  poems.push(newPoem);
  savePoems();

  const poemElement = createPoemElement(newPoem, poems.length - 1);
  poemContainer.prepend(poemElement);

  form.reset();
  renderRightColumn();
});

// ============================
// SEARCH FUNCTIONALITY
// ============================
searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase();
  renderPoems(filter);
});

// ============================
// DEFAULT POEM (if empty)
// ============================
if (poems.length === 0) {
  const defaultPoem = {
    user:'Admin',
    title:'And Suddenly',
    category:'Inspirational',
    text:`And suddenly I was made free\nSuddenly he paid the fee\nFor me to be whole again\nHe took my pain`,
    likes:0
  };
  poems.push(defaultPoem);
  savePoems();
}
