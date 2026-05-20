let allOpportunities = [];

async function fetchAll() {
  try {
    const b = await fetch('/api/bounties').then(r => r.json());
    const g = await fetch('/api/gigs').then(r => r.json());
    const gr = await fetch('/api/grants').then(r => r.json());

    const bounties = (Array.isArray(b) ? b : []).map(i => ({ ...i, type: 'bounty', displayName: i.name || i.title || 'Unnamed', displayDesc: i.details || i.description || '' }));
    const gigs = (Array.isArray(g) ? g : []).map(i => ({ ...i, type: 'gig', displayName: i.title || i.name || 'Unnamed', displayDesc: i.description || i.details || '' }));
    const grants = (Array.isArray(gr) ? gr : []).map(i => ({ ...i, type: 'grant', displayName: i.title || i.name || 'Unnamed', displayDesc: i.description || i.details || '' }));

    allOpportunities = [...bounties, ...gigs, ...grants];
    renderCards(allOpportunities);
  } catch (err) {
    document.getElementById('cardsGrid').innerHTML = '<div class="loading"><p>Failed to load.</p></div>';
  }
}

function renderCards(items) {
  const grid = document.getElementById('cardsGrid');
  if (!items.length) {
    grid.innerHTML = '<div class="loading"><p>No opportunities found.</p></div>';
    return;
  }
  grid.innerHTML = items.map(function(item) {
    return '<div class="card">' +
      '<span class="card-type">' + item.type.toUpperCase() + '</span>' +
      '<h3>' + item.displayName + '</h3>' +
      '<p>' + item.displayDesc.substring(0, 120) + '...</p>' +
      '<div class="card-footer">' +
      '<a href="/detail/' + item.type + '/' + item.id + '" class="card-link">View →</a>' +
      '</div></div>';
  }).join('');
}

function filterTab(btn, type) {
  document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
  btn.classList.add('active');
  if (type === 'all') {
    renderCards(allOpportunities);
  } else {
    renderCards(allOpportunities.filter(function(i) { return i.type === type; }));
  }
}

function searchOpportunities() {
  var query = document.getElementById('searchInput').value.toLowerCase();
  var filtered = allOpportunities.filter(function(i) {
    return i.displayName.toLowerCase().includes(query) ||
      i.displayDesc.toLowerCase().includes(query);
  });
  renderCards(filtered);
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') searchOpportunities();
});

fetchAll();