import {SerialPort} from "serialport";
import {AutoDetectTypes} from "@serialport/bindings-cpp";
import {Commands} from "./types";

export class Device {
  private _connected = false
  private _device: SerialPort<AutoDetectTypes> | null = null
  private _deviceName: string | null = null

  private input = ''
  private reciving = false

  private readonly callback: (command: string, value: string) => void = () => ({})

  constructor(callback: (command: string, value: string) => void) {
    this.callback = callback
  }


  get connected () {
    return this._connected
  }

  get device () {
    return this._device
  }

  get deviceName () {
    return this._deviceName
  }

  onConnect () {
    this._connected = true
    return new Promise((resolve) => {
      this.send(Commands.GetName, '')
      const id = setInterval(() => {
        console.log(this._deviceName)
        if (this._deviceName) {
          resolve({ name: this._deviceName, connected: true })
          clearInterval(id)
        }
      }, 1000)
    })

  }

  onDisconnect () {
    this._connected = false
  }

  async list () {
    return SerialPort.list()
  }

  async connect () {
    if (this._connected) {
      return;
    }

    const devices = await this.list()

    const device = devices.find((d) => d.serialNumber === '0001')

    if (!device) {
      return;
    }

    this._device = new SerialPort({
      baudRate: 115200,
      path: device.path
    })


    if (this._device) {
      this._device
        .on('drain', () => {
          this.onDisconnect()
        })
        .on('data', (data) => {
          console.log("Server: ", data.toString())
          this.parseInput(data.toString())
        })

      const d =  await this.onConnect()
      return d
    }

    this.onDisconnect()
    return 'not connected'
  }

  send (command: Commands, value: string) {
    if (!this._connected) {
      return;
    }

    const formatted = '<' + command + "|" + value + '>'

    this._device?.write(formatted, 'binary')
  }

  parseInput (data: string) {
    data = data.replace(/(\r\n|\n|\r)/gm, "");

    if (!this.reciving && data[0] !== '<') {
      return;
    }

    if (!this.reciving && data[0] === '<') {
      this.reciving = true;
      const withEnd = data[data.length - 1] === '>'

      this.input = data.slice(1, data.length - (withEnd ? 1 : 0))

      if (withEnd) {
        let { command, value } = this.splitInput()
        this.execute(command, value)
      }

      return;
    }

    if (this.reciving && data[data.length - 1] === '>') {
      this.input = this.input + data.slice(0, data.length - 1)
      this.reciving = false;
      let { command, value } = this.splitInput()
      if (command === 'name') {
        this._deviceName = value
      }
      this.execute(command, value)
      return;
    }

    this.input = this.input + data.slice(0, data.length)
  }

  splitInput () {
    const [ command,value ] = this.input.split('|')
    return { command, value }
  }

  execute(command: string, value: string) {
    this.callback(command, value)
    this.input = ''
  }
}
