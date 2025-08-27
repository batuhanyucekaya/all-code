import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validasyon
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur" },
        { status: 400 }
      )
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir email adresi giriniz" },
        { status: 400 }
      )
    }

    // Backend'e email gönderme isteği
    const emailData = {
      to: "info@techstore.com", // Şirket email adresi
      from: email,
      subject: `İletişim Formu: ${subject}`,
      message: `
        Yeni İletişim Formu Mesajı
        
        Ad Soyad: ${name}
        Email: ${email}
        Konu: ${subject}
        
        Mesaj:
        ${message}
        
        ---
        Bu mesaj TechStore web sitesi iletişim formundan gönderilmiştir.
      `
    }

    // Backend'e gönder
    const response = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    if (response.ok) {
      return NextResponse.json(
        { message: "Mesajınız başarıyla gönderildi" },
        { status: 200 }
      )
    } else {
      console.error("Backend email hatası:", await response.text())
      return NextResponse.json(
        { error: "Mesaj gönderilirken bir hata oluştu" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("İletişim API hatası:", error)
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    )
  }
}
