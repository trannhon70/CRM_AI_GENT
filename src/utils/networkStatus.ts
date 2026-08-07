// utils/networkStatus.ts
type Listener = (isOnline: boolean) => void;

class NetworkStatus {
    private listeners: Set<Listener> = new Set();
    private _isOnline: boolean = navigator.onLine;

    constructor() {
        window.addEventListener("online", this.handleOnline);
        window.addEventListener("offline", this.handleOffline);
    }

    private handleOnline = () => {
        this._isOnline = true;
        this.listeners.forEach((cb) => cb(true));
    };

    private handleOffline = () => {
        this._isOnline = false;
        this.listeners.forEach((cb) => cb(false));
    };

    get isOnline() {
        return this._isOnline;
    }

    subscribe(cb: Listener) {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb);
    }
}

export const networkStatus = new NetworkStatus();