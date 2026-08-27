// Liquid Glass Analytical Core Engine Store
let riskRegister = [];

const matrixScoreMapping = [
    ['m-low', 'm-low', 'm-med', 'm-med', 'm-high'],
    ['m-low', 'm-med', 'm-med', 'm-high', 'm-high'],
    ['m-med', 'm-med', 'm-high', 'm-high', 'm-crit'],
    ['m-med', 'm-high', 'm-high', 'm-crit', 'm-crit'],
    ['m-high', 'm-high', 'm-crit', 'm-crit', 'm-crit']
];

const aiHeuristicEngine = {
    Technical: {
        low: ["Establish recurring data backup intervals.", "Isolate baseline performance code testing parameters."],
        medium: ["Implement redundancy systems across structural dependencies.", "Run architectural peer reviews before production deployment."],
        high: ["Enforce multi-zone automatic failover structures immediately.", "Lock down microservices architecture behind API gatekeepers."]
    },
    Financial: {
        low: ["Track operational variations monthly against target margins.", "Keep a standard emergency reserve fund."],
        medium: ["Diversify suppliers to hedge against variable component inflation.", "Use standard fixed-price contracts to lock in operational expenses."],
        high: ["Execute currency hedging actions immediately.", "Re-negotiate credit terms and pause secondary non-essential operational spending."]
    },
    Operational: {
        low: ["Update standard operating procedure (SOP) documentation sets.", "Cross-train backup resources for core administrative work."],
        medium: ["Run automated monitoring checks on tracking bottlenecks.", "Enforce strict quality assurance sign-off checks on intermediate milestones."],
        high: ["Deploy an immediate incident response team.", "Activate a secondary logistics route and set up disaster recovery workspaces."]
    },
    Legal: {
        low: ["Review quarterly system logs for fundamental alignment compliance.", "Archive digital audit footings safely."],
        medium: ["Consult external compliance counsels regarding updated policy conditions.", "Set up mandatory training updates for engineering frameworks."],
        high: ["Issue immediate structural compliance stop-orders on failing units.", "Run deep system audits to eliminate liabilities."]
    }
};

const riskForm = document.getElementById('riskForm');
const matrixGrid = document.getElementById('matrixGrid');
const riskTableBody = document.getElementById('riskTableBody');
const totalRisksEl = document.getElementById('totalRisks');
const criticalRisksEl = document.getElementById('criticalRisks');
const avgScoreEl = document.getElementById('avgScore');
const aiOutputEl = document.getElementById('aiOutput');

function renderMatrixView() {
    matrixGrid.innerHTML = '';
    for (let p = 5; p >= 1; p--) {
        for (let i = 1; i <= 5; i++) {
            const cell = document.createElement('div');
            cell.className = `matrix-cell ${matrixScoreMapping[p-1][i-1]}`;
            cell.dataset.p = p;
            cell.dataset.i = i;
            cell.innerText = `${p}×${i}`;
            matrixGrid.appendChild(cell);
        }
    }
}

riskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('riskName').value;
    const probability = parseInt(document.getElementById('probability').value);
    const impact = parseInt(document.getElementById('impact').value);
    const category = document.getElementById('category').value;
    
    const compositeScore = probability * impact;
    let classification = 'Low';
    
    if (compositeScore >= 15) classification = 'Critical';
    else if (compositeScore >= 8) classification = 'Medium';

    const newRisk = {
        id: 'RSK-' + Math.floor(1000 + Math.random() * 9000),
        name, probability, impact, category, compositeScore, classification
    };

    riskRegister.push(newRisk);
    updateDashboardMetrics();
    generateAiMitigationAdvice(newRisk);
    highlightActiveMatrixNode(probability, impact);
    riskForm.reset();
});

function updateDashboardMetrics() {
    totalRisksEl.innerText = riskRegister.length;
    
    const criticalCount = riskRegister.filter(r => r.classification === 'Critical').length;
    criticalRisksEl.innerText = criticalCount;
    
    const totalScoreSum = riskRegister.reduce((sum, r) => sum + r.compositeScore, 0);
    avgScoreEl.innerText = riskRegister.length ? (totalScoreSum / riskRegister.length).toFixed(1) : '0.0';

    riskTableBody.innerHTML = '';
    riskRegister.forEach(r => {
        const badgeClass = r.classification === 'Critical' ? 'bg-high' : (r.classification === 'Medium' ? 'bg-med' : 'bg-low');
        const row = `<tr>
            <td><strong>${r.id}</strong><br><small style="color:var(--text-muted)">${r.name}</small></td>
            <td>${r.category}</td>
            <td>${r.probability}</td>
            <td>${r.impact}</td>
            <td><strong>${r.compositeScore}</strong></td>
            <td><span class="badge ${badgeClass}">${r.classification}</span></td>
            <td><button class="btn-delete" onclick="removeRiskRecord('${r.id}')">🗑️</button></td>
        </tr>`;
        riskTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function generateAiMitigationAdvice(riskNode) {
    const tier = riskNode.compositeScore >= 15 ? 'high' : (riskNode.compositeScore >= 8 ? 'medium' : 'low');
    const strategies = aiHeuristicEngine[riskNode.category][tier];

    aiOutputEl.innerHTML = `
        <div class="strategy-box">
            <div style="margin-bottom: 0.5rem; font-size:0.95rem;">
                <strong>Active Profile Node:</strong> <span style="color:#60a5fa">${riskNode.id}</span>
            </div>
            <div style="font-size:0.9rem;"><strong>Threat Level Matrix Verdict:</strong> 
                <span style="color:${tier === 'high' ? '#f87171' : (tier === 'medium' ? '#fbbf24' : '#34d399')}; font-weight:700;">
                    ${riskNode.classification.toUpperCase()} RISK
                </span>
            </div>
            <ul class="strategy-list">
                ${strategies.map(strat => `<li>🔑 ${strat}</li>`).join('')}
            </ul>
        </div>
    `;
}

function highlightActiveMatrixNode(prob, imp) {
    document.querySelectorAll('.matrix-cell').forEach(cell => cell.classList.remove('active-node'));
    const targetCell = document.querySelector(`.matrix-cell[data-p="${prob}"][data-i="${imp}"]`);
    if (targetCell) targetCell.classList.add('active-node');
}

window.removeRiskRecord = function(riskId) {
    riskRegister = riskRegister.filter(r => r.id !== riskId);
    updateDashboardMetrics();
    aiOutputEl.innerHTML = `<div class="ai-placeholder">Record instance deleted. Ready for new structural telemetry inputs.</div>`;
    document.querySelectorAll('.matrix-cell').forEach(cell => cell.classList.remove('active-node'));
};

renderMatrixView();
