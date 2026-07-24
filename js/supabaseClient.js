import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const savedUrl = localStorage.getItem('supabase_url') || 'https://xjjflsdtaruzaekadqoq.supabase.co';
const savedKey = localStorage.getItem('supabase_key') || 'sb_publishable_4w28HISw0UqCywyYMbm-8w_LVHV2ltM';

export const supabaseClient = createClient(savedUrl, savedKey);
export let isConnectedToSupabase = false;

export async function initSupabase() {
    try {
        const { error } = await supabaseClient.from('motoristas').select('*').limit(1);
        if (error) throw error;
        isConnectedToSupabase = true;
        return true;
    } catch (e) {
        isConnectedToSupabase = false;
        return false;
    }
}

// Expõe as funções do modal de configuração globalmente para o HTML enxergar
window.saveDbConfig = function() {
    const url = document.getElementById('dbUrlInput').value.trim();
    const key = document.getElementById('dbKeyInput').value.trim();

    if (!url || !key) {
        window.showToast("Por favor, preencha as duas credenciais.");
        return;
    }

    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_key', key);
    
    window.closeDbSettingsModal();
    window.location.reload(); // Recarrega a página aplicando a nova conexão
};

window.clearDbConfig = function() {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_key');
    window.closeDbSettingsModal();
    window.showToast("Banco desconectado.");
    window.location.reload();
};