// Supabase bağlantı bilgileri (Supabase panelinde: Project Settings → API).
// supabaseKey olarak "anon public" / "publishable" anahtarı gir; "service_role" / "secret" anahtarını ASLA buraya yazma.
// Bu anahtar tarayıcıda görünür olacak şekilde tasarlanmıştır; kayıtlar Row Level Security ile sadece sahibine açıktır.
// İkisi de boş kalırsa site eşitlemesiz çalışır ve kayıtlar sadece o cihazda tutulur.
window.PPL_CONFIG = {
  supabaseUrl: "",
  supabaseKey: ""
};
