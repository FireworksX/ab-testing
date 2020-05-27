export function checkLocalStorage(): boolean {
    const  test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

export function checkWindowSupport(): boolean {
    return window !== undefined
}
