

const { createApp, ref, reactive, watch, onMounted } = Vue;

createApp({
    setup() {

        let fire_chart;


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
            montecarlo_volatility: 15,
            montecarlo_trials: 15,
            fire_age: null,
            fire_number: null,
        });

        const table_data = ref([]);


        function canSliceData(start, end, dataLength) {
            return start >= 0 && end < dataLength && start <= end;
        }

        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const calculate_fire_age = () => {
            ending_balance = 0

            for (let retirement_age = state.current_age; retirement_age <= state.life_span; retirement_age++) {

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
                    dictionary[i] = balance

                    balance += savings
                    balance *= (1 + state.return / 100);
                }
                ending_balance = balance

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
                data.push(
                    {
                        year: i + state.current_age,
                        balance: balance,
                        balance_upper: balance_upper,
                        balance_lower: balance_lower,
                        income: income,
                        expense: expense,
                        retirement_income: retirement_income,
                        retirement_expense: retirement_expense,
                        savings: savings,
                    }
                );
                if (i + state.current_age == state.retirement_age) {
                    income = retirement_income
                    expense = retirement_expense
                }

                income *= (1 + state.income_increase / 100)
                expense *= (1 + state.inflation / 100);

                retirement_income *= (1 + state.income_increase / 100)
                retirement_expense *= (1 + state.inflation / 100);


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


        const set_up_fire_chart = () => {

            const ctx = document.getElementById('fire_chart').getContext('2d');

            fire_chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        pointRadius: 0, // Remove dots
                        fill: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.2, // Adjust for smoothness
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Fire Simulation'
                    },
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

                        title: {
                            display: true,
                            text: 'Fire Simulation / Constant Return',  // Title text
                            font: { size: 16 },  // Optional: Adjust font size
                            padding: 2  // Optional: Add padding
                        },

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

        };

        const update_fire_chart = () => {

            const data = calculate_investment();
            console.log(data)
            const { slope, intercept } = calculate_liner_regression(data);

            table_data.value = data.map(point => ({
                year: point.year,
                balance: Number(point.balance).toFixed(2),
                income: Number(point.income).toFixed(2),
                expense: Number(point.expense).toFixed(2),

                retirement_income: Number(point.retirement_income).toFixed(2),
                retirement_expense: Number(point.retirement_expense).toFixed(2),


                savings: Number(point.savings).toFixed(2),
            }));

            const trendlineData = data.map(point => ({
                x: point.year,
                y: slope * point.year + intercept
            }));

            // // console.log('-----------')
            // // console.log('labels> ', data.map(d => d.year))


            fire_chart.data.labels = data.map(d => d.year);

            fire_chart.data.datasets = [
                {
                    label: 'Initial Balance (' + Number(state.balance / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + 'K )',
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
                    tension: 0.2,
                    borderWidth: 1
                },


                {
                    label: 'Balance V+ ' + Number(state.return + state.variance).toFixed(2) + '%',
                    pointRadius: 0,
                    fill: false,
                    backgroundColor: 'rgba(98, 92, 187, 0.2)',
                    data: data.map(d => d.balance_upper),
                    borderColor: 'rgb(98, 92, 187)',
                    tension: 0.2,
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
                    tension: 0.2,
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
                    label: 'Fire Number (' + Number(state.fire_number / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + 'K )',
                    data: new Array(table_data.value.length).fill(state.fire_number),
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
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
                    borderWidth: 1,
                    borderDash: [3, 3], // Optional dashed line
                    pointRadius: 0,
                    fill: false
                },



            ];
            fire_chart.update();

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

        const set_up_graph = (canvas_id = '', title = '') => {
            const ctx = document.getElementById(canvas_id).getContext('2d');
            return new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        pointRadius: 0, // Remove dots
                        fill: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.2, // Adjust for smoothness
                        borderWidth: 1
                    }]
                },

                options: {

                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Age'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Balance'
                            }
                        }
                    },
                    plugins: {

                        title: {
                            display: true,
                            text: title,  // Title text
                            font: { size: 16 },  // Optional: Adjust font size
                            padding: 2  // Optional: Add padding
                        },


                        legend: {
                            position: 'right', // Can be 'top', 'left', 'bottom', or 'right'
                            align: 'start', // Can be 'start', 'center', or 'end'
                            labels: {
                                boxWidth: 10,
                                boxHeight: 1
                            }
                        }
                    }

                }
            });
        };

        function get_historic_simulation_datasets(data) {
            let year_span = 20
            let sliced_performances = {}
            let check = true
            let start = 0;
            let end = 20 + 1;

            while (check) {
                check = canSliceData(start, end, data.length)
                timestamp = data[start]['date']
                const date = new Date(timestamp); // Convert to Date object
                const year = date.getFullYear(); // Extract the year
                sliced_performances[year] = data.slice(start, end).map(row => row["return"])
                start++;
                end++;
            }

            const simulation_result = {}
            for (const year in sliced_performances) {
                const slice = sliced_performances[year];
                let data = []
                let balance = state.balance
                let income = state.income
                let expense = state.expense
                let retirement_income = state.retirement_income
                let retirement_expense = state.retirement_expense

                for (let i = 0; i <= (state.life_span - state.current_age); i++) {

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
                    income *= (1 + state.income_increase / 100)
                    expense *= (1 + state.inflation / 100);
                    balance += savings

                    balance *= (1 + slice[i]);

                }
                simulation_result[year] = data
            }

            const datasets = Object.keys(simulation_result).map(year => {
                const data = simulation_result[year].map(item => ({
                    x: item.year, // Assuming item.year is actually representing age
                    y: item.balance
                }));

                return {
                    label: year,
                    pointRadius: 0,
                    data: data,
                    borderColor: getRandomColor(),
                    tension: 0.2,
                    borderWidth: 1

                };
            });

            datasets.push(
                {
                    label: 'Fire Number (' + Number(state.fire_number / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + 'K )',
                    data: new Array(table_data.value.length).fill(state.fire_number),
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
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
                    borderWidth: 1,
                    borderDash: [3, 3], // Optional dashed line
                    pointRadius: 0,
                    fill: false
                },
            )
            return datasets
        }

        function get_simulation_labels(years = 20) {
            let labels = []
            for (let i = 0; i <= (years); i++) {
                labels.push(state.current_age + i)
            };
            return labels
        }

        const update_msci_world = () => {
            url = 'https://stephansemerad.github.io/fire/static/data/msci_world_yearly.json'
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    msci_world.data.labels = get_simulation_labels()
                    msci_world.data.datasets = get_historic_simulation_datasets(data)
                    msci_world.update();
                })
        };

        const update_sp500 = () => {
            url = 'https://stephansemerad.github.io/fire/static/data/sp500_yearly.json'
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    // console.log('sp500> ', data)
                    sp500.data.labels = get_simulation_labels()
                    sp500.data.datasets = get_historic_simulation_datasets(data)
                    sp500.update();

                })
        };


        function montecarlo_investment_returns({ years, expectedReturn, volatility = 0.1, trials = 10 }) {
            // Generate normally distributed random numbers using Box-Muller transform
            function getNormal() {
                let u1 = 0, u2 = 0;
                while (u1 === 0) u1 = Math.random(); // Avoid zero values
                while (u2 === 0) u2 = Math.random();
                return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            }

            const results = [];
            for (let i = 0; i < trials; i++) {
                let portfolioValue = 1; // Normalized initial investment
                const annualReturns = [];

                for (let year = 0; year < years; year++) {
                    const randomReturn = expectedReturn + volatility * getNormal();
                    portfolioValue *= (1 + randomReturn);
                    annualReturns.push(randomReturn);
                }
                results.push(annualReturns);
            }
            return results;
        }

        function get_dataset_from_simulation(simulation_result, end) {
            let datasets
            datasets = Object.keys(simulation_result).map(year => {
                const data = simulation_result[year].map(item => ({
                    x: item.year, // Assuming item.year is actually representing age
                    y: item.balance
                }));

                if (end <= 0) {
                    const ending_balance = 0
                } else {
                    const ending_balance = simulation_result[year][end].balance;
                }


                function getRandomColor(hue) { // Function to generate a random color of a specific hue
                    const saturation = Math.random() * 100; // Random saturation between 0 and 100
                    const lightness = Math.random() * 100; // Random lightness between 0 and 100
                    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                }

                let borderColor; // Set the border color based on the end balance
                if (ending_balance > 0) {
                    borderColor = getRandomColor(120, 60, 100, 60, 90); // Green with varying tone (lighter and more saturated)
                } else {
                    borderColor = getRandomColor(0, 20, 60, 20, 50); // Red with varying tone (darker and less saturated)
                }

                return {
                    label: year,
                    pointRadius: 0,
                    data: data,
                    borderColor: borderColor,
                    tension: 0.2,
                    borderWidth: 1

                };
            });

            datasets.push(
                {
                    label: 'Fire Number (' + Number(state.fire_number / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + 'K )',
                    data: new Array(table_data.value.length).fill(state.fire_number),
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
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
                    borderWidth: 1,
                    borderDash: [3, 3], // Optional dashed line
                    pointRadius: 0,
                    fill: false
                },
            )
            return datasets
        }


        function run_simulation(simulation) {
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


        const update_montecarlo = () => {

            montecarlo_returns = montecarlo_investment_returns({
                years: (state.life_span - state.current_age),
                expectedReturn: state.return / 100, // 7% annual expected return
                volatility: state.montecarlo_volatility / 100,      // 15% annual volatility
                trials: state.montecarlo_trials
            });



            let simulation_result = run_simulation(montecarlo_returns)

            let end = state.life_span - state.current_age



            montecarlo.data.datasets = get_dataset_from_simulation(simulation_result, end)
            montecarlo.data.labels = get_simulation_labels(end)
            montecarlo.update()
        };



        const update = () => {
            update_fire_chart();
            update_msci_world();
            update_sp500();
            update_montecarlo();
        };

        watch(state, () => update(), { deep: true });

        onMounted(() => {
            set_up_tip_tools()
            set_up_fire_chart()

            msci_world = set_up_graph('msci_world', 'MSCI World (20 yr)')
            sp500 = set_up_graph('sp500', 'S&P 500 (20 yr)')
            montecarlo = set_up_graph('montecarlo', 'Montecarlo')
        });

        return { state, table_data };
    }
}).mount('#app');
