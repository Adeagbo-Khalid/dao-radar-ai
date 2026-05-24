let allOpportunities = [];

async function fetchAll() {
  try {
    const [b, g, gr, q, e] = await Promise.all([
      fetch('/api/bounties').then(r => r.json()),
      fetch('/api/gigs').then(r => r.json()),
      fetch('/api/grants').then(r => r.json()),
      fetch('/api/quests').then(r => r.json()).catch(() => []),
      fetch('/api/events').then(r => r.json()).catch(() => [])
    ]);

    const bounties = (Array.isArray(b) ? b : []).map(i => ({...i, type: 'bounty', displayName: i.name || i.title || 'Unnamed', displayDesc: i.details || i.description || ''}));
    const gigs = (Array.isArray(g) ? g : []).map(i => ({...i, type: 'gig', displayName: i.title || i.name || 'Unnamed', displayDesc: i.description || i.details || ''}));
    const grants = (Array.isArray(gr) ? gr : []).map(i => ({...i, type: 'grant', displayName: i.title || i.name || 'Unnamed', displayDesc: i.description || i.details || ''}));
    const quests = (Array.isArray(q) ? q : []).map(i => ({...i, type: 'quest', displayName: i.title || i.name || 'Unnamed', displayDesc: i.description || i.details || ''}));
    const events = (Array.isArray(e) ? e : []).map(i => ({...i, type: 'event', displayName: i.title || i.name || 'Unnamed', displayDesc: i.description || i.details || ''}));

    allOpportunities = [...bounties, ...gigs, ...grants, ...quests, ...events];
    renderCards(allOpportunities);
  } catch(err) {
    document.getElementById('cardsGrid').innerHTML = '<div class="loading"><p>Failed to load opportunities.</p></div>';
  }
}

function getTypeColor(type) {
  const colors = { bounty: '#22D3EE', gig: '#7C3AED', grant: '#06B6D4', quest: '#F59E0B', event: '#10B981' };
  return colors[type] || '#22D3EE';
}

function getTypeIcon(type) {
  const icons = { bounty: 'fa-trophy', gig: 'fa-briefcase', grant: 'fa-hand-holding-usd', quest: 'fa-tasks', event: 'fa-calendar' };
  return icons[type] || 'fa-star';
}

function formatReward(item) {
  if (item.reward) return item.reward;
  if (item.totalValue) return (item.totalValue / 1000000).toFixed(2) + ' STX';
  if (item.amount) return item.amount;
  if (item.prize) return item.prize;
  return 'View Details';
}

function formatDeadline(item) {
  const date = item.deadline || item.endDate || item.endsAt || item.expiresAt || null;
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderCards(items) {
  const grid = document.getElementById('cardsGrid');
  if (!items.length) {
    grid.innerHTML = '<div class="loading"><p>No opportunities found.</p></div>';
    return;
  }
  grid.innerHTML = items.map(function(item) {
    const color = getTypeColor(item.type);
    const icon = getTypeIcon(item.type);
    const reward = formatReward(item);
    const deadline = formatDeadline(item);
    const status = item.status || 'Active';

    return '<div class="opp-card">' +
      '<div class="opp-card-header">' +
      '<span class="card-type" style="background:' + color + '20; color:' + color + '; border:1px solid ' + color + '40;">' +
      '<i class="fas ' + icon + '"></i> ' + item.type.toUpperCase() +
      '</span>' +
      '<span class="card-status ' + (status.toLowerCase() === 'active' || status.toLowerCase() === 'open' ? 'status-active' : 'status-closed') + '">' +
      status +
      '</span>' +
      '</div>' +
      '<h3>' + item.displayName + '</h3>' +
      '<p>' + (item.displayDesc || '').substring(0, 110) + '...</p>' +
      '<div class="card-details">' +
      '<div class="card-detail-item">' +
      '<i class="fas fa-coins" style="color:' + color + '"></i>' +
      '<span>' + reward + '</span>' +
      '</div>' +
      (deadline ? '<div class="card-detail-item"><i class="fas fa-clock" style="color:#F59E0B"></i><span>Ends ' + deadline + '</span></div>' : '') +
      (item.network ? '<div class="card-detail-item"><i class="fas fa-globe" style="color:#10B981"></i><span>' + item.network + '</span></div>' : '') +
      '</div>' +
      '<div class="card-footer">' +
      '<a href="/detail/' + item.type + '/' + item.id + '" class="card-link" style="background:' + color + '20; color:' + color + ';">' +
      'View Details <i class="fas fa-arrow-right"></i>' +
      '</a>' +
      '</div>' +
      '</div>';
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