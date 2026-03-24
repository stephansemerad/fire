import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots

st.set_page_config(page_title="FIRE Calculator", layout="wide")

# Navbar
st.markdown("""
<style>
.navbar {
    background-color: #4F46E5;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
}
.navbar-title {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    display: inline-block;
}
</style>
<div class="navbar">
    <span class="navbar-title">(FIRE) Financial Independence / Retire Early Calculator</span>
</div>
""", unsafe_allow_html=True)

st.markdown("""
**FIRE (Financial Independence, Retire Early)** is a lifestyle strategy that involves
aggressively saving a large portion of your income, typically 50% to 75%, and living frugally to accumulate wealth. The goal
is to retire early, often by age 40 or 50, with enough savings—usually 25 times your annual expenses—to cover living
costs without needing to work.

This calculator simulates your potential FIRE number using several methods:
1. **Fixed Projection:** Assumes constant returns.
2. **Montecarlo Projection:** Based on Brownian Motion, Return & Volatility.
3. **Historic Projection:** Based on historic data (MSCI World, S&P 500).
""")

# Input section with collapsible container
with st.expander("Input Parameters", expanded=True):
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        current_age = st.number_input("Current Age", value=35, min_value=18, max_value=100)
        retirement_age = st.number_input("Expected Retirement Age", value=63, min_value=18, max_value=100)
        life_span = st.number_input("Life Span", value=72, min_value=18, max_value=120)
        balance = st.number_input("Initial Balance ($)", value=10000, min_value=0)

    with col2:
        income = st.number_input("Annual Net Income ($)", value=60000, min_value=0)
        expense = st.number_input("Annual Expenses ($)", value=40000, min_value=0)
        retirement_income = st.number_input("Annual Retirement Income ($)", value=0, min_value=0)
        retirement_expense = st.number_input("Annual Retirement Expense ($)", value=40000, min_value=0)

    with col3:
        return_rate = st.number_input("Investment Return (%)", value=5.95, step=0.01)
        variance = st.number_input("Variance Return (%)", value=30.0, step=0.01)
        income_increase = st.number_input("Income Increase (%)", value=3.0, step=0.01)
        inflation = st.number_input("Inflation (%)", value=3.7, step=0.01)

    with col4:
        montecarlo_volatility = st.number_input("Montecarlo Volatility (%)", value=15.0, step=0.01)
        montecarlo_trials = st.number_input("Montecarlo Trials", value=15, min_value=1, max_value=1000)


def calculate_fire_age(params):
    """Calculate the age at which FIRE is achieved."""
    for test_retirement_age in range(params['current_age'], params['life_span'] + 1):
        balance = params['balance']
        income = params['income']
        expense = params['expense']
        retirement_income = params['retirement_income']
        retirement_expense = params['retirement_expense']

        for i in range(params['current_age'], params['life_span'] + 1):
            savings = income - expense

            if i == test_retirement_age:
                income = retirement_income
                expense = params['retirement_expense']
            else:
                retirement_income = retirement_income * (1 + params['income_increase'] / 100)
                retirement_expense = retirement_expense * (1 + params['inflation'] / 100)

            income *= (1 + params['income_increase'] / 100)
            expense *= (1 + params['inflation'] / 100)
            balance += savings
            balance *= (1 + params['return'] / 100)

        if balance > 0:
            return test_retirement_age
    return None


def calculate_investment(params):
    """Calculate investment projection with variance bands."""
    data = []
    balance = params['balance']
    balance_upper = params['balance']
    balance_lower = params['balance']
    income = params['income']
    expense = params['expense']
    retirement_income = params['retirement_income']
    retirement_expense = params['retirement_expense']

    fire_age = calculate_fire_age(params)
    params['fire_age'] = fire_age

    for i in range(params['life_span'] - params['current_age'] + 1):
        savings = income - expense
        data.append({
            'year': params['current_age'] + i,
            'balance': balance,
            'balance_upper': balance_upper,
            'balance_lower': balance_lower,
            'income': income,
            'expense': expense,
            'retirement_income': retirement_income,
            'retirement_expense': retirement_expense,
            'savings': savings,
        })

        if params['current_age'] + i == params['retirement_age']:
            income = retirement_income
            expense = retirement_expense

        income *= (1 + params['income_increase'] / 100)
        expense *= (1 + params['inflation'] / 100)
        retirement_income *= (1 + params['income_increase'] / 100)
        retirement_expense *= (1 + params['inflation'] / 100)

        balance += savings
        balance_upper += savings
        balance_lower += savings

        balance *= (1 + params['return'] / 100)
        balance_upper *= (1 + (params['return'] + params['variance']) / 100)
        balance_lower *= (1 + (params['return'] - params['variance']) / 100)

    return data


