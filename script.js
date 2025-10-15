<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robodebt Simulator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Robodebt: The Flawed Algorithm</h1>
        <p>This is a simplified simulation to demonstrate how Robodebt's "income averaging" created false debts. Adjust the values below to see how it worked.</p>
        
        <div class="input-group">
            <label for="annualIncome">Your Total Annual Income (from ATO)</label>
            <input type="number" id="annualIncome" value="26000" step="1000">
        </div>

        <div class="input-group">
            <label for="fortnightsWorked">Fortnights Worked This Year: <span id="fortnightsWorkedValue">13</span></label>
            <p class="note">You were unemployed and receiving benefits for the other <span id="fortnightsUnemployedValue">13</span> fortnights.</p>
            <input type="range" id="fortnightsWorked" min="0" max="26" value="13" class="slider">
        </div>

        <div class="input-group">
            <label for="centrelinkPayment">Fortnightly Centrelink Payment (when unemployed)</label>
            <input type="number" id="centrelinkPayment" value="560" step="10">
        </div>

        <button id="calculateBtn">Simulate Robodebt Calculation</button>

        <div id="results" class="results-hidden">
            </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
