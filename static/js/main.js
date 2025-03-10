


const { createApp, ref, reactive, watch, onMounted } = Vue;

createApp({
    setup() {

        const state = reactive({
            current_age: 35,
            retirement_age: 63,
            life_span: 72,
            balance: 10000,
            income: 60000,
            expense: 40000,
            retirement_income: 0,
            retirement_expense: 40000,
            return: (7 * 0.85),
            variance: 0.3,
            income_increase: 3,
            inflation: 3.7,
            fire_age: null,
            fire_number: null,
        });

        const table_data = ref([]);

        let chart;

        const calculate_fire_age = () => {
            ending_balance = 0

            for (let retirement_age = state.current_age; retirement_age <= state.life_span; retirement_age++) {
                console.log('checking ... retirement_age> ', retirement_age)

                let balance = state.balance;
                let income = state.income
                let expense = state.expense
                let retirement_income = state.retirement_income
                let retirement_expense = state.retirement_expense
                let savings = 0

                let dictionary = {}

                for (let i = state.current_age; i <= state.life_span; i++) {
                    savings = income - expense

                    if (i == retirement_age) {
                        income = retirement_income
                        expense = state.retirement_expense
                    } else {
                        retirement_income = Number(retirement_income * (1 + state.income_increase / 100)).toFixed(2)
                        retirement_expense = Number(retirement_expense * (1 + state.inflation / 100)).toFixed(2)
                    }
                    income *= (1 + state.income_increase / 100)
                    expense *= (1 + state.inflation / 100);

                    console.log('age> ', i, 'balance> ', balance,)
                    dictionary[i] = balance

                    balance += savings
                    balance *= (1 + state.return / 100);
                }
                ending_balance = balance
                console.log('retirement_age> ', retirement_age, 'ending_balance> ', Number(ending_balance).toFixed(2), 'amount> ', dictionary[retirement_age])

                if (ending_balance > 0) {
                    state.fire_age = retirement_age
                    state.fire_number = Number(dictionary[retirement_age]).toFixed(2)
                    return retirement_age
                }
            }
            return null;
        };


        const calculate_investment = () => {
            const data = [];
            let balance = state.balance;
            let balance_upper = state.balance;
            let balance_lower = state.balance;
            let income = state.income
            let expense = state.expense
            let retirement_income = state.retirement_income
            let retirement_expense = state.retirement_expense
            let savings = 0
            let cumulative_savings = 0

            state.fire_age = calculate_fire_age()

            for (let i = 0; i <= (state.life_span - state.current_age); i++) {

                savings = income - expense
                cumulative_savings += savings
                data.push(
                    {
                        year: i + state.current_age,
                        balance: balance,
                        balance_upper: balance_upper,
                        balance_lower: balance_lower,
                        income: income,
                        expense: expense,
                        savings: savings,
                        cumulative_savings: cumulative_savings,
                    }
                );
                if (i + state.current_age == state.retirement_age) {
                    income = retirement_income
                    expense = state.retirement_expense
                } else {

                    retirement_income = Number(retirement_income * (1 + state.income_increase / 100)).toFixed(2)
                    retirement_expense = Number(retirement_expense * (1 + state.inflation / 100)).toFixed(2)
                }
                income *= (1 + state.income_increase / 100)
                expense *= (1 + state.inflation / 100);

                balance += savings
                balance_upper += savings
                balance_lower += savings

                balance *= (1 + state.return / 100);
                balance_upper *= (1 + (state.return + state.variance) / 100);
                balance_lower *= (1 + (state.return - state.variance) / 100);
            }
            return data;
        };


        function calculate_liner_regression(data) {
            const n = data.length;
            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

            for (let i = 0; i < n; i++) {
                sumX += data[i].year;
                sumY += data[i].balance;
                sumXY += data[i].year * data[i].balance;
                sumX2 += data[i].year * data[i].year;
            }

            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            return { slope, intercept };
        };

        const update_fire_chart = () => {

            const data = calculate_investment();
            const { slope, intercept } = calculate_liner_regression(data);

            table_data.value = data.map(point => ({
                year: point.year,
                balance: Number(point.balance).toFixed(2),
                income: Number(point.income).toFixed(2),
                expense: Number(point.expense).toFixed(2),
                savings: Number(point.savings).toFixed(2),
            }));

            const trendlineData = data.map(point => ({
                x: point.year,
                y: slope * point.year + intercept
            }));

            console.log('-----------')
            console.log('labels> ', data.map(d => d.year))


            chart.data.labels = data.map(d => d.year);

            chart.data.datasets = [
                {
                    label: 'Initial Balance (' + Number(state.balance / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' K )',
                    data: new Array(table_data.value.length).fill(state.balance),
                    borderColor: 'rgb(255, 202, 75)',
                    borderWidth: 0.5,
                    borderDash: [3, 3],
                    pointRadius: 0,
                    fill: true
                },
                {
                    label: 'Balance ' + state.return + '%',
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: 'rgba(98, 92, 187, 0.2)',
                    data: data.map(d => d.balance),
                    borderColor: 'rgb(98, 92, 187)',
                    tension: 0.4,
                    borderWidth: 2
                },


                {
                    label: 'Balance V+ ' + Number(state.return + state.variance).toFixed(2) + '%',
                    pointRadius: 0,
                    fill: false,
                    backgroundColor: 'rgba(98, 92, 187, 0.2)',
                    data: data.map(d => d.balance_upper),
                    borderColor: 'rgb(98, 92, 187)',
                    tension: 0.4,
                    borderWidth: 0.5,
                    borderDash: [3, 3]
                },
                {
                    label: 'Balance V- ' + Number(state.return - state.variance).toFixed(2) + '%',
                    pointRadius: 0,
                    fill: false,
                    backgroundColor: 'rgba(98, 92, 187, 0.2)',
                    data: data.map(d => d.balance_lower),
                    borderColor: 'rgb(98, 92, 187)',
                    tension: 0.4,
                    borderWidth: 0.5,
                    borderDash: [3, 3]
                },


                {
                    label: 'Trendline',
                    data: trendlineData,
                    borderColor: 'rgba(255, 102, 102, 0.5)',
                    borderWidth: 1,
                    borderDash: [3, 3],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Income',
                    type: 'bar',
                    backgroundColor: 'rgba(0, 0, 255, 0.5)',
                    data: data.map(d => d.income)
                },
                {
                    label: 'Expenses',
                    type: 'bar',
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    data: data.map(d => d.expense)
                },

                {
                    label: 'Fire Number (' + Number(state.fire_number / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' K )',
                    data: new Array(table_data.value.length).fill(state.fire_number),
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2,
                    borderDash: [3, 3],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Fire Age (' + state.fire_age + ')',
                    data: [
                        { x: state.fire_age, y: 0 }, // Start point at y=0
                        { x: state.fire_age, y: state.fire_number } // End point at y=100 (or the max y value of your chart)
                    ],
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2,
                    borderDash: [3, 3], // Optional dashed line
                    pointRadius: 0,
                    fill: false
                },



            ];
            chart.update();

        };


        const set_up_tip_tools = () => {

            // Get all elements with a data-tippy-content attribute
            document.querySelectorAll('[data-tippy-content]').forEach(element => {
                // Set data-tippy-content to the data-tippy-content attribute
                element.setAttribute('data-tippy-content', element.getAttribute('data-tippy-content'));
            });

            // Initialize Tippy.js
            tippy('[data-tippy-content]', {
                placement: 'top', // Change the placement if needed
                theme: 'light', // Change the theme if needed
            });
        };


        const update = () => {
            update_fire_chart()
        };



        watch(state, () => update(), { deep: true });

        onMounted(() => {
            set_up_tip_tools()


            const ctx = document.getElementById('fire_chart').getContext('2d');

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        pointRadius: 0, // Remove dots
                        fill: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.4, // Adjust for smoothness
                        borderWidth: 2
                    }]
                },
                options: {

                    responsive: true,
                    maintainAspectRatio: false, // Optional, if you want to control aspect ratio

                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                        x: {
                            stacked: true,
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'right', // Can be 'top', 'left', 'bottom', or 'right'
                            align: 'start', // Can be 'start', 'center', or 'end'
                            labels: {
                                boxWidth: 10,
                                boxHeight: 1
                            }
                        }
                    }

                },



            });
            update_fire_chart();
        });

        return {
            state,
            table_data
        };
    }
}).mount('#app');