def montecarlo_returns_simulation(years, expected_return, volatility, trials):
    """Generate Monte Carlo return sequences using Box-Muller transform."""
    def get_normal():
        u1, u2 = 0, 0
        while u1 == 0:
            u1 = np.random.random()
        while u2 == 0:
            u2 = np.random.random()
        return np.sqrt(-2 * np.log(u1)) * np.cos(2 * np.pi * u2)

    results = []
    for _ in range(trials):
        annual_returns = []
        for _ in range(years):
            random_return = expected_return + volatility * get_normal()
            annual_returns.append(random_return)
        results.append(annual_returns)
    return results


def run_simulation(montecarlo_returns, params):
    """Run simulation with given returns."""
    simulation_result = {}
    years = params['life_span'] - params['current_age']

    for trial_idx, returns in enumerate(montecarlo_returns):
        balance = params['balance']
        income = params['income']
        expense = params['expense']
        retirement_income = params['retirement_income']
        retirement_expense = params['retirement_expense']
        data = []

        for i in range(years + 1):
            savings = income - expense
            data.append({
                'year': params['current_age'] + i,
                'balance': balance,
                'income': income,
                'expense': expense,
                'savings': savings,
            })

            if params['current_age'] + i == params['retirement_age']:
                income = retirement_income
                expense = params['retirement_expense']
            else:
                retirement_income = retirement_income * (1 + params['income_increase'] / 100)
                retirement_expense = retirement_expense * (1 + params['inflation'] / 100)

            if i != years:
                income *= (1 + params['income_increase'] / 100)
                expense *= (1 + params['inflation'] / 100)
                balance += savings
                balance *= (1 + returns[i])

        status = 'ok' if balance >= 0 else 'notok'
        simulation_result[f'trial {trial_idx} ({status})'] = data

    return simulation_result


def create_fire_chart(data, params):
    """Create the main FIRE chart."""
    fig = make_subplots(specs=[[{"secondary_y": True}]])

    # Balance line
    fig.add_trace(go.Scatter(
        x=[d['year'] for d in data],
        y=[d['balance'] for d in data],
        name=f"Balance {params['return']:.2f}%",
        line=dict(color='rgb(98, 92, 187)', width=2),
        fill='tozeroy',
        fillcolor='rgba(98, 92, 187, 0.2)',
    ))

    # Variance bands
    fig.add_trace(go.Scatter(
        x=[d['year'] for d in data],
        y=[d['balance_upper'] for d in data],
        name=f"Balance V+ {(params['return'] + params['variance']) / 100:.2%}",
        line=dict(color='rgb(98, 92, 187)', width=1, dash='dash'),
        fill='none',
    ))

    fig.add_trace(go.Scatter(
        x=[d['year'] for d in data],
        y=[d['balance_lower'] for d in data],
        name=f"Balance V- {(params['return'] - params['variance']) / 100:.2%}",
        line=dict(color='rgb(98, 92, 187)', width=1, dash='dash'),
        fill='none',
    ))

    # Income and expense bars
    fig.add_trace(go.Bar(
        x=[d['year'] for d in data],
        y=[d['income'] for d in data],
        name='Income',
        marker_color='rgba(0, 0, 255, 0.5)',
    ))

    fig.add_trace(go.Bar(
        x=[d['year'] for d in data],
        y=[d['expense'] for d in data],
        name='Expenses',
        marker_color='rgba(255, 0, 0, 0.5)',
    ))

    # FIRE number line
    if params.get('fire_number'):
        fig.add_hline(
            y=params['fire_number'],
            line_dash="dash",
            line_color="rgb(255, 99, 132)",
            annotation_text=f"FIRE Number ({params['fire_number']/1000:.1f}K)",
            annotation_position="right",
        )

    # FIRE age line
    if params.get('fire_age'):
        fig.add_vline(
            x=params['fire_age'],
            line_dash="dash",
            line_color="rgb(255, 99, 132)",
            annotation_text=f"FIRE Age ({params['fire_age']})",
            annotation_position="top",
        )

    fig.update_layout(
        title="FIRE Simulation / Constant Return",
        xaxis_title="Age",
        yaxis_title="Balance ($)",
        hovermode='x unified',
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        height=400,
    )

    return fig


