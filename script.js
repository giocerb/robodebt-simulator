// --- DATA ---
// --- DATA (monthly version) ---
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Helper: fill 12 months with declared/payment values
const createMonths = (specs) => {
  const months = Array.from({ length: 12 }, () => ({ declared: 0, payment: 0 }));
  specs.forEach(({ months: idxs, declared, payment }) => {
    idxs.forEach(i => { months[i] = { declared, payment }; });
  });
  return months;
};

// Two example cases, now monthly
const caseData = {
  case1: {
    profile: {
    name: "Laure",
    age: 33,
    city: "Sydney",
    role: "Tech worker",
    blurb: "Fired during a financial crisis. Tight labour conditions and a complex family situation made it impossible to find a new job."
    },
    annualATOIncome: 20800,
    months: createMonths([
      { months: [0,1,2,3,4,5], declared: 3200, payment: 0 },        // 6 months working
      { months: [6,7,8,9,10,11], declared: 0, payment: 1000 }       // 6 months not working
    ])
  },
  case2: {
    profile: {
    name: "Joe",
    age: 23,
    city: "Canberra",
    role: "Humanities student",
    blurb: "Works in summer to finance his studies. The rest of the time, given his parents' income, he is entitled to welfare benefits."
  },
    annualATOIncome: 13000,
    months: createMonths([
      { months: [0,1,2,3,4], declared: 500, payment: 600 },         // Uni semester
      { months: [5,6,7], declared: 0, payment: 900 },               // Exams
      { months: [8,9,10,11], declared: 1600, payment: 0 }           // Holidays
    ])
  }
};


// --- DOM ELEMENTS ---
const realityCol = document.getElementById('reality-column');
const robodebtCol = document.getElementById('robodebt-column');

const atoIncomeEl = document.getElementById('ato-income');
const robodebtAverageEl = document.getElementById('robodebt-average');
const totalDebtEl = document.getElementById('total-debt');

const case1Btn = document.getElementById('case1-btn');
const case2Btn = document.getElementById('case2-btn');

// --- HELPERS ---
const formatCurrency = (num) =>
  num.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; // keep if not already defined

function renderMonthGrid(defaultDeclared = 0, defaultPayment = 0) {
  const grid = document.getElementById('month-grid');
  grid.innerHTML = `
    <div class="text-sm text-gray-400 mb-2">Override any month below (leave blank to use defaults).</div>
    <div class="grid grid-cols-1 gap-2">
      ${MONTHS.map((m, i) => `
        <div class="grid grid-cols-12 items-center gap-2 bg-gray-900 border border-gray-700 rounded-md p-2">
          <div class="col-span-3 text-gray-200 font-medium">${m}</div>
          <label class="col-span-4 text-xs text-gray-300">
            Declared (AUD)
            <input id="declared-${i}" type="number" min="0" step="50"
                   placeholder="${defaultDeclared}"
                   class="mt-1 w-full bg-gray-950 border border-gray-700 rounded-md px-2 py-1 text-white">
          </label>
          <label class="col-span-4 text-xs text-gray-300">
            Payment (AUD)
            <input id="payment-${i}" type="number" min="0" step="50"
                   placeholder="${defaultPayment}"
                   class="mt-1 w-full bg-gray-950 border border-gray-700 rounded-md px-2 py-1 text-white">
          </label>
        </div>
      `).join('')}
    </div>
  `;
}


