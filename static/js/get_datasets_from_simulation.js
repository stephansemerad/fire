function get_dataset_from_simulation(simulation_result, end, state) {
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

    return datasets
}