def create_montecarlo_chart(simulation_result, params):
    """Create Monte Carlo simulation chart."""
    fig = go.Figure()

    for trial_name, data in simulation_result.items():
        ending_balance = data[-1]['balance'] if data else 0
        color = 'green' if ending_balance >= 0 else 'red'

        fig.add_trace(go.Scatter(
            x=[d['year'] for d in data],
            y=[d['balance'] for d in data],
            name=trial_name,
            line=dict(color=color, width=1),
            opacity=0.6,
            showlegend=False,
        ))

    # Add FIRE number line
    if params.get('fire_number'):
        fig.add_hline(
            y=params['fire_number'],
            line_dash="dash",
            line_color="rgb(255, 99, 132)",
            annotation_text=f"FIRE Number ({params['fire_number']/1000:.1f}K)",
        )

    fig.update_layout(
        title=f"Monte Carlo Simulation ({params.get('montecarlo_trials', 15)} trials)",
        xaxis_title="Age",
        yaxis_title="Balance ($)",
        hovermode='x unified',
        height=400,
    )

    return fig


# Calculate FIRE age and number
params = {
    'current_age': current_age,
    'retirement_age': retirement_age,
    'life_span': life_span,
    'balance': balance,
    'income': income,
    'expense': expense,
    'retirement_income': retirement_income,
    'retirement_expense': retirement_expense,
    'return': return_rate,
    'variance': variance,
    'income_increase': income_increase,
    'inflation': inflation,
    'montecarlo_volatility': montecarlo_volatility / 100,
    'montecarlo_trials': montecarlo_trials,
}

fire_age = calculate_fire_age(params)
if fire_age is not None:
    # Calculate FIRE number
    test_data = calculate_investment(params.copy())
    for row in test_data:
        if row['year'] == fire_age:
            params['fire_number'] = row['balance']
            break

# Status message
if fire_age is None:
    st.error(f"Apologies - FIRE is not achievable with current parameters. Consider increasing savings or adjusting retirement age.")
elif retirement_age < fire_age:
    st.error(f"Apologies - Your retirement age ({retirement_age}) is earlier than your FIRE age ({fire_age}). You need to adjust your savings or strategy to retire earlier.")
else:
    st.success(f"Congratulations! You will reach FIRE in {fire_age - current_age} years at age {fire_age} with {params.get('fire_number', 0)/1000:.1f}K. You're on track to retire early!")

# Charts side by side
col1, col2 = st.columns(2)

# Main chart
investment_data = calculate_investment(params)
fire_chart = create_fire_chart(investment_data, params)
with col1:
    st.plotly_chart(fire_chart, width='stretch', height=500)

# Monte Carlo chart
montecarlo_returns = montecarlo_returns_simulation(
    years=life_span - current_age,
    expected_return=return_rate / 100,
    volatility=montecarlo_volatility / 100,
    trials=montecarlo_trials
)
simulation_result = run_simulation(montecarlo_returns, params)
montecarlo_chart = create_montecarlo_chart(simulation_result, params)
with col2:
    st.plotly_chart(montecarlo_chart, width='stretch', height=500)

# Data table
st.subheader("Year-by-Year Breakdown")
df = pd.DataFrame(investment_data)
df_display = df[['year', 'balance', 'income', 'expense', 'savings']].copy()
df_display['balance_k'] = (df_display['balance'] / 1000).round(1).astype(str) + 'K'
df_display['income_k'] = (df_display['income'] / 1000).round(1).astype(str) + 'K'
df_display['expense_k'] = (df_display['expense'] / 1000).round(1).astype(str) + 'K'
df_display['savings_k'] = (df_display['savings'] / 1000).round(1).astype(str) + 'K'
df_display = df_display.rename(columns={
    'year': 'Year',
    'balance_k': 'Balance',
    'income_k': 'Income',
    'expense_k': 'Expenses',
    'savings_k': 'Savings',
})
st.dataframe(df_display, width='stretch', height=400)
