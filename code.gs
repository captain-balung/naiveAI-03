function doGet(e) {
    const food = e.parameter.food || "hamburger";
    const drink = e.parameter.drink || "milk";
    
    const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      return ContentService.createTextOutput(JSON.stringify({"english": "Error: No API Key", "chinese": "錯誤：無 API Key"}))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  
    const prompt = `你是一個專為台灣小學四年級學生設計遊戲結局的英文編劇。
    玩家剛剛選擇了早餐：食物是「${food}」，飲料是「${drink}」。
    請在現實生活範圍內，創作一個「極度誇張、搞笑或有點倒楣」的突發狀況作為結局。不要有魔法或科幻元素。
    直接輸出 JSON：{"english": "3到4句簡單英文短句描述結局", "chinese": "對應中文"}`;
  
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
    const payload = { "contents": [{"parts": [{"text": prompt}]}] };
    const options = { "method": "post", "contentType": "application/json", "payload": JSON.stringify(payload), "muteHttpExceptions": true };
  
    try {
      const response = UrlFetchApp.fetch(url, options);
      const json = JSON.parse(response.getContentText());
      
      let textResponse = json.candidates[0].content.parts[0].text;
      textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
  
      // 回傳純 JSON 資料，這樣前端才抓得到
      return ContentService.createTextOutput(textResponse)
                           .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      const fallback = {"english": `You eat the ${food} and drink the ${drink}. It is yummy!`, "chinese": `你吃了${food}喝了${drink}。非常美味！`};
      return ContentService.createTextOutput(JSON.stringify(fallback))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  }