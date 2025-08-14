// app/api/specs/route.ts
import { NextResponse } from "next/server"

const WD_SEARCH = "https://www.wikidata.org/w/api.php"
const WD_SPARQL = "https://query.wikidata.org/sparql"
const UA = "TechStoreBot/1.1 (contact: you@example.com)" // kendini yaz

// ---- yardımcılar
function normalize(q: string) {
    return q.toLowerCase().replace(/ı/g, "i").replace(/\s+/g, " ").trim()
}
function uriToQid(uri?: string): string | null {
    if (!uri) return null
    const m = uri.match(/entity\/(Q\d+)/)
    return m ? m[1] : null
}
type Cand = { id: string; label: string; desc?: string }

// ---- 1) Arama: ilk 10 aday (id + label)
async function wikidataSearchRaw(q: string): Promise<Cand[]> {
    const url = `${WD_SEARCH}?action=wbsearchentities&language=tr&format=json&uselang=tr&type=item&limit=10&search=${encodeURIComponent(
        q
    )}`
    const r = await fetch(url, { headers: { "User-Agent": UA } })
    if (!r.ok) return []
    const j = await r.json()
    const list: Cand[] = (j?.search || [])
        .map((s: any) => ({ id: s?.id, label: s?.label, desc: s?.description }))
        .filter((x: any) => x?.id && x?.label)
    return list
}

// ---- 2) Allow-list (teknoloji) + Block-list (kurum/parti/kişi vs.)
const ALLOWED_TECH_CLASSES = [
    "Q22645", "Q175", "Q48498",   // smartphone/phone/tablet
    "Q3962", "Q45024", "Q68",     // laptop/desktop/computer
    "Q2269", "Q184388",          // TV/monitor
    "Q3966", "Q26850",           // CPU/GPU
    "Q220373", "Q22855",         // SSD/HDD
    "Q1250749", "Q8071",         // wireless router/router
    "Q190600", "Q177045", "Q2539",// headphones/earphones/speaker
    "Q8076",                    // game console
]

const BLOCKED_TYPES = [
    "Q43229",   // organization
    "Q4830453", // business/company
    "Q431289",  // brand
    "Q7278",    // political party
    "Q5",       // human
    "Q6256",    // country
    "Q515",     // city
    "Q35127",   // website
    "Q12812113",// e-commerce
    "Q1554231", // retailer
    "Q3624078", // government
    "Q11424",   // film
    "Q5398426", // TV series
    "Q1656682", // event
]

// Adayları: allow-list İSE ve block-list DEĞİLSE geçir
async function pickAllowedTech(candidates: Cand[]): Promise<string[]> {
    if (!candidates.length) return []
    const valuesItems = candidates.map((c) => `wd:${c.id}`).join(" ")
    const valuesAllowed = ALLOWED_TECH_CLASSES.map((q) => `wd:${q}`).join(" ")
    const valuesBlocked = BLOCKED_TYPES.map((q) => `wd:${q}`).join(" ")

    const sparql = `
SELECT ?item WHERE {
  VALUES ?item { ${valuesItems} }
  # allow-list
  ?item wdt:P31/wdt:P279* ?allowed .
  VALUES ?allowed { ${valuesAllowed} }
  # block-list
  FILTER NOT EXISTS {
    ?item wdt:P31/wdt:P279* ?blocked .
    VALUES ?blocked { ${valuesBlocked} }
  }
}`
    const r = await fetch(`${WD_SPARQL}?query=${encodeURIComponent(sparql)}`, {
        headers: { Accept: "application/sparql-results+json", "User-Agent": UA },
    })
    if (!r.ok) return []
    const j = await r.json()
    const okIds: string[] = (j?.results?.bindings || [])
        .map((b: any) => uriToQid(b?.item?.value))
        .filter(Boolean) as string[]

    // Orijinal arama sırasını koru
    return candidates.map(c => c.id).filter((id) => okIds.includes(id))
}

// Ürün ipucu (rakam/anahtar kelime) var mı?
function hasProductHint(norm: string) {
    return /\d/.test(norm) || /(^| )(tv|monitor|monitör|kulak(l|)ık|headphone|earbud|gpu|cpu|rtx|gtx|ryzen|core|ssd|hdd|ps[345]|xbox|iphone|ipad|galaxy|pixel|ultra|max|pro|mini)( |$)/i.test(norm)
}

// Sıkı eşleşme: ürün ipucu yoksa label–sorgu yakın olmalı
function strictPick(queryNorm: string, cands: Cand[], allowedIds: string[]): string | null {
    const allowed = cands.filter(c => allowedIds.includes(c.id))
    if (!allowed.length) return null

    const hint = hasProductHint(queryNorm)
    if (hint) {
        // ürün ipucu varsa ilk allow’u kabul et
        return allowed[0].id
    }

    // ürün ipucu yoksa label içerme zorunlu
    const hit = allowed.find(c => {
        const lab = normalize(c.label)
        return lab.includes(queryNorm) || queryNorm.includes(lab)
    })
    return hit?.id || null
}

