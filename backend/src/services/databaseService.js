const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

const saveLead = async (contactData, leadAnalysis) => {
    if (!supabaseUrl || !supabaseKey) {
        console.warn("⚠️ SUPABASE_URL o SUPABASE_KEY no configuradas. Saltando guardado en DB.");
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([
                {
                    name: contactData.name,
                    email: contactData.email,
                    phone: contactData.phone,
                    message: contactData.message,
                    score: leadAnalysis.score,
                    priority: leadAnalysis.priority,
                    analysis: leadAnalysis.analysis,
                    suggested_action: leadAnalysis.suggestedAction,
                    created_at: new Date().toISOString()
                },
            ])
            .select();

        if (error) throw error;

        console.log('✅ Lead guardado en Supabase con éxito');
        return data;
    } catch (error) {
        console.error('❌ Error guardando en Supabase:', error.message);
        return null;
    }
};

const getLeads = async () => {
    if (!supabaseUrl || !supabaseKey) return [];

    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('❌ Error obteniendo leads de Supabase:', error.message);
        return [];
    }
};

const getUserByUsername = async (username) => {
    if (!supabaseUrl || !supabaseKey) return null;

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No se encontró el usuario
            throw error;
        }
        return data;
    } catch (error) {
        console.error('❌ Error obteniendo usuario de Supabase:', error.message);
        return null;
    }
};

module.exports = { saveLead, getLeads, getUserByUsername };

