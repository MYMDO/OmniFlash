export enum Protocol {
  JTAG = 'JTAG',
  SWD = 'SWD',
  SPI = 'SPI',
  I2C = 'I2C',
  UART = 'UART',
  CAN = 'CAN',
  ONE_WIRE = '1-Wire'
}

export enum DeviceType {
  MCU = 'Microcontroller',
  EEPROM = 'EEPROM',
  FLASH = 'NOR/NAND Flash',
  FPGA = 'FPGA',
  SENSOR = 'Sensor/Peripheral'
}

export interface ChipDefinition {
  id: string;
  manufacturer: string;
  partNumber: string;
  type: DeviceType;
  protocols: Protocol[];
  memorySize?: number; // in bytes
  voltage?: string;
  description: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  message: string;
  source?: string;
}

export enum ConnectionStatus {
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting',
  CONNECTED = 'Connected',
  BUSY = 'Busy',
  ERROR = 'Error'
}

export interface HexEditorState {
  data: Uint8Array;
  addressOffset: number;
}