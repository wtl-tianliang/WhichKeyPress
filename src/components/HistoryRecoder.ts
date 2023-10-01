import { ref, watch } from "vue";
import type { Ref } from "vue";

export function useRecoder(
  code: Ref<string[]>,
  maxRecords: number = 300
): Ref<Array<string[]>> {
  const histories = ref<Array<string[]>>([]);
  let group: string[] = [];
  watch(
    () => code.value,
    (newValue: string[], oldValue: string[]) => {
      // remove first record
      if (histories.value.length >= maxRecords) {
        histories.value.shift();
      }

      if (group.length < 1) {
        group = oldValue;
      }

      if (newValue.length === 0) {
        histories.value.push(group);
        group = [];
      }
    }
  );
  return histories;
}
