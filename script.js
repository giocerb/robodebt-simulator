// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {

    // Get references to all the interactive HTML elements
    const annualIncomeInput = document.getElementById('annualIncome');
    const fortnightsWorkedSlider = document.getElementById('fortnightsWorked');
    const centrelinkPaymentInput = document.getElementById('centrelinkPayment');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');

    // Get references to the display spans for the slider
    const fortnightsWorkedValueSpan = document.getElementById('fortnightsWorkedValue');
    const fortnightsUnemployedValueSpan = document.getElementById('fortnightsUnemployedValue');

    // Update the text display when the slider is moved
    fortnightsWorkedSlider.addEventListener('input', () => {
        const worked = parseInt(fortnightsWorkedSlider.value);
        const unemployed = 26 - worked;
        fortnightsWorkedValueSpan.textContent = worked;
        fortnightsUnemployedValueSpan.textContent = unemployed;
    });

    // Main calculation logic when the button is clicked
    calculateBtn.addEventListener('click', () => {
        // 1. Get and parse the user's input values
        const annualIncome = parseFloat(annualIncomeInput.value);
        const fortnightsWorked = parseInt(fortnightsWorkedSlider.value);
        const centrelinkPayment = parseFloat(centrelinkPaymentInput.value);
        const fortnightsUnemployed = 26 - fortnightsWorked;

        // --- THE FLAWED ROBODEBT CALCULATION ---
        // It illegally averages the annual income across all 26 fortnights.
        const averagedFortnightlyIncome = annualIncome / 26;
        
        // The algorithm assumed this average income was earned in *every* fortnight,
        // including the ones where the person was unemployed and correctly reported $0 income.
        // For simplicity, we'll assume if the average income is above a small threshold,
        // the system would deem the person ineligible for their payment, creating a "debt".
        let calculatedDebt = 0;
        if (averagedFortnightlyIncome > 0 && fortnightsUnemployed > 0) {
            calculatedDebt = fortnightsUnemployed * centrelinkPayment;
        }

        // --- THE REAL SITUATION ---
        // In reality, income is assessed fortnight-by-fortnight.
        // For the fortnights worked, the income was earned.
        // For the unemployed fortnights, the income was $0, so the person was entitled to the payment.
        const actualDebt = 0; // In this correct model, no debt exists.

        // 3. Display the results in the results div
        displayResults(annualIncome, averagedFortnightlyIncome, fortnightsUnemployed, centrelinkPayment, calculatedDebt, actualDebt);
    });

    function displayResults(annualIncome, averagedIncome, unemployedFortnights, payment, debt, actualDebt) {
        resultsDiv.innerHTML = `
            <div class="result-section robodebt-calculation">
                <h3>🚨 The Robodebt Method (Income Averaging)</h3>
                <p>1. It took your total annual income of <strong>$${annualIncome.toLocaleString()}</strong>.</p>
                <p>2. It divided this by 26 fortnights to get an "average" income of <strong>$${averagedIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> per fortnight.</p>
                <p>3. The system then incorrectly assumed you earned this average amount during the <strong>${unemployedFortnights} fortnights</strong> you were actually unemployed and receiving a $${payment.toLocaleString()} payment.</p>
                <p>4. Because this "averaged income" made you look ineligible for support, it calculated a debt by clawing back the payments you correctly received.</p>
                <p class="final-debt">Alleged Debt: $${debt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div class="result-section real-situation">
                <h3>✅ The Correct Method (Actual Income)</h3>
                <p>In reality, your income should be assessed based on what you earned in each specific fortnight.</p>
                <p>During the <strong>${unemployedFortnights} fortnights</strong> you were unemployed, your income was <strong>$0</strong>. You were therefore fully entitled to your Centrelink payments.</p>
                <p class="final-debt" style="color: #5cb85c;">Actual Debt: $${actualDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
        `;

        // Make the results visible with a smooth animation
        resultsDiv.classList.remove('results-hidden');
        resultsDiv.classList.add('results-visible');
    }
});