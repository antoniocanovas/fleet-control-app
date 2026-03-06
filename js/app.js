/**
 * FleetControl - Main Application Logic
 */

const App = {
    state: {
        currentView: 'dashboard',
        vehicles: [],
        drivers: [],
        isLoading: true
    },

    init() {
        console.log('FleetControl initialization...');
        this.cacheDOM();
        this.bindEvents();
        this.loadInitialData();
        this.render();
    },

    cacheDOM() {
        this.dom = {
            navItems: document.querySelectorAll('.sidebar-nav li'),
            contentView: document.getElementById('content-view')
        };
    },

    bindEvents() {
        this.dom.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-view');
                this.navigate(view);
            });
        });
    },

    navigate(view) {
        if (this.state.currentView === view) return;

        this.state.currentView = view;

        // Update UI
        this.dom.navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-view') === view);
        });

        this.render();
    },

    async loadInitialData() {
        // Mock data for initial demo
        this.state.vehicles = [
            { id: 1, plate: '7742-LMX', model: 'Scania R450', driver: 'Marco Rossi', status: 'Active', fuelLevel: 85 },
            { id: 2, plate: '1289-KJS', model: 'Volvo FH16', driver: 'Elena Smith', status: 'In Transit', fuelLevel: 42 },
            { id: 3, plate: '4560-PBC', model: 'Mercedes Actros', driver: 'John Doe', status: 'Maintenance', fuelLevel: 15 }
        ];

        this.state.isLoading = false;
        this.render();
    },

    render() {
        if (this.state.isLoading) {
            this.dom.contentView.innerHTML = '<div class="loader">Gathering fleet data...</div>';
            return;
        }

        switch (this.state.currentView) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'vehicles':
                this.renderVehicles();
                break;
            case 'fuel':
                this.renderFuel();
                break;
            default:
                this.dom.contentView.innerHTML = `
                    <div class="card">
                        <h2>${this.state.currentView.charAt(0).toUpperCase() + this.state.currentView.slice(1)}</h2>
                        <p style="color: var(--text-secondary); margin-top: 1rem;">This module is under construction.</p>
                    </div>
                `;
        }

        // Re-initialize icons for newly added HTML
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    renderDashboard() {
        this.dom.contentView.innerHTML = `
            <div class="dashboard-grid">
                <div class="grid-stats">
                    <div class="stat-card card">
                        <div class="stat-header">
                            <span class="stat-title">Total Vehicles</span>
                            <i data-lucide="truck" class="stat-icon blue"></i>
                        </div>
                        <div class="stat-value">24</div>
                        <div class="stat-trend positive">
                            <i data-lucide="trending-up"></i>
                            <span>+3 this month</span>
                        </div>
                    </div>
                    <div class="stat-card card">
                        <div class="stat-header">
                            <span class="stat-title">Fuel Consumption</span>
                            <i data-lucide="droplets" class="stat-icon gold"></i>
                        </div>
                        <div class="stat-value">32.4 <small>L/100km</small></div>
                        <div class="stat-trend negative">
                            <i data-lucide="trending-up"></i>
                            <span>+1.2% avg</span>
                        </div>
                    </div>
                    <div class="stat-card card">
                        <div class="stat-header">
                            <span class="stat-title">Active Drivers</span>
                            <i data-lucide="users" class="stat-icon green"></i>
                        </div>
                        <div class="stat-value">18</div>
                        <div class="stat-trend neutral">
                            <span>Stable</span>
                        </div>
                    </div>
                    <div class="stat-card card">
                        <div class="stat-header">
                            <span class="stat-title">Maintenance Alerts</span>
                            <i data-lucide="alert-triangle" class="stat-icon red"></i>
                        </div>
                        <div class="stat-value">3</div>
                        <div class="stat-trend alert">
                            <span>2 critical</span>
                        </div>
                    </div>
                </div>

                <div class="dashboard-main">
                    <div class="card chart-container">
                        <h3>Fuel consumption vs Distance</h3>
                        <div class="chart-placeholder">
                            <!-- In a real app, Chart.js would render here -->
                            <div class="mock-chart"></div>
                        </div>
                    </div>
                    <div class="card recent-activity">
                        <h3>Recent Activity</h3>
                        <ul class="activity-list">
                            <li>
                                <div class="activity-icon"><i data-lucide="check-circle"></i></div>
                                <div class="activity-details">
                                    <p><strong>Refuel:</strong> 7742-LMX filled 450L at SOLRED Station 45</p>
                                    <span class="time">2 hours ago</span>
                                </div>
                            </li>
                            <li>
                                <div class="activity-icon warning"><i data-lucide="tool"></i></div>
                                <div class="activity-details">
                                    <p><strong>Alert:</strong> 1289-KJS reported engine warning</p>
                                    <span class="time">5 hours ago</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Inject dashboard styles if not present
        this.injectDashboardStyles();
    },

    renderVehicles() {
        this.dom.contentView.innerHTML = `
            <div class="view-header">
                <h2>Vehicles</h2>
                <button class="primary-btn">
                    <i data-lucide="plus"></i> Add Vehicle
                </button>
            </div>
            <div class="card table-container">
                <table class="grid-table">
                    <thead>
                        <tr>
                            <th>Plate</th>
                            <th>Model</th>
                            <th>Driver</th>
                            <th>Status</th>
                            <th>Fuel Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.state.vehicles.map(v => `
                            <tr>
                                <td class="plate-cell"><span>${v.plate}</span></td>
                                <td>${v.model}</td>
                                <td>${v.driver}</td>
                                <td><span class="status-badge ${v.status.toLowerCase().replace(' ', '-')}">${v.status}</span></td>
                                <td>
                                    <div class="fuel-bar">
                                        <div class="fill" style="width: ${v.fuelLevel}%"></div>
                                        <span>${v.fuelLevel}%</span>
                                    </div>
                                </td>
                                <td>
                                    <button class="icon-btn-sm"><i data-lucide="more-horizontal"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderFuel() {
        this.dom.contentView.innerHTML = `
            <div class="view-header">
                <h2>Fuel Logs & Consolidation</h2>
                <div class="action-group" style="display: flex; gap: 1rem;">
                    <button class="secondary-btn" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--border-color); padding: 0.6rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        <i data-lucide="upload-cloud"></i> Import SOLRED/CEPSA
                    </button>
                    <button class="primary-btn">
                        <i data-lucide="plus"></i> Add Entry
                    </button>
                </div>
            </div>
            
            <div class="summary-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <div class="card">
                    <h3>Consolidated Consumption</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">Last 30 days based on invoice imports</p>
                    <div style="font-size: 1.8rem; font-weight: 700; margin-top: 1rem; color: var(--accent-gold);">4,280.50 L</div>
                </div>
                <div class="card">
                    <h3>Average Cost</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">Average price per Liter (Excl. VAT)</p>
                    <div style="font-size: 1.8rem; font-weight: 700; margin-top: 1rem; color: var(--success);">1.42 €/L</div>
                </div>
            </div>

            <div class="card table-container">
                <table class="grid-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Vehicle</th>
                            <th>Provider</th>
                            <th>Location</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Audit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2026-03-05</td>
                            <td>7742-LMX</td>
                            <td><span class="provider solred">SOLRED</span></td>
                            <td>Station E-45, Madrid</td>
                            <td>450.00 L</td>
                            <td>639,00 €</td>
                            <td><i data-lucide="check-circle" style="color: var(--success); width: 16px;"></i></td>
                        </tr>
                        <tr>
                            <td>2026-03-04</td>
                            <td>1289-KJS</td>
                            <td><span class="provider cepsa">CEPSA</span></td>
                            <td>A-2 km 103, Guadalajara</td>
                            <td>320.50 L</td>
                            <td>458,31 €</td>
                            <td><i data-lucide="check-circle" style="color: var(--success); width: 16px;"></i></td>
                        </tr>
                        <tr>
                            <td>2026-03-01</td>
                            <td>4560-PBC</td>
                            <td><span class="provider solred">SOLRED</span></td>
                            <td>N-VI km 45, Segovia</td>
                            <td>120.00 L</td>
                            <td>170,40 €</td>
                            <td><i data-lucide="alert-circle" style="color: var(--accent-gold); width: 16px;" title="Weekend refuel detected"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <style>
                .provider { font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
                .provider.solred { background: #ffcc00; color: #000; }
                .provider.cepsa { background: #e30613; color: #fff; }
            </style>
        `;
    },

    injectDashboardStyles() {
        if (document.getElementById('dashboard-styles')) return;
        const style = document.createElement('style');
        style.id = 'dashboard-styles';
        style.textContent = `
            .dashboard-grid { display: flex; flex-direction: column; gap: 2rem; }
            .grid-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
            .stat-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
            .stat-title { color: var(--text-secondary); font-size: 0.9rem; font-weight: 600; }
            .stat-value { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; font-family: 'Outfit'; }
            .stat-icon { border-radius: 8px; padding: 4px; }
            .stat-icon.blue { color: var(--accent-blue); background: rgba(56, 189, 248, 0.1); }
            .stat-icon.gold { color: var(--accent-gold); background: rgba(251, 191, 36, 0.1); }
            .stat-icon.green { color: var(--success); background: rgba(74, 222, 128, 0.1); }
            .stat-icon.red { color: var(--danger); background: rgba(248, 113, 113, 0.1); }
            .stat-trend { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; font-weight: 600; }
            .stat-trend.positive { color: var(--success); }
            .stat-trend.negative { color: var(--danger); }
            
            .dashboard-main { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
            .chart-placeholder { height: 200px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; margin-top: 1rem; }
            
            .activity-list { list-style: none; margin-top: 1rem; }
            .activity-list li { display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--border-color); }
            .activity-icon { color: var(--accent-blue); }
            .activity-icon.warning { color: var(--accent-gold); }
            .activity-details p { font-size: 0.9rem; }
            .activity-details .time { font-size: 0.75rem; color: var(--text-secondary); }

            .view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
            .primary-btn { background: var(--accent-blue); color: #000; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: var(--transition); }
            .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px var(--accent-blue-glow); }
            
            .grid-table { width: 100%; border-collapse: collapse; text-align: left; }
            .grid-table th { padding: 1rem; color: var(--text-secondary); font-weight: 500; font-size: 0.85rem; border-bottom: 1px solid var(--border-color); }
            .grid-table td { padding: 1rem; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; }
            .plate-cell span { background: #fff; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: 700; border: 2px solid #333; }
            .status-badge { padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
            .status-badge.active { background: rgba(74, 222, 128, 0.1); color: var(--success); }
            .status-badge.in-transit { background: rgba(56, 189, 248, 0.1); color: var(--accent-blue); }
            .status-badge.maintenance { background: rgba(248, 113, 113, 0.1); color: var(--danger); }
            .fuel-bar { width: 100%; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; position: relative; margin-top: 5px; }
            .fuel-bar .fill { height: 100%; background: var(--accent-gold); border-radius: 3px; }
            .fuel-bar span { position: absolute; right: 0; top: -18px; font-size: 0.7rem; color: var(--text-secondary); }
        `;
        document.head.appendChild(style);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
export default App;
