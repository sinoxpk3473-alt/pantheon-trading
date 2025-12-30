require("dotenv").config();

async function checkAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ No API Key found in .env!");
    return;
  }

  console.log("🔍 Querying Google API for available models...");
  
  // We use direct fetch to bypass any library version issues
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error.message);
      return;
    }

    console.log("\n✅ MODELS YOU CAN USE (Copy one of these exactly):");
    console.log("------------------------------------------------");
    
    const validModels = data.models.filter(m => 
      m.supportedGenerationMethods.includes("generateContent")
    );

    if (validModels.length === 0) {
      console.log("⚠️ No text-generation models found. Your API key might be restricted.");
    } else {
      validModels.forEach(model => {
        // We strip 'models/' from the start because the SDK adds it automatically
        console.log(`"${model.name.replace("models/", "")}"`);
      });
    }
    console.log("------------------------------------------------");

  } catch (err) {
    console.error("❌ Network Error:", err);
  }
}

checkAvailableModels();