// ---- 3) Detay + özet çekimi (aynı)
async function wikidataDetails(qid: string) {
    const sparql = `
SELECT ?item ?itemLabel ?itemDescription ?manufacturerLabel ?seriesLabel ?pubDate ?image ?trArticle ?enArticle WHERE {
  VALUES ?item { wd:${qid} }
  OPTIONAL { ?item wdt:P176 ?manufacturer. }
  OPTIONAL { ?item wdt:P179 ?series. }
  OPTIONAL { ?item wdt:P577 ?pubDate. }
  OPTIONAL { ?item wdt:P18 ?image. }
  OPTIONAL { ?trArticle schema:about ?item; schema:inLanguage "tr";
             schema:isPartOf <https://tr.wikipedia.org/>. }
  OPTIONAL { ?enArticle schema:about ?item; schema:inLanguage "en";
             schema:isPartOf <https://en.wikipedia.org/>. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],tr,en". }
}
LIMIT 1`
    const r = await fetch(`${WD_SPARQL}?query=${encodeURIComponent(sparql)}`, {
        headers: { Accept: "application/sparql-results+json", "User-Agent": UA },
    })
    if (!r.ok) return null
    const j = await r.json()
    const b = j?.results?.bindings?.[0]
    if (!b) return null
    return {
        label: b.itemLabel?.value,
        description: b.itemDescription?.value,
        manufacturer: b.manufacturerLabel?.value,
        series: b.seriesLabel?.value,
        releaseDate: b.pubDate?.value,
        image: b.image?.value,
        trArticle: b.trArticle?.value || null,
        enArticle: b.enArticle?.value || null,
    }
}

async function wikipediaSummary(wikiUrl: string | null) {
    if (!wikiUrl) return null
    try {
        const m = wikiUrl.match(/\/wiki\/(.+)$/)
        const title = m ? decodeURIComponent(m[1]) : null
        if (!title) return null
        const lang = wikiUrl.includes("tr.wikipedia.org") ? "tr" : "en"
        const res = await fetch(
            `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
            { headers: { "User-Agent": UA, Accept: "application/json" } }
        )
        if (!res.ok) return null
        const j = await res.json()
        return {
            lang,
            title: j?.title,
            extract: j?.extract,
            canonicalurl: j?.content_urls?.desktop?.page || wikiUrl,
            thumbnail: j?.thumbnail?.source || null,
        }
    } catch {
        return null
    }
}

// ---- 4) Route
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const raw = (searchParams.get("q") || "").trim()

    // Girdi doğrulama
    if (raw.length < 2 || raw.length > 80) {
        return NextResponse.json({ error: "Geçersiz sorgu." }, { status: 400 })
    }
    if (!/^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s\-\+\.]+$/.test(raw)) {
        return NextResponse.json({ error: "Geçersiz karakter." }, { status: 400 })
    }

    const qNorm = normalize(raw)

    // 1) Adaylar
    const cands = await wikidataSearchRaw(qNorm)
    if (!cands.length) {
        return NextResponse.json({ error: "Eşleşme bulunamadı." }, { status: 404 })
    }

    // 2) Allow-list + Block-list süzme
    const allowedIds = await pickAllowedTech(cands)

    // 3) Sıkı seçim (ürün ipucu yoksa label eşleşmesi şart)
    const qid = strictPick(qNorm, cands, allowedIds)
    if (!qid) {
        return NextResponse.json(
            { error: "not_tech", message: "Sadece teknoloji ürünleri hakkında bilgi veriyorum." },
            { status: 422 }
        )
    }

    // 4) Detay + özet
    const wd = await wikidataDetails(qid)
    if (!wd) return NextResponse.json({ error: "Veri alınamadı." }, { status: 502 })

    const summary =
        (await wikipediaSummary(wd.trArticle)) ||
        (await wikipediaSummary(wd.enArticle))

    const data = {
        id: qid,
        name: wd.label,
        description: wd.description,
        manufacturer: wd.manufacturer || null,
        series: wd.series || null,
        releaseDate: wd.releaseDate || null,
        image: wd.image || summary?.thumbnail || null,
        summary: summary?.extract || null,
        sources: [
            summary?.canonicalurl || wd.trArticle || wd.enArticle,
            "https://www.wikidata.org/wiki/" + qid,
        ].filter(Boolean) as string[],
    }

    const res = NextResponse.json(data)
    res.headers.set("Cache-Control", "s-maxage=43200, stale-while-revalidate=86400")
    return res
}
