import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('SUPABASE_URL LIDA:', supabaseUrl);
console.log('SUPABASE_KEY EXISTE:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
