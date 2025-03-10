


const { createApp, ref, reactive, watch, onMounted } = Vue;

createApp({
    setup() {

        let fire_chart;
        let historic_chart;
        let historic_end_at_fire_age

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

        const msci_data = [{ "date": 315446400000, "msci_world": 10690.898083359, "return": 0.0690898083, "cumulative_return": 0.0690898083, "year": 0 }, { "date": 347068800000, "msci_world": 14852.7776567331, "return": 0.3892918575, "cumulative_return": 0.4852777657, "year": 1 }, { "date": 378604800000, "msci_world": 16876.4390538706, "return": 0.1362480099, "cumulative_return": 0.6876439054, "year": 2 }, { "date": 410140800000, "msci_world": 21023.7467310496, "return": 0.2457454244, "cumulative_return": 1.1023746731, "year": 3 }, { "date": 441676800000, "msci_world": 29738.3855133799, "return": 0.414514068, "cumulative_return": 1.9738385513, "year": 4 }, { "date": 473299200000, "msci_world": 35609.4660089342, "return": 0.1974243186, "cumulative_return": 2.5609466009, "year": 5 }, { "date": 504835200000, "msci_world": 41237.0764895799, "return": 0.1580369242, "cumulative_return": 3.123707649, "year": 6 }, { "date": 536371200000, "msci_world": 48918.9884207537, "return": 0.1862865311, "cumulative_return": 3.8918988421, "year": 7 }, { "date": 567907200000, "msci_world": 46897.0882509253, "return": -0.0413316022, "cumulative_return": 3.6897088251, "year": 8 }, { "date": 599529600000, "msci_world": 61772.0910402239, "return": 0.3171839307, "cumulative_return": 5.177209104, "year": 9 }, { "date": 631065600000, "msci_world": 73105.463001588, "return": 0.1834707514, "cumulative_return": 6.3105463002, "year": 10 }, { "date": 662601600000, "msci_world": 51690.6615552027, "return": -0.2929302485, "cumulative_return": 4.1690661555, "year": 11 }, { "date": 694137600000, "msci_world": 64385.653188017, "return": 0.2455954567, "cumulative_return": 5.4385653188, "year": 12 }, { "date": 725760000000, "msci_world": 64147.674907806, "return": -0.0036961383, "cumulative_return": 5.4147674908, "year": 13 }, { "date": 757296000000, "msci_world": 86136.4809014187, "return": 0.3427841465, "cumulative_return": 7.6136480901, "year": 14 }, { "date": 788832000000, "msci_world": 84246.4681098458, "return": -0.0219420711, "cumulative_return": 7.424646811, "year": 15 }, { "date": 820368000000, "msci_world": 96687.2493083322, "return": 0.1476712493, "cumulative_return": 8.6687249308, "year": 16 }, { "date": 851990400000, "msci_world": 112633.6515287638, "return": 0.1649276646, "cumulative_return": 10.2633651529, "year": 17 }, { "date": 883526400000, "msci_world": 145703.5162296974, "return": 0.2936055455, "cumulative_return": 13.570351623, "year": 18 }, { "date": 915062400000, "msci_world": 171348.4422189138, "return": 0.1760075985, "cumulative_return": 16.1348442219, "year": 19 }, { "date": 946598400000, "msci_world": 250512.9941823113, "return": 0.4620091723, "cumulative_return": 24.0512994182, "year": 20 }, { "date": 978220800000, "msci_world": 234819.9984987017, "return": -0.0626434399, "cumulative_return": 22.4819998499, "year": 21 }, { "date": 1009756800000, "msci_world": 206217.7962133354, "return": -0.1218047972, "cumulative_return": 19.6217796213, "year": 22 }, { "date": 1041292800000, "msci_world": 138837.4225837838, "return": -0.3267437383, "cumulative_return": 12.8837422584, "year": 23 }, { "date": 1072828800000, "msci_world": 153445.4680045362, "return": 0.1052169159, "cumulative_return": 14.3445468005, "year": 24 }, { "date": 1104451200000, "msci_world": 163226.5922166145, "return": 0.0637433242, "cumulative_return": 15.3226592217, "year": 25 }, { "date": 1135987200000, "msci_world": 206340.8923373297, "return": 0.2641377213, "cumulative_return": 19.6340892337, "year": 26 }, { "date": 1167523200000, "msci_world": 221917.3570702377, "return": 0.075488986, "cumulative_return": 21.191735707, "year": 27 }, { "date": 1199059200000, "msci_world": 216474.7392212931, "return": -0.0245254266, "cumulative_return": 20.6474739221, "year": 28 }, { "date": 1230681600000, "msci_world": 135756.7413455361, "return": -0.3728749052, "cumulative_return": 12.5756741346, "year": 29 }, { "date": 1262217600000, "msci_world": 170477.8005948942, "return": 0.2557593745, "cumulative_return": 16.0477800595, "year": 30 }, { "date": 1293753600000, "msci_world": 205418.2359669321, "return": 0.2049559253, "cumulative_return": 19.5418235967, "year": 31 }, { "date": 1325289600000, "msci_world": 200380.8342500801, "return": -0.0245226608, "cumulative_return": 19.038083425, "year": 32 }, { "date": 1356912000000, "msci_world": 227607.3633076503, "return": 0.1358739181, "cumulative_return": 21.7607363308, "year": 33 }, { "date": 1388448000000, "msci_world": 275843.8285916278, "return": 0.2119284042, "cumulative_return": 26.5843828592, "year": 34 }, { "date": 1419984000000, "msci_world": 328800.518322201, "return": 0.1919806943, "cumulative_return": 31.8800518322, "year": 35 }, { "date": 1451520000000, "msci_world": 363478.2643024697, "return": 0.105467431, "cumulative_return": 35.3478264302, "year": 36 }, { "date": 1483142400000, "msci_world": 403604.2451270577, "return": 0.1103944438, "cumulative_return": 39.3604245127, "year": 37 }, { "date": 1514678400000, "msci_world": 434202.4777412793, "return": 0.0758124648, "cumulative_return": 42.4202477741, "year": 38 }, { "date": 1546214400000, "msci_world": 415174.5579251843, "return": -0.0438226882, "cumulative_return": 40.5174557925, "year": 39 }, { "date": 1577750400000, "msci_world": 540245.1776247153, "return": 0.3012482757, "cumulative_return": 53.0245177625, "year": 40 }, { "date": 1609372800000, "msci_world": 573242.1670965339, "return": 0.0610778047, "cumulative_return": 56.3242167097, "year": 41 }, { "date": 1640908800000, "msci_world": 756571.9801449956, "return": 0.3198121554, "cumulative_return": 74.6571980145, "year": 42 }, { "date": 1672444800000, "msci_world": 657640.5600279866, "return": -0.1307627334, "cumulative_return": 64.7640560028, "year": 43 }, { "date": 1703980800000, "msci_world": 785784.4342333137, "return": 0.1948539704, "cumulative_return": 77.5784434233, "year": 44 }, { "date": 1735603200000, "msci_world": 991827.676110626, "return": 0.2622134429, "cumulative_return": 98.1827676111, "year": 45 }, { "date": 1767139200000, "msci_world": 1026432.723147118, "return": 0.0348901809, "cumulative_return": 101.6432723147, "year": 46 }]


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

                    // console.log('age> ', i, 'balance> ', balance,)
                    dictionary[i] = balance

                    balance += savings
                    balance *= (1 + state.return / 100);
                }
                ending_balance = balance
                // console.log('retirement_age> ', retirement_age, 'ending_balance> ', Number(ending_balance).toFixed(2), 'amount> ', dictionary[retirement_age])

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


                        title: {
                            display: true, // Enable the title
                            text: 'Simulation Fire Constant Return' // Set the title text
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

            // console.log('-----------')
            // console.log('labels> ', data.map(d => d.year))


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
                    label: 'Fire Number (' + Number(state.fire_number / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + 'K )',
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

        const set_up_historic_chart = () => {
            const ctx = document.getElementById('historic_chart').getContext('2d');
            historic_chart = new Chart(ctx, {
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
                            display: true, // Enable the title
                            text: 'Simulation MSCI World'
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

        const update_historic_chart = () => {


            let year_span = state.life_span - state.current_age
            // // // console.log('year_span> ', year_span)

            let sliced_performances = {}
            let check = true

            let start = 0;
            let end = state.life_span - state.current_age + 1;

            while (check) {
                check = canSliceData(start, end, msci_data.length)

                timestamp = msci_data[start]['date']
                const date = new Date(timestamp); // Convert to Date object
                const year = date.getFullYear(); // Extract the year

                console.log(year); // Output: 1980

                sliced_performances[year] = msci_data.slice(start, end).map(row => row["return"])
                start++;
                end++;
            }

            // // // console.log('sliced_performances> ', sliced_performances)
            // // // console.log('sliced_performances.length> ', sliced_performances.length)

            const simulation_result = {}

            for (const year in sliced_performances) {
                // // // console.log('year> ', year)
                const slice = sliced_performances[year];

                // // // console.log('slice.length> ', slice.length)
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

                    // // console.log(i)
                    // // console.log('slice length', slice.length)
                    balance *= (1 + slice[i]);

                    // // console.log('age> ', i + state.current_age, 'balance> ', balance, 'slice> ', slice[i])
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
                    tension: 0.4,
                    borderWidth: 2

                };
            });


            datasets.push(
                {
                    label: 'Fire Number (' + Number(state.fire_number / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + 'K )',
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
            )


            let labels = []
            for (let i = 0; i <= (state.life_span - state.current_age); i++) {
                labels.push(state.current_age + i)
            };

            // // console.log('labels> ', labels)
            // // console.log('datasets> ', datasets)

            historic_chart.data.labels = labels
            historic_chart.data.datasets = datasets
            historic_chart.update();


            update_historic_end_at_fire_age(simulation_result)


        };

        const update_historic_end_at_fire_age = (simulation_result) => {
            console.log('simulation_result > ', simulation_result)
            const historic_chart_data = Object.keys(simulation_result).map(year => {
                // Find the balance when age is 35 for this year

                var amount_at_year = simulation_result[year].find(item => item.year === state.fire_age);

                if (amount_at_year == undefined) {
                    return {};
                } else {
                    return {
                        x: parseInt(year), // Use the year as x
                        y: amount_at_year.balance // Use the balance at age 35 as y
                    };
                };
            }) // Remove null values from the final array

            const historic_end_at_fire_age_labels = historic_chart_data.map(item => item.x);
            const historic_end_at_fire_age_values = historic_chart_data.map(item => item.y);


            function getColor(value) {
                return value > 0 ? 'rgba(0, 128, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)';
            }

            const chartData = {
                labels: historic_end_at_fire_age_labels,
                datasets: []
            };

            // console.log(chartData)

            historic_end_at_fire_age.data.labels = historic_end_at_fire_age_labels
            historic_end_at_fire_age.data.datasets = [{
                label: 'Balance',
                data: historic_end_at_fire_age_values,
                backgroundColor: historic_end_at_fire_age_values.map(getColor),
                borderColor: historic_end_at_fire_age_values.map(getColor),
                borderWidth: 1
            }]
            historic_end_at_fire_age.update();


        }

        const set_up_historic_end_at_fire_age = () => {
            const ctx = document.getElementById('historic_end_at_fire_age').getContext('2d');
            historic_end_at_fire_age = new Chart(ctx, {
                type: 'bar',
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

                    indexAxis: 'y', // Set indexAxis to 'y' for horizontal bars

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
                            display: true, // Enable the title
                            text: 'Ending Balance at Fire Age' // Set the title text
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


        function monteCarloInvestmentReturns({ years, expectedReturn, volatility = 0.1, trials = 10000 }) {
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

                results.push({
                    finalValue: portfolioValue,
                    annualReturns: annualReturns
                });
            }

            return results;
        }

        // Example usage:
        const simulationResults = monteCarloInvestmentReturns({
            years: 10,
            expectedReturn: 0.07, // 7% annual expected return
            volatility: 0.15      // 15% annual volatility
        });


        const update = () => {

            document.getElementById("current_age").addEventListener("input", function () {
                localStorage.setItem("current_age", this.value);
            });

            update_fire_chart();
            update_historic_chart();
        };

        const set_up_local_storage = () => {

            const storedValue = localStorage.getItem('current_age');
            const defaultValue = 25;

            const value = storedValue !== null ? storedValue : defaultValue;
        };



        watch(state, () => update(), { deep: true });

        onMounted(() => {
            set_up_local_storage()
            set_up_tip_tools()
            set_up_fire_chart()
            set_up_historic_chart()
            set_up_historic_end_at_fire_age()
        });

        return {
            state,
            table_data
        };
    }
}).mount('#app');
