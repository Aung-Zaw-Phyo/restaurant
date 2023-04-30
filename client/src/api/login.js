export const setCookie = (data) => {
    let now = new Date();
    now.setTime(now.getTime() + 24 * 3600 * 1000);
    // now.setTime(now.getTime() + 5000);
    document.cookie = `user=${JSON.stringify(data)}; expires=${now.toUTCString()}`
}

