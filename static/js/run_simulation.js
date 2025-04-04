
function run_simulation(simulation, state) {
    // console.log('simulation> ', simulation)
    const simulation_result = {}
    for (const trial in simulation) {

        data = []
        balance = state.balance
        income = state.income
        expense = state.expense
        retirement_income = state.retirement_income
        retirement_expense = state.retirement_expense
        years = state.life_span - state.current_age
        returns = simulation[trial]

        for (let i = 0; i <= (years); i++) {
            savings = income - expense

            data.push(
                {
                    year: i + state.current_age,
                    balance: balance,
                    income: income,
                    expense: expense,
                    savings: savings,
                }
            );
            if (i + state.current_age == state.retirement_age) {
                income = retirement_income
                expense = state.retirement_expense
            } else {
                retirement_income = Number(retirement_income * (1 + state.income_increase / 100)).toFixed(2)
                retirement_expense = Number(retirement_expense * (1 + state.inflation / 100)).toFixed(2)
            }
            if (i != years) {
                income *= (1 + state.income_increase / 100)
                expense *= (1 + state.inflation / 100);
                balance += savings
                balance *= (1 + returns[i]);
            }
        }

        let statuses = { 'ok': 0, 'notok': 0 }
        let status
        if (balance < 0) {
            status = 'notok'
            statuses['ok'] += 1
        } else {
            status = 'ok'
            statuses['notok'] += 1
        }
        simulation_result['trial ' + trial + ' (' + status + ')'] = data
    }
    return simulation_result
}