// --- MAIN ---
function loadCase(caseName) {
  const data = caseData[caseName];
  const profileEl = document.getElementById('profile-card');
if (!profileEl) {
  console.warn('No #profile-card found in DOM');
} else if (data.profile) {
  const { name, age, city, role, blurb } = data.profile;
  const subtitle = [role, age ? `${age} y/o` : null, city].filter(Boolean).join(" • ");

  profileEl.innerHTML = `
    <div class="flex items-start gap-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 border border-blue-600/30 text-blue-200 font-bold">
        ${name.slice(0,1).toUpperCase()}
      </div>
      <div class="flex-1">
        <p class="text-white font-semibold text-lg">${name}</p>
        <p class="text-gray-300 text-sm">${subtitle}</p>
        <p class="text-gray-400 text-sm mt-2 leading-relaxed">${blurb}</p>
      </div>
    </div>
  `;
  profileEl.classList.remove('hidden');
} else {
  profileEl.classList.add('hidden');
}

  if (!data) return;

  // Clear
  realityCol.innerHTML = '';
  robodebtCol.innerHTML = '';

  // Core flawed average
  const robodebtAverage = data.annualATOIncome / 12;
  let totalPhantomDebt = 0;

  // Summary cards
  atoIncomeEl.textContent = formatCurrency(data.annualATOIncome);
  robodebtAverageEl.textContent = formatCurrency(robodebtAverage);

  // 12 months
data.months.forEach((m, index) => {
  const monthName = MONTHS[index];
  const declared = m.declared;

  const debtForMonth = Math.max(0, robodebtAverage - declared);
  totalPhantomDebt += debtForMonth;

  // "Reality" card
  const realityCard = `
    <div class="fortnight-card bg-gray-800 p-4 rounded-lg">
      <p class="font-bold text-white">Month: ${monthName}</p>
      <p class="text-sm text-gray-300">
        Declared Income: <span class="font-medium text-green-300">${formatCurrency(declared)}</span>
      </p>
      <p class="text-sm text-gray-300">
        Centrelink Payment: <span class="font-medium text-white">${formatCurrency(m.payment)}</span>
      </p>
    </div>
  `;
  realityCol.insertAdjacentHTML('beforeend', realityCard);

  // "Robodebt" card
  const debtClass = debtForMonth > 0 ? 'text-red-400' : 'text-green-400';
  const cardBorderClass = debtForMonth > 0 ? 'fortnight-card-debt' : '';

  const robodebtCard = `
    <div class="fortnight-card bg-gray-800 p-4 rounded-lg ${cardBorderClass}">
      <p class="font-bold text-white">Month: ${monthName}</p>
      <div class="mt-2 space-y-1 text-sm">
        <p class="flex justify-between">
          <span class="text-gray-300">System's Avg. Income:</span>
          <span class="font-medium text-white">${formatCurrency(robodebtAverage)}</span>
        </p>
        <p class="flex justify-between">
          <span class="text-gray-300">Person's Declared Income:</span>
          <span class="font-medium text-white">-${formatCurrency(declared)}</span>
        </p>
        <hr class="border-gray-600 my-1">
        <p class="flex justify-between font-bold text-base ${debtClass}">
          <span>Debt Created:</span>
          <span>${formatCurrency(debtForMonth)}</span>
        </p>
      </div>
    </div>
  `;
  robodebtCol.insertAdjacentHTML('beforeend', robodebtCard);
});


  totalDebtEl.textContent = formatCurrency(totalPhantomDebt);

  // Button styles (classes toggle still okay even if @apply is ignored)
  if (caseName === 'case1') {
    case1Btn.classList.replace('btn-inactive', 'btn-active');
    case2Btn.classList.replace('btn-active', 'btn-inactive');
  } else {
    case2Btn.classList.replace('btn-inactive', 'btn-active');
    case1Btn.classList.replace('btn-active', 'btn-inactive');
  }
}

// Events
case1Btn.addEventListener('click', () => loadCase('case1'));
case2Btn.addEventListener('click', () => loadCase('case2'));

document.addEventListener('DOMContentLoaded', () => loadCase('case1'));
// Elements
const addProfileBtn = document.getElementById('add-profile-btn');
const panel = document.getElementById('new-profile-panel');
const closeProfileBtn = document.getElementById('close-profile-btn');
const npCancel = document.getElementById('np-cancel');
const npSave = document.getElementById('np-save');

function openPanel() {
  panel.classList.remove('hidden');
  // Initialize grid with current defaults
  const d = Number(document.getElementById('np-default-declared').value || 0);
  const p = Number(document.getElementById('np-default-payment').value || 0);
  renderMonthGrid(d, p);
}
function closePanel() {
  panel.classList.add('hidden');
}

addProfileBtn.addEventListener('click', openPanel);
closeProfileBtn.addEventListener('click', closePanel);
npCancel.addEventListener('click', closePanel);

// Create a new case and wire it into UI
function addCustomCase(key, obj) {
  // 1) Save to in-memory data
  caseData[key] = obj;

  // 2) Create a new button next to your existing ones
  const container = document.querySelector('.flex.justify-center.space-x-4') || document.getElementById('case-buttons');
  const btn = document.createElement('button');
  btn.textContent = `Case: ${obj.profile?.name || key}`;
  btn.className = 'px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600';
  btn.addEventListener('click', () => loadCase(key));
  container.appendChild(btn);

  // 3) Persist to localStorage
  persistCustomCases();
}

function collectMonthValues() {
  const dDefault = Number(document.getElementById('np-default-declared').value || 0);
  const pDefault = Number(document.getElementById('np-default-payment').value || 0);
  return Array.from({ length: 12 }, (_, i) => {
    const d = document.getElementById(`declared-${i}`).value;
    const p = document.getElementById(`payment-${i}`).value;
    return {
      declared: d === '' ? dDefault : Number(d),
      payment:  p === '' ? pDefault : Number(p)
    };
  });
}

npSave.addEventListener('click', () => {
  const name = document.getElementById('np-name').value.trim();
  const age  = document.getElementById('np-age').value.trim();
  const city = document.getElementById('np-city').value.trim();
  const role = document.getElementById('np-role').value.trim();
  const blurb= document.getElementById('np-blurb').value.trim();
  const annual = Number(document.getElementById('np-annual').value);

  if (!name || isNaN(annual)) {
    alert('Please enter at least a Name and Annual ATO Income.');
    return;
  }

  const months = collectMonthValues();
  const key = slugify(name);

  const newCase = {
    profile: {
      name,
      age: age ? Number(age) : undefined,
      city,
      role,
      blurb
    },
    annualATOIncome: annual,
    months
  };

  addCustomCase(key, newCase);
  closePanel();
  loadCase(key); // show it immediately
});

