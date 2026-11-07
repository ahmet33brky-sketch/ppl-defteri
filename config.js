// Supabase bağlantı bilgileri (Supabase panelinde: Project Settings → API).
// supabaseKey olarak "anon public" / "publishable" anahtarı gir; "service_role" / "secret" anahtarını ASLA buraya yazma.
// Bu anahtar tarayıcıda görünür olacak şekilde tasarlanmıştır; kayıtlar Row Level Security ile sadece sahibine açıktır.
// İkisi de boş kalırsa site eşitlemesiz çalışır ve kayıtlar sadece o cihazda tutulur.
window.PPL_CONFIG = {
  supabaseUrl: "https://ttevfupiipbjazoelhru.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZXZmdXBpaXBiamF6b2VsaHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwMzI1MjcsImV4cCI6MjEwOTYwODUyN30.i33PUyxGBFSrC34nFHKAohoTTO3fjKAwPy_b8UX3FHg"
};
