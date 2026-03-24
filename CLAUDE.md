# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FIRE (Financial Independence, Retire Early) Calculator - a Streamlit web application that simulates retirement scenarios using multiple projection methods.

## Architecture

**Stack:** Python Streamlit app
- Streamlit (UI framework)
- Pandas (data handling)
- NumPy (numerical computations)
- Plotly (interactive visualizations)

**Structure:**
- `streamlit_app.py` - Main application with all calculation logic and UI
- `static/data/*.json` - Historical market data (MSCI World, S&P 500, OECD)

**Core Parameters:**
All calculator inputs are configured via sidebar widgets: ages, balances, income/expenses, return rates, inflation, variance, and Monte Carlo parameters.

**Projection Methods:**
1. Fixed Projection - constant return assumption with variance bands
2. Monte Carlo Projection - Brownian motion using Box-Muller transform
3. Historic Projection - planned for MSCI World / S&P 500 historical data

## Development

**Run the application:**
```bash
pip install streamlit pandas numpy plotly
streamlit run streamlit_app.py
```

The app opens automatically at `http://localhost:8501`.

**Key Functions:**
- `calculate_fire_age(params)` - Iterates through ages to find when balance stays positive
- `calculate_investment(params)` - Generates year-by-year projection data with variance bands
- `montecarlo_returns_simulation()` - Generates random return sequences using Box-Muller transform
- `run_simulation()` - Runs Monte Carlo trials against state parameters
- `create_fire_chart()` - Renders main FIRE visualization with Plotly
- `create_montecarlo_chart()` - Renders Monte Carlo simulation results
