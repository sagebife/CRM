export function renderFinanceiro(databaseAgenda) {
    const tableBody = document.getElementById('financeTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    let totalFaturamento = 0;
    let totalRepasses = 0;
    let totalLucro = 0;
    let totalPendente = 0;

    databaseAgenda.forEach(item => {
        const valorCliente = Number(item.valorCliente) || 0;
        const valorMotorista = Number(item.valorMotorista) || 0;
        const lucro = valorCliente - valorMotorista;

        totalFaturamento += valorCliente;
        totalRepasses += valorMotorista;
        totalLucro += lucro;

        if (!item.pagoCliente) totalPendente += valorCliente;

        tableBody.innerHTML += `
            <tr class="hover:bg-gray-50/50 transition">
                <td class="p-4 font-bold text-gray-950">${item.cliente}</td>
                <td class="p-4 font-semibold text-gray-700">${item.motorista}</td>
                <td class="p-4 text-right font-bold text-blue-900">$ ${valorCliente}</td>
                <td class="p-4 text-right font-bold text-red-600">$ ${valorMotorista}</td>
                <td class="p-4 text-right font-black text-emerald-600">$ ${lucro}</td>
                <td class="p-4 text-center"><span class="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold">Recebido</span></td>
                <td class="p-4 text-center"><span class="px-2 py-1 bg-red-100 text-red-800 rounded-lg text-[10px] font-bold">A pagar</span></td>
            </tr>
        `;
    });

    document.getElementById('fin-faturamento').innerText = `$ ${totalFaturamento.toLocaleString()}`;
    document.getElementById('fin-repasses').innerText = `$ ${totalRepasses.toLocaleString()}`;
    document.getElementById('fin-lucro').innerText = `$ ${totalLucro.toLocaleString()}`;
    document.getElementById('fin-pendente').innerText = `$ ${totalPendente.toLocaleString()}`;
}