import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PulseRequest {
  walletAddress: string;
  chains: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const path = url.pathname;

    if (path.includes("/pulse") && req.method === "POST") {
      const { walletAddress, chains }: PulseRequest = await req.json();
      const startTime = Date.now();

      const scanPromises = chains.map(async (chain) => {
        const balance = Math.random() * (chain === "ETH" ? 10 : chain === "SOL" ? 100 : 0.5);
        const riskScore = balance < 0.1 ? "high" : balance < 1 ? "medium" : "low";
        const riskFlags = balance < 0.1 ? ["Low balance"] : [];

        const { data } = await supabase
          .from("scan_history")
          .insert({
            wallet_address: walletAddress,
            chain,
            balance,
            risk_score: riskScore,
            risk_flags: riskFlags,
          })
          .select()
          .single();

        return data;
      });

      const scans = await Promise.all(scanPromises);

      const yieldPromises = chains.map(async (chain) => {
        const validators = chain === "ETH" 
          ? [{ name: "Lido", apy: 3.8 }, { name: "Rocket Pool", apy: 3.5 }]
          : [{ name: "Jito", apy: 7.2 }, { name: "Marinade", apy: 6.8 }];

        const yieldData = validators.map((v) => ({
          chain,
          validator_name: v.name,
          apy: v.apy,
          commission: Math.random() * 15,
          effectiveness: 95 + Math.random() * 5,
          recommended_stake: Math.random() * 10,
        }));

        const { data } = await supabase
          .from("yield_opportunities")
          .insert(yieldData)
          .select();

        return data || [];
      });

      const yields = (await Promise.all(yieldPromises)).flat();

      const pairs = ["ETH/USDT", "SOL/USDT"];
      const arbData = pairs.map((pair) => ({
        pair,
        exchange_buy: "Binance",
        exchange_sell: "Coinbase",
        price_buy: 2400 + Math.random() * 50,
        price_sell: 2420 + Math.random() * 50,
        spread_percent: 0.5 + Math.random() * 2,
        estimated_profit: 10 + Math.random() * 40,
      }));

      const { data: arbitrages } = await supabase
        .from("arbitrage_alerts")
        .insert(arbData)
        .select();

      const executionTime = Date.now() - startTime;
      const totalValue = scans.reduce((sum, s) => sum + (s?.balance || 0), 0);

      const { data: session } = await supabase
        .from("pulse_sessions")
        .insert({
          wallet_address: walletAddress,
          chains,
          total_value: totalValue,
          yield_opportunities_count: yields.length,
          arbitrage_alerts_count: arbitrages?.length || 0,
          execution_time_ms: executionTime,
        })
        .select()
        .single();

      return new Response(
        JSON.stringify({
          session,
          scans,
          yields,
          arbitrages: arbitrages || [],
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (path.includes("/recent-sessions")) {
      const { data } = await supabase
        .from("pulse_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      return new Response(JSON.stringify(data || []), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});