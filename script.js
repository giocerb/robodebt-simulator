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
    age: 32,
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
    age: 22,
    city: "Canberra",
    role: "Humanities student",
    blurb: "Works in summer to finance his studies."
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

// --- MAIN ---
function loadCase(caseName) {
  const data = caseData[caseName];
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
