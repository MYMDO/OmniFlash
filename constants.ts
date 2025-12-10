import { ChipDefinition, DeviceType, Protocol } from './types';

export const MOCK_CHIPS: ChipDefinition[] = [
  {
    id: 'stm32f407',
    manufacturer: 'STMicroelectronics',
    partNumber: 'STM32F407VG',
    type: DeviceType.MCU,
    protocols: [Protocol.SWD, Protocol.JTAG, Protocol.UART],
    memorySize: 1024 * 1024, // 1MB
    voltage: '1.8V - 3.6V',
    description: 'High-performance Cortex-M4 32-bit RISC core'
  },
  {
    id: 'esp32-wroom',
    manufacturer: 'Espressif',
    partNumber: 'ESP32-WROOM-32',
    type: DeviceType.MCU,
    protocols: [Protocol.UART, Protocol.SPI, Protocol.JTAG],
    memorySize: 4 * 1024 * 1024, // 4MB
    voltage: '3.3V',
    description: 'Wi-Fi + Bluetooth + BLE MCU module'
  },
  {
    id: 'w25q64',
    manufacturer: 'Winbond',
    partNumber: 'W25Q64JV',
    type: DeviceType.FLASH,
    protocols: [Protocol.SPI],
    memorySize: 8 * 1024 * 1024, // 8MB
    voltage: '2.7V - 3.6V',
    description: '64M-bit Serial Flash Memory with Dual/Quad SPI'
  },
  {
    id: 'atmega328p',
    manufacturer: 'Microchip (Atmel)',
    partNumber: 'ATmega328P',
    type: DeviceType.MCU,
    protocols: [Protocol.SPI, Protocol.UART, Protocol.I2C],
    memorySize: 32 * 1024,
    voltage: '1.8V - 5.5V',
    description: '8-bit AVR Microcontroller with 32K Bytes In-System Programmable Flash'
  },
  {
    id: '24c02',
    manufacturer: 'Generic',
    partNumber: '24C02',
    type: DeviceType.EEPROM,
    protocols: [Protocol.I2C],
    memorySize: 256,
    voltage: '2.5V - 5.5V',
    description: '2K-bit Standard 2-Wire Bus Interface Serial EEPROM'
  }
];

export const SAMPLE_HEX_DATA = new Uint8Array(256).map((_, i) => i % 2 === 0 ? i : 255 - i);
