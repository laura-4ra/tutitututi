import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wgoqpugtmvmpddioncgq.supabase.co";
const supabaseKey = "sb_publishable_LhSmVTPwEydB4Elx0Yb65w_OwEREUj3";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);