export interface ProcessDto {
  id: string;
  name: string;
  description?: string;
  xml: string;
}

const API_URL = "/api"; // универсально: dev → прокси на localhost:4000, prod → /api

// Получить список процессов
export async function getProcesses(): Promise<ProcessDto[]> {
  const res = await fetch(`${API_URL}/processes`);
  if (!res.ok) throw new Error("Ошибка загрузки процессов");
  return res.json();
}

// Получить один процесс
export async function getProcess(id: string): Promise<ProcessDto> {
  const res = await fetch(`${API_URL}/processes/${id}`);
  if (!res.ok) throw new Error("Ошибка загрузки процесса");
  return res.json();
}

// Создать новый процесс
export async function createProcess(
  data: Omit<ProcessDto, "id">
): Promise<ProcessDto> {
  const res = await fetch(`${API_URL}/processes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Ошибка создания процесса");
  return res.json();
}

// Обновить процесс
export async function updateProcess(
  id: string,
  data: Omit<ProcessDto, "id">
): Promise<void> {
  const res = await fetch(`${API_URL}/processes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Ошибка обновления процесса");
}
