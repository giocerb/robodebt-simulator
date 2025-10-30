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
    'case1': {
        annualATOIncome: 20800,
        fortnights: createFortnights([
            // 6 months (13fn) working, 0 payment
            { count: 13, declared: 1600, payment: 0 },
            // 6 months (13fn) not working, full payment
            { count: 13, declared: 0, payment: 500 }
        ])
    },
    'case2': {
        annualATOIncome: 13000,
        fortnights: createFortnights([
            // 10fn (Uni Semester)
            { count: 10, declared: 250, payment: 300 },
            // 6fn (Exam Period)
            { count: 6, declared: 0, payment: 450 },
            // 10fn (Summer Holidays)
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

// --- HELPER FUNCTIONS ---
const formatCurrency = (num) => {
    return num.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
};

// --- MAIN SIMULATION LOGIC ---
function loadCase(caseName) {
    const data = caseData[caseName];
    if (!data) return;

    // Clear previous data
    realityCol.innerHTML = '';
    robodebtCol.innerHTML = '';
    
    // Calculate the core flawed average
    const robodebtAverage = data.annualATOIncome / 26;
    let totalPhantomDebt = 0;

    // Update the summary cards
    atoIncomeEl.textContent = formatCurrency(data.annualATOIncome);
    robodebtAverageEl.textContent = formatCurrency(robodebtAverage);

    // Loop through all 26 fortnights
    data.fortnights.forEach((fn, index) => {
        const fortnightNum = index + 1;
        const declared = fn.declared;
        
        // This is the core Robodebt flaw:
        // It assumes the average income was earned, and if that's more than
        // what was declared, it creates a "debt" for the difference.
        const debtForFortnight = Math.max(0, robodebtAverage - declared);
        totalPhantomDebt += debtForFortnight;

        // --- 1. Create the "Reality" Card ---
        const realityCard = `
            <div class="fortnight-card bg-gray-800 p-4 rounded-lg">
                <p class="font-bold text-white">Fortnight ${fortnightNum}</p>
                <p class="text-sm text-gray-300">Declared Income: <span class="font-medium text-green-300">${formatCurrency(declared)}</span></p>

                <p class="text-sm text-gray-300">Centrelink Payment: <span class="font-medium text-white">${formatCurrency(fn.payment)}</span></p>
            </div>
        `;
        realityCol.innerHTML += realityCard;

        // --- 2. Create the "Robodebt" Card ---
        const debtClass = debtForFortnight > 0 ? 'text-red-400' : 'text-green-400';
        const cardBorderClass = debtForFortnight > 0 ? 'fortnight-card-debt' :.
        const robodebtCard = `
            <div class.fortnight-card-debt' : '';
"fortnight-card bg-gray-800 p-4 rounded-lg ${cardBorderClass}">
                <p class="font-bold text-white">Fortnight ${fortnightNum}</p>
                <div class="mt-2 space-y-1 text-sm">
                    <p class="flex justify-between">
                        <span class'text-gray-300"
                        <span class="font-medium text-white">System's Avg. Income:</span>
${formatCurrency(robodebtAverage)}</span>
                    </p>
                    <p class="flex justify-between">
                        <span class="text-gray-300">Person's Declared Income:</span>
                        <span class="font-medium text-white">-${formatCurrency(declared)}</span>
                    </p>
                    <hr class="border-gray-600 my-1">
                    <p class="flex justify-between font-bold text-base ${debtClass}">
                        <span>Debt Created:</span>
                        <span>${formatCurrency(debtForFortnight)}</span>
                    </p>
                </div>
            </div>
        `;
        robodebtCol.innerHTML += robodebtCard;
    });

    // Update the final total debt
    totalDebtEl.textContent = formatCurrency(totalPhantomDebt);

    // Update button styles
    if (caseName === 'case1') {
        case1Btn.classList.replace('btn-inactive', 'btn-active');
        case2Btn.classList.replace('btn-active', 'btn-inactive');
    } else {
        case2Btn.classList.replace('btn-inactive', 'btn-active');
        case1Btn.classList.replace('btn-active', 'btn-inactive');
    }
}

// --- EVENT LISTENERS ---
case1Btn.addEventListener('click', () => loadCase('case1'));
case2Btn.addEventListener('click', () => loadCase('case2'));

// Load the default case on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCase('case1');
});
