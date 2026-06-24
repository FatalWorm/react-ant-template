import { exampleApi } from '@/entities/example/api/example.api';
import type { TExampleItem } from '@/entities/example/api/example.types';

/**
 * Репозиторий для работы с сущностью Example.
 * Отвечает за связь с API, трансформацию данных и бизнес-логику на уровне данных.
 * Component -> useHook -> Repository -> API
 */
export class ExampleRepository {
  /**
   * Получение списка элементов с возможной трансформацией данных
   */
  static async getItems(signal?: AbortSignal): Promise<TExampleItem[]> {
    const items = await exampleApi.getItems(signal);

    // Пример трансформации или бизнес-логики:
    // Убеждаемся, что данные отсортированы по ID перед выдачей в хук
    return items.sort((a, b) => a.id - b.id);
  }

  /**
   * Получение одного элемента по ID
   */
  static async getItemById(id: number, signal?: AbortSignal): Promise<TExampleItem> {
    return exampleApi.getItemById(id, signal);
  }

  /**
   * Создание нового элемента с инкапсуляцией payload
   */
  static async createItem(title: string): Promise<TExampleItem> {
    // Подготовка payload для API скрыта внутри репозитория
    return exampleApi.createItem({
      title,
      completed: false,
    });
  }
}
