import { config } from "@app/config";

export interface BusinessFunction {
  id: number;
  process_id: number;
  task_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export async function getFunctionByTaskId(
  taskId: string
): Promise<BusinessFunction | null> {
  try {
    const resp = await fetch(`${config.apiUrl}/functions/${taskId}`);
    if (!resp.ok) return null;
    return await resp.json();
  } catch (err) {
    console.error("Ошибка при получении функции:", err);
    return null;
  }
}
