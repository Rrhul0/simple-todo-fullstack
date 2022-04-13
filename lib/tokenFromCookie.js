export default function tokenFromCookie(cookies){
    if(!cookies) return undefined
    if(!cookies.match(/;/)){
        if(cookies.match(/token/)) {
            return cookies.split('=')[1]
        }
    }
    for (let cookie of cookies.split(';')){
        if(cookie.match(/token/)) {
            return cookie.split('=')[1]
        }
    }
    return undefined
}