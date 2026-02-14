import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
  console.log('🧪 Testing Gemini API...');
  console.log('🔑 API Key:', process.env.GEMINI_API_KEY?.substring(0, 20) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    
    // Try gemini-3-flash-preview first
    console.log('\n📝 Trying model: gemini-3-flash-preview');
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const result = await model.generateContent('Say hello in one word');
    const response = await result.response;
    console.log('✅ Response:', response.text());
    console.log('\n✅ Gemini is working! Use model: gemini-3-flash-preview');
    
  } catch (error: any) {
    console.log('❌ Error:', error.message);
    
    // Try alternative model
    try {
      console.log('\n📝 Trying alternative model: gemini-1.0-pro');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
      const result = await model.generateContent('Say hello in one word');
      const response = await result.response;
      console.log('✅ Response:', response.text());
      console.log('\n✅ Gemini is working! Use model: gemini-1.0-pro');
    } catch (error2: any) {
      console.log('❌ Alternative also failed:', error2.message);
      console.log('\n⚠️  Please check your API key at: https://aistudio.google.com/app/apikey');
    }
  }
}

testGemini();