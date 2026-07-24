import { supabaseClient, initSupabase, isConnectedToSupabase } from './supabaseClient.js';
import { drivers, renderDrivers, addDriver, updateDriverDropdowns } from './motoristas.js';
import { renderFinanceiro } from './financeiro.js';

window.databaseAgenda = [
    { id: '1', dia: 13, hora: "08:15", tipo: "transfer", cliente: "Marcos Vinicius", localizacao: "Ezeiza (EZE) ✈ Hotel Savoy", motorista: "Paulo Souza", status: "concluido", valorCliente: 120, valorMotorista: 80, pagoCliente: true, pagoMotorista: true },
    { id: '2', dia: 14, hora: "08:00", tipo: "transfer", cliente: "João Silva", localizacao: "Ezeiza (EZE) ✈ Hilton", motorista: "Paulo Souza", status: "concluido", valorCliente: 130, valorMotorista: 80, pagoCliente: true, pagoMotorista: false }
];

window.selectedDay = new Date().toISOString().split('T')[0];
window.selectedCategory = 'todos';

window.switchTab = function(tabId) {
    document.querySelectorAll('.view-section').forEach(view => view.classList.add('hidden'));
    const element = document.getElementById('view-' + tabId);
    if (element) element.classList.remove('hidden');

    const navTabs = ['dashboard', 'agenda', 'motoristas', 'servicos', 'financeiro', 'clientes'];
    navTabs.forEach(t => {
        const btnId = t === 'dashboard' ? 'nav-dash' : 
                      t === 'agenda' ? 'nav-agenda' : 
                      t === 'motoristas' ? 'nav-moto' : 
                      t === 'servicos' ? 'nav-serv' : 
                      t === 'financeiro' ? 'nav-fin' : 'nav-clientes';
        
        const btn = document.getElementById(btnId);
        if (btn) {
            if (t === tabId) {
                btn.className = "text-white font-bold border-b-2 border-white pb-1 transition";
            } else {
                btn.className = "text-blue-200 hover:text-white font-semibold transition";
            }
        }
    });

    if (tabId === 'dashboard') renderDashboard();
    if (tabId === 'agenda') renderAgenda();
    if (tabId === 'motoristas') renderDrivers();
    if (tabId === 'financeiro') renderFinanceiro(window.databaseAgenda);
    if (tabId === 'clientes') renderClientes();
};

window.showToast = function(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
};

window.renderDashboard = function() {
    const dashChegadas = document.getElementById('dash-chegadas-hoje');
    const dashPasseios = document.getElementById('dash-passeios-hoje');
    const dashDrivers = document.getElementById('dash-drivers-count');
    const dashFaturamento = document.getElementById('dash-faturamento');

    if (dashChegadas) dashChegadas.innerText = window.databaseAgenda.length;
    if (dashDrivers) dashDrivers.innerText = drivers.length;
    if (dashFaturamento) dashFaturamento.innerText = `$ ${window.databaseAgenda.reduce((s, i) => s + i.valorCliente, 0)}`;

    const container = document.getElementById('dashActivitiesContainer');
    if (!container) return;
    container.innerHTML = window.databaseAgenda.map(i => `
        <div class="p-3 bg-gray-50 rounded-xl border flex justify-between text-xs">
            <div><p class="font-bold">${i.hora} - ${i.cliente}</p><p class="text-gray-500">${i.localizacao}</p></div>
            <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">Confirmado</span>
        </div>
    `).join('');
};

window.renderAgenda = function() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    container.innerHTML = window.databaseAgenda.map(item => `
        <div class="bg-white p-4 rounded-xl border border-l-4 border-blue-900 shadow-sm mb-2">
            <p class="font-bold text-sm">${item.hora} - ${item.cliente}</p>
            <p class="text-xs text-gray-600">${item.localizacao}</p>
        </div>
    `).join('');
};

window.gerarDiasAgenda = function() {
    const container = document.getElementById('containerDiasAgenda');
    if (!container) return;
    container.innerHTML = `
        <div class="p-3 bg-blue-900 text-white rounded-xl text-center">
            <span class="block text-xs uppercase">Hoje</span>
            <span class="text-lg font-bold">${new Date().getDate()}</span>
        </div>
    `;
};

window.openDbSettingsModal = function() {
    document.getElementById('dbSettingsModal').classList.remove('opacity-0', 'pointer-events-none');
    document.getElementById('dbSettingsModal').classList.add('opacity-100');
};
window.closeDbSettingsModal = function() {
    document.getElementById('dbSettingsModal').classList.remove('opacity-100');
    document.getElementById('dbSettingsModal').classList.add('opacity-0', 'pointer-events-none');
};
window.openQuickAddModal = function() {
    document.getElementById('quickModal').classList.remove('opacity-0', 'pointer-events-none');
    document.getElementById('quickModal').classList.add('opacity-100');
};
window.closeQuickAddModal = function() {
    document.getElementById('quickModal').classList.remove('opacity-100');
    document.getElementById('quickModal').classList.add('opacity-0', 'pointer-events-none');
};

document.addEventListener('DOMContentLoaded', async () => {
    await initSupabase();
    window.switchTab('dashboard');
    renderDrivers();
    gerarDiasAgenda();
    updateDriverDropdowns();
    console.log("Turismundo CRM modularizado com sucesso!");
});