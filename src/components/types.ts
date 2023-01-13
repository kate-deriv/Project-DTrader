export type TResponse = {
  isTrusted: boolean;
  bubbles: boolean;
  cancelBubble: boolean; 
  cancelable: boolean; 
  composed: boolean;
  currentTarget: object;
  data: string;
  defaultPrevented: boolean;  
  eventPhase: number;
  lastEventId: string;
  origin: string;
  ports: []; 
  returnValue: boolean;
  source: null;
  srcElement: object;
  target: object;
  timeStamp: number; 
  type: string;
  userActivation: null;
}