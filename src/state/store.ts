type Listener<T> = (state: T) => void;

interface AppState {
  currentProcessId: string | null;
}

const state: AppState = {
  currentProcessId: null,
};

const listeners: Listener<AppState>[] = [];

// получить текущее состояние
export function getState(): AppState {
  return { ...state };
}

// обновить состояние
export function setState(partial: Partial<AppState>): void {
  Object.assign(state, partial);
  listeners.forEach((listener) => listener(getState()));
}

// подписка на изменения
export function subscribe(listener: Listener<AppState>): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}
