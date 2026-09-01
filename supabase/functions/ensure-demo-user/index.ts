import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEMO_EMAIL = "demo@skillit.com";
const DEMO_PASSWORD = "SkillItDemo2026!";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase admin configuration is missing");
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: usersData, error: listError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (listError) throw listError;

    let demoUser = usersData.users.find(
      (user) => user.email?.toLowerCase() === DEMO_EMAIL,
    );

    if (!demoUser) {
      const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: {
          name: "Skill It Demo User",
          role: "Demo Learner",
          interests: "Career development, skill exchange",
          bio: "A shared demo account for exploring Skill It.",
        },
      });

      if (createError) throw createError;
      demoUser = createdUser.user;
    }

    const { data: existingProfile, error: profileLookupError } = await admin
      .from("profiles")
      .select("id")
      .eq("user_id", demoUser.id)
      .limit(1)
      .maybeSingle();

    if (profileLookupError) throw profileLookupError;

    if (!existingProfile) {
      const { error: profileError } = await admin.from("profiles").insert({
        user_id: demoUser.id,
        name: "Skill It Demo User",
        role: "Demo Learner",
        interests: "Career development, skill exchange",
        bio: "A shared demo account for exploring Skill It.",
        email: DEMO_EMAIL,
        mobile_number: "+1 555 010 2026",
        approved: true,
        approved_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;
    }

    return new Response(JSON.stringify({ ready: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to prepare demo account";
    console.error("Error ensuring demo user:", message);

    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});