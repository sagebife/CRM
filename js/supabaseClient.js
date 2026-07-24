import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Credenciais fixas e definitivas do seu projeto Supabase
const supabaseUrl = 'https://xjjflsdtaruzaekadqoq.supabase.co';
const supabaseKey = 'sb_publishable_4w28HISw0UqCywyYMbm-8w_LVHV2ltM';

export const supabaseClient = createClient(supabaseUrl, supabaseKey);
export let isConnectedToSupabase = false;

export async function initSupabase() {
    const statusBtn = document.getElementById('db-status-btn');
    const statusText = document.getElementById('db-status-text');
    const dbIcon = document.getElementById('db-icon');

    try {
        const { error } = await supabaseClient.from('motoristas').select('*').limit(1);
        if (error) throw error;
        
        isConnectedToSupabase = true;

        if (statusBtn) {
            statusBtn.className = "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-emerald-500/30 bg-emerald-500/10 text-emerald-600";
            statusText.innerText = "Supabase Conectado";
            dbIcon.className = "fas fa-cloud text-emerald-500 animate-pulse";
        }
        return true;
    } catch (e) {
        console.error("Erro na conexão automática com o Supabase:", e);
        isConnectedToSupabase = false;
        
        if (statusBtn) {
            statusBtn.className = "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-dashed border-red-400 text-red-200";
            statusText.innerText = "Erro na Conexão";
            dbIcon.className = "fas fa-database text-red-400";
        }
        return false;
    }
}

// Funções mantidas para evitar erros caso algum botão antigo as chame
window.saveDbConfig = function() {
    window.showToast("O banco já está configurado de forma automática!");
    window.closeDbSettingsModal();
};

window.clearDbConfig = function() {
    window.showToast("A conexão é fixa neste ambiente.");
    window.closeDbSettingsModal();
};