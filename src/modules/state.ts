export type Timer = {
  id: string;
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
  ms: number;
};

export let timers: Timer[] = []; 