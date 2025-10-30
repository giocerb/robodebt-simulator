// --- DATA ---
// Helper function to create simple fortnight arrays
const createFortnights = (specs) => {
  const fortnights = [];
  specs.forEach(({ count, declared, payment }) => {
    for (let i = 0; i < count; i++) {
      fortnights.push({ declared, payment });
    }
  });
  return fortnights;
};

const caseData = {
  case1: {
    annualATOIncome: 20800,
    fortnights: createFortnights([
      { count: 13, declared: 1600, payment: 0 },
      { count: 13, declared: 0,    payment: 500 }
    ])
  },
  case2: {
    annualATOIncome: 13000,
    fortnights: createFortnights([
      { count: 10, declared: 250, payment: 300 },
      { count: 6,  declared: 0,   payment: 450 },
      { count: 10, declared: 800, payment: 0 }
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
  const robodebtAverage = data.annualATOIncome / 26;
  let totalPhantomDebt = 0;

  // Summary cards
  atoIncomeEl.textContent = formatCurrency(data.annualATOIncome);
  robodebtAverageEl.textContent = formatCurrency(robodebtAverage);

  // 26 fortnights
  data.fortnights.forEach((fn, index) => {
    const fortnightNum = index + 1;
    const declared = fn.declared;

    const debtForFortnight = Math.max(0, robodebtAverage - declared);
    totalPhantomDebt += debtForFortnight;

    // Reality card
    const realityCard = `
      <div class="fortnight-card bg-gray-800 p-4 rounded-lg">
        <p class="font-bold text-white">Fortnight ${fortnightNum}</p>
        <p class="text-sm text-gray-300">
          Declared Income:
          <span class="font-medium text-green-300">
            ${formatCurrency(declared)}
          </span>
        </p>
        <p class="text-sm text-gray-300">
          Centrelink Payment:
          <span class="font-medium text-white">
            ${formatCurrency(fn.payment)}
          </span>
        </p>
      </div>
    `;
    realityCol.insertAdjacentHTML('beforeend', realityCard);

    // Robodebt card
    const debtClass = debtForFortnight > 0 ? 'text-red-400' : 'text-green-400';
    const cardBorderClass = debtForFortnight > 0 ? 'fortnight-card-debt' : '';

    const robodebtCard = `
      <div class="fortnight-card bg-gray-800 p-4 rounded-lg ${cardBorderClass}">
        <p class="font-bold text-white">Fortnight ${fortnightNum}</p>
        <div class="mt-2 space-y-1 text-sm">
          <p class="flex justify-between">
            <span class="text-gray-300">System's Avg. Income:</span>
            <span class="font-medium text-white">
              ${formatCurrency(robodebtAverage)}
            </span>
          </p>
          <p class="flex justify-between">
            <span class="text-gray-300">Person's Declared Income:</span>
            <span class="font-medium text-white">
              -${formatCurrency(declared)}
            </span>
          </p>
          <hr class="border-gray-600 my-1">
          <p class="flex justify-between font-bold text-base ${debtClass}">
            <span>Debt Created:</span>
            <span>${formatCurrency(debtForFortnight)}</span>
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
