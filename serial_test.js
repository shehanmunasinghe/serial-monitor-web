const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const path = '/dev/cu.H-C-2010-06-01-DevB'
const port = new SerialPort(path, { baudRate: 115200 })

const parser = new Readline()
port.pipe(parser)

parser.on('data', (line) => 
    console.log(`> ${line}`)
)
//port.write('ROBOT POWER ON\n')