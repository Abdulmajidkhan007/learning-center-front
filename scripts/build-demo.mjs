import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Demo build'ini bitta o'zi yetarli faylga yig'adi.
 *
 * Ikkita chiqish beriladi:
 *  - `cornerstone-demo.html` — to'liq HTML hujjat. Istalgan statik hostingga
 *    tashlash yoki brauzerda to'g'ridan-to'g'ri ochish mumkin.
 *  - `artifact.html` — faqat sahifa ichi (doctype/head/body siz). Sahifani
 *    o'z karkasiga o'raydigan platformalar uchun.
 *
 * Nega bitta fayl: demo tashqi so'rovlarga ruxsat bermaydigan joylarda ham
 * ochilishi kerak, shu sabab JS, CSS va shriftlar ichkariga singdiriladi.
 *
 * MUHIM: almashtirishda funksiya ishlatiladi, satr emas. `String.replace`
 * almashtiruvchi SATRIDA `$$`, `$&`, `$1` maxsus ma'noga ega, minifikatsiya
 * qilingan React'da esa `$$typeof` bor — satr bilan almashtirilsa bundle
 * jimgina buziladi va sahifada JS matn bo'lib chiqib qoladi.
 */
const dir = 'dist-demo'
const assets = readdirSync(join(dir, 'assets'))
const js = assets.find((name) => name.endsWith('.js'))
const css = assets.find((name) => name.endsWith('.css'))

const script = `<script type="module">\n${readFileSync(join(dir, 'assets', js), 'utf8')}\n</script>`
const style = `<style>\n${readFileSync(join(dir, 'assets', css), 'utf8')}\n</style>`

const title = 'Cornerstone Learning Centre'

const standalone = readFileSync(join(dir, 'demo.html'), 'utf8')
    .replace(new RegExp(`<script[^>]*src="[^"]*${js}"[^>]*></script>`), () => script)
    .replace(new RegExp(`<link[^>]*href="[^"]*${css}"[^>]*>`), () => style)

const fragment = [`<title>${title}</title>`, style, '<div id="root"></div>', script].join('\n')

for (const [name, content] of [
    ['cornerstone-demo.html', standalone],
    ['artifact.html', fragment],
]) {
    writeFileSync(join(dir, name), content)
    console.log(`${join(dir, name)} — ${(content.length / 1024).toFixed(0)} KB`)
}

// Sanity: bundle buzilmaganini tekshiramiz. `$$typeof` React'ning ichki
// belgisi — u yo'qolgan bo'lsa, almashtirish yana satr bilan bo'lgan.
for (const name of ['cornerstone-demo.html', 'artifact.html']) {
    const html = readFileSync(join(dir, name), 'utf8')
    if (!html.includes('$$typeof')) {
        throw new Error(`${name}: bundle buzilgan ($$typeof yo'qolgan)`)
    }
}
console.log('tekshiruv: bundle butun')
