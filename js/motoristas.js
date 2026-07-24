import { supabaseClient, isConnectedToSupabase } from './supabaseClient.js';

export let mockDrivers = [
    { id: 'd1111111-1111-1111-1111-111111111111', nome: "Paulo Souza", telefone: "5511999999999", veiculo: "Chevrolet Spin", placa: "PNG-8D43", pix: "paulo.transfers@gmail.com", valor: "80", moeda: "USD", capacidade: "6", avaliacao: 5, corridas: 142 },
    { id: 'd2222222-2222-2222-2222-222222222222', nome: "Jorge Martinez", telefone: "5491133334444", veiculo: "Toyota Corolla", placa: "AE-234-OP", pix: "jorge.mercado.pago", valor: "50", moeda: "USD", capacidade: "4", avaliacao: 4, corridas: 98 },
    { id: 'd3333333-3333-3333-3333-333333333333', nome: "Carlos Gomez", telefone: "5491155556666", veiculo: "Mercedes Sprinter", placa: "AD-987-ZZ", pix: "carlos.sprinter.pix", valor: "150", moeda: "USD", capacidade: "15", avaliacao: 5, corridas: 210 }
];

export let drivers = [...mockDrivers];

export function renderDrivers(dataToRender = drivers) {
    const container = document.getElementById('driversList');
    if (!container) return;
    container.innerHTML = '';

    dataToRender.forEach(driver => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<i class="fas fa-star ${i < driver.avaliacao ? 'text-amber-400' : 'text-gray-200'} text-xs"></i>`;
        }

        container.innerHTML += `
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 flex flex-col justify-between">
                <div>
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 font-bold flex items-center justify-center text-lg shadow-sm">
                                ${driver.nome.charAt(0)}
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-800 text-base leading-tight">${driver.nome}</h3>
                                <div class="flex gap-1 mt-1">${stars}</div>
                            </div>
                        </div>
                        <button onclick="deleteDriver('${driver.id}')" class="text-gray-300 hover:text-red-500 transition text-sm p-1">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>

                    <div class="bg-gray-50 p-3 rounded-xl space-y-1.5 text-xs text-gray-600 mb-3 border border-gray-100">
                        <p class="flex justify-between"><span>🚗 Veículo:</span> <span class="text-gray-900 font-semibold">${driver.veiculo}</span></p>
                        <p class="flex justify-between"><span>🔢 Placa:</span> <span class="bg-gray-200 px-1.5 py-0.5 rounded font-mono font-bold">${driver.placa}</span></p>
                        <p class="flex justify-between"><span>👥 Cap. Max:</span> <span class="text-gray-900 font-semibold">${driver.capacidade} pax</span></p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                    <a href="https://wa.me/${driver.telefone}" target="_blank" class="py-2.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition text-center font-bold text-xs flex items-center justify-center gap-1.5">
                        <i class="fab fa-whatsapp text-sm"></i> Chamar
                    </a>
                    <div class="py-2.5 bg-gray-50 text-gray-700 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5">
                        <i class="fas fa-route text-blue-500"></i> ${driver.corridas} viagens
                    </div>
                </div>
            </div>
        `;
    });

    const activeCountEl = document.getElementById('activeCount');
    const totalTripsEl = document.getElementById('totalTripsCount');
    if (activeCountEl) activeCountEl.innerText = drivers.length;
    if (totalTripsEl) totalTripsEl.innerText = drivers.reduce((sum, d) => sum + Number(d.corridas), 0);
}

export async function addDriver(event) {
    event.preventDefault();
    const name = document.getElementById('driverName').value;
    const phone = document.getElementById('driverPhone').value;
    const vehicle = document.getElementById('driverVehicle').value;
    const plate = document.getElementById('driverPlate').value.toUpperCase();
    const pix = document.getElementById('driverPix').value;
    const value = document.getElementById('driverValue').value;
    const currency = document.getElementById('driverCurrency').value;
    const capacity = document.getElementById('driverCapacity').value;

    if (isConnectedToSupabase && supabaseClient) {
        try {
            const { error } = await supabaseClient.from('motoristas').insert([{
                nome: name, telefone: phone, veiculo: vehicle, placa: plate, pix: pix,
                valor_combinado: parseFloat(value), moeda: currency, capacidade: parseInt(capacity)
            }]);
            if (error) throw error;
            window.showToast("Motorista cadastrado no Supabase!");
        } catch (err) {
            window.showToast("Erro ao salvar motorista no banco.");
        }
    } else {
        drivers.unshift({
            id: String(Date.now()), nome: name, telefone: phone, veiculo: vehicle,
            placa: plate, pix: pix, valor: value, moeda: currency, capacidade: capacity, avaliacao: 5, corridas: 0
        });
        renderDrivers();
        window.showToast("Motorista ativado na simulação!");
    }
    document.getElementById('driverForm').reset();
}

export function updateDriverDropdowns() {
    const select = document.getElementById('modalDriverSelect');
    if (!select) return;
    select.innerHTML = '';
    drivers.forEach(d => {
        select.innerHTML += `<option value="${d.id}">${d.nome} (${d.veiculo})</option>`;
    });
}