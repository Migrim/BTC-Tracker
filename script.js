const themeToggle = document.querySelector('.toggle-theme');
const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙';
        }
    }

    function detectSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            const systemTheme = detectSystemTheme();
            applyTheme(systemTheme);
        }
    }

    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    initializeTheme();

    let lastPrice = 0;
    let lastWeekPrice = 0;
    let isInitialLoad = true; 
    let btcChart;

    async function fetchBTCPrice() {
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur");
            const data = await response.json();
            return data.bitcoin.eur;
        } catch (error) {
            console.error("Error fetching BTC price:", error);
            return lastPrice;
        }
    }

    async function fetchBTCPriceLastWeek() {
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=7");
            const data = await response.json();
    
            const btcData = {};
            const timestamps = data.prices;
    
            timestamps.forEach(([timestamp, price]) => {
                const date = new Date(timestamp).toISOString().split("T")[0]; 
                btcData[date] = price;
            });
    
            return btcData;
        } catch (error) {
            console.error("Error fetching last week's BTC price:", error);
            return {};
        }
    }

    function formatPrice(price) {
        return price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    async function renderChart() {
        const btcData = await fetchBTCPriceLastWeek();
        const labels = Object.keys(btcData); 
        const data = Object.values(btcData); 
        
        const ctx = document.getElementById('btc-chart').getContext('2d');
        btcChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    borderColor: 'rgba(247, 147, 26, 1)', 
                    backgroundColor: 'rgba(247, 147, 26, 0.2)', 
                    borderWidth: 2,
                    tension: 0.3, 
                    fill: true, 
                    pointRadius: 0, 
                    pointHoverRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 3,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        titleColor: '#fff',  
                        bodyColor: '#fff',   
                        borderColor: 'rgba(255, 255, 255, 0.3)',  
                        borderWidth: 1,  
                        cornerRadius: 5,  
                        caretSize: 8,  
                        padding: 10,  
                        callbacks: {
                            title: function(tooltipItem) {
                                return `Date: ${tooltipItem[0].label}`;
                            },
                            label: function(context) {
                                let value = context.raw;
                                return `€${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                            }
                        },
                        displayColors: false,  
                        position: 'nearest',  
                    }
                },
                scales: {
                    x: {
                        display: false, 
                        grid: { display: false } 
                    },
                    y: {
                        display: false, 
                        grid: { display: false } 
                    }
                },
                interaction: {
                    mode: 'index', 
                    intersect: false 
                },
                hover: {
                    mode: 'index',
                    intersect: false 
                }
            }
        });

        const card = document.querySelector('.card');
        card.addEventListener('mouseenter', () => {
            btcChart.options.maintainAspectRatio = false;
            if (btcChart.data.datasets[0].pointRadius !== 2) {
                btcChart.data.datasets[0].pointRadius = 2;
                btcChart.update();
            }
        });
        
        card.addEventListener('mouseleave', () => {
            btcChart.options.maintainAspectRatio = false;
            if (btcChart.data.datasets[0].pointRadius !== 0) {
                btcChart.data.datasets[0].pointRadius = 0; 
                btcChart.update();
            }
        });               
    }

    function animateTextUpdate(element, newText) {
        if (isInitialLoad) {
            element.textContent = newText;
            return;
        }

        const oldText = element.textContent;
        if (oldText === newText) return;

        element.innerHTML = '';
        const chars = newText.split('');
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char';
            span.style.animationDelay = `${index * 0.1}s`; 
            element.appendChild(span);
        });
    }
    async function updatePrice() {
        const priceNumberElement = document.getElementById('price-number');

        const newPrice = await fetchBTCPrice();
        if (newPrice !== lastPrice) {
            if (!isInitialLoad) {
                animateTextUpdate(priceNumberElement, formatPrice(newPrice));
            } else {
                priceNumberElement.textContent = formatPrice(newPrice);
            }
        }

        lastPrice = newPrice;
    }

    async function updatePercentage() {
        const percentageBoxElement = document.getElementById('percentage-box');

        if (lastWeekPrice === 0) {
            percentageBoxElement.textContent = '▲▼ Calc'; 
            const btcData = await fetchBTCPriceLastWeek();
            
            if (Object.values(btcData).length > 0) {
                lastWeekPrice = Object.values(btcData)[0]; 
            }
            return;
        }

        if (lastPrice) {
            const percentageChange = (((lastPrice - lastWeekPrice) / lastWeekPrice) * 100).toFixed(2);
            const percentageText =
                percentageChange > 0
                    ? `▲ +${percentageChange}%`
                    : percentageChange < 0
                    ? `▼ ${percentageChange}%`
                    : '0%';

            fadeTextUpdate(percentageBoxElement, percentageText);
            percentageBoxElement.className =
                percentageChange > 0
                    ? 'percentage-box up'
                    : percentageChange < 0
                    ? 'percentage-box down'
                    : 'percentage-box';
        }
    }
    function fadeTextUpdate(element, newText) {
        const oldText = element.textContent;
        if (oldText === newText) return;

        element.classList.remove('fade');
        setTimeout(() => {
            element.textContent = newText;
            element.classList.add('fade');
        }, 50); 
    }

    setInterval(updatePrice, 2000); 
    setInterval(updatePercentage, 5000); 

    updatePrice().then(() => {
        isInitialLoad = false; 
    });
    updatePercentage();
renderChart();