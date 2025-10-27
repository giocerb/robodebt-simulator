function selectChoice(choice) {
    // This is a placeholder for the buttons. 
    // In a full app, this could pre-fill the form with example scenarios.
    console.log("Selected scenario:", choice);
}

function calculateDebt() {
    // --- STEP 1: GET INPUTS ---
    // Fetch the raw values from the HTML input fields.
    const atoIncomeInput = document.getElementById('atoIncome').value;
    const declaredIncomeInput = document.getElementById('declaredIncome').value;
    const fortnightsInput = document.getElementById('fortnights').value;
    
    // Find the HTML element where we will display the results.
    const outputDiv = document.getElementById('simulation-output');

    // Convert the text inputs into numbers for calculation.
    // parseFloat is used for dollar amounts, parseInt for the whole number of fortnights.
    const atoIncome = parseFloat(atoIncomeInput);
    const declaredIncome = parseFloat(declaredIncomeInput);
    const fortnights = parseInt(fortnightsInput);

    // --- SIMULATION PARAMETERS (CONSTANTS) ---
    // These values can be adjusted to change the simulation rules.
    // This is an example of the maximum income allowed per fortnight before benefits are reduced.
    const INCOME_FREE_THRESHOLD = 250; 
    // This is the rate at which benefits are reduced for income over the threshold.
    // e.g., 0.50 means a 50 cent reduction for every dollar earned over the threshold.
    const TAPER_RATE = 0.50; 

    // --- INPUT VALIDATION ---
    // Check if any of the inputs are not valid numbers or if fortnights is zero or negative.
    if (isNaN(atoIncome) || isNaN(declaredIncome) || isNaN(fortnights) || fortnights <= 0) {
        // If inputs are invalid, display an error message and stop the function.
        outputDiv.innerHTML = `<div class="result-box bg-red-100 border-red-500 text-red-700"><p class="font-bold">Error:</p><p>Please enter valid numbers in all fields.</p></div>`;
        return; // The 'return' keyword exits the function immediately.
    }

    // --- STEP 2: CHECK FOR A DISCREPANCY ---
    // The core trigger for Robodebt: Is the official ATO income higher than what the user declared?
    if (atoIncome <= declaredIncome) {
        // If not, there's no discrepancy. Display a "safe" message and stop the function.
       #outputDiv.innerHTML = `<div class="result-box bg-green-100 border-green-500 text-green-700"><p class="font-bold">No Discrepancy Found</p><p>The income declared to Centrelink matches or exceeds the ATO data. No debt is raised.</p></div>`;
        #return;
    }

    // --- STEP 3: APPLY FLAWED INCOME AVERAGING ---
    // This is the central flaw of the system. The total annual income is divided evenly across all fortnights,
    // assuming the person earned the exact same amount in each pay period.
    const averagedFortnightlyIncome = atoIncome / fortnights;

    // --- STEP 4: CALCULATE THE ALLEGED "DEBT" ---
    // First, determine how much of the *averaged* income is above the allowed threshold.
    // Math.max(0, ...) ensures this number is never negative.
    const incomeOverThreshold = Math.max(0, averagedFortnightlyIncome - INCOME_FREE_THRESHOLD);
    
    // Next, calculate the supposed "overpayment" for a single fortnight based on the taper rate.
    const fortnightlyOverpayment = incomeOverThreshold * TAPER_RATE;
    
    // Finally, multiply this supposed fortnightly overpayment by the total number of fortnights
    // to calculate the final, algorithmically generated debt.
    const totalDebt = fortnightlyOverpayment * fortnights;

    // --- DISPLAY THE RESULT ---
    // Create an HTML string to explain the calculation process and show the final result.
    // Using backticks (`) allows for creating a multi-line string with embedded variables.
    outputDiv.innerHTML = `
        <div class="result-box bg-yellow-100 border-yellow-500 text-yellow-900">
            <h3 class="font-bold text-lg mb-2">Discrepancy Detected: Robodebt Logic Applied</h3>
            <p>1. The system averages your total ATO income of <strong>$${atoIncome.toFixed(2)}</strong> over <strong>${fortnights}</strong> fortnights.</p>
            <p>2. This creates an assumed, consistent fortnightly income of <strong>$${averagedFortnightlyIncome.toFixed(2)}</strong>.</p>
            <p>3. Based on this flawed average, the system calculates a supposed overpayment of <strong>$${fortnightlyOverpayment.toFixed(2)}</strong> for each fortnight.</p>
            <hr class="my-3 border-yellow-400">
            <p class="font-bold text-xl">Total Potential Debt Raised: <span class="text-red-600">$${totalDebt.toFixed(2)}</span></p>
        </div>
    `;
}
