import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { master, metCourses, missingCourses } = body;
    
    // Güvenli yöntem: Şifreyi .env.local'dan çekiyoruz
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
       console.error("Şifre Bulunamadı: .env.local dosyası okunamıyor.");
       return NextResponse.json({ advice: "API Key bulunamadı! Lütfen .env.local dosyasını kontrol et ve sunucuyu yeniden başlat (npm run dev)." }, { status: 500 });
    }

    const prompt = `
      Sen Eindhoven University of Technology (TU/e) için uzman bir akademik danışmansın.
      Bir öğrenci "${master}" master programına başvurmayı planlıyor.
      
      Öğrencinin başarıyla tamamladığı lisans dersleri: 
      ${metCourses.map((c: any) => c.name).join(', ') || 'Yok'}
      
      Öğrencinin EKSİK olduğu master önkoşulları: 
      ${missingCourses.map((c: any) => c.name).join(', ') || 'Yok'}
      
      Öğrenciye kısa, profesyonel ve yönlendirici bir tavsiye ver. 
      Eğer eksiği yoksa onu tebrik et ve kabul şansını artıracak portfolyo önerileri ver. 
      Eğer eksiği varsa, bu dersleri lisans eğitiminin Q3/Q4 dönemlerinde almasının ne kadar kritik olduğunu, aksi takdirde pre-master okumak zorunda kalacağını dostane bir dille anlat.
      Sadece doğrudan öğrenciye hitap eden tavsiye metnini yaz, ekstra açıklama yapma.
    `;

    // En stabil model olan 'gemini-pro' kullanılıyor
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error("Gemini API Hata Detayı:", errorData);
      return NextResponse.json({ advice: `Yapay zeka sunucusu şu anda yanıt veremiyor. Lütfen daha sonra tekrar dene.` }, { status: 500 });
    }

    const aiData = await aiResponse.json();
    const finalAdvice = aiData.candidates[0].content.parts[0].text;

    return NextResponse.json({ advice: finalAdvice });

  } catch (error: any) {
    console.error("Sistemsel Hata:", error);
    return NextResponse.json({ advice: `Sunucu bağlantısında bir sorun oluştu.` }, { status: 500 });
  }
}