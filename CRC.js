class CRC16 {
    constructor() {
        this.StringToCheck = ""
        this.CleanedString = ""
        this.CRCTableDNP = []
    }
    // verifica o formato da string 
    static CleanString() {
        if (this.StringToCheck.match(/^[0-9A-F \t]+$/gi) !== null) {
            //this.StringToCheck = this.StringToCheck.substr(0, this.StringToCheck.length - 6) // remove crc
            this.CleanedString = this._hexStringToString(this.StringToCheck.toUpperCase().replace(/[\t ]/g, '').substr())
        } else {
            //console.log("crc16","O Valor Hex inserido nao e valido valido.");
            return false
        }
        return true
    }
    // calcula o crc
    static CRC16Modbus(init, poly) {
        var crc = init
        var str = this.CleanedString
        for (var pos = 0; pos < str.length; pos++) {
            crc ^= str.charCodeAt(pos)
            for (var i = 8; i !== 0; i--) {
                if ((crc & 0x0001) !== 0) {
                    crc >>= 1
                    crc ^= poly
                } else
                    crc >>= 1
            }
        }
        return crc
    }

    static _stringToBytes(str) {
        var ch, st, re = []
        for (var i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i) // get char
            st = [] // 
            do {
                st.push(ch & 0xFF) // Puh byte para a pilha
                ch = ch >> 8 // desloca o valor em 1 byte
            }
            while (ch)
            //adiciona o conteúdo da pilha ao resultado
            re = re.concat(st.reverse())
        }
        // retorna um array de bytes
        return re
    }

    static _hexStringToString(inputstr) {
        var hex = inputstr.toString() //forca a conversao
        var str = ''
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
        return str
    }

    static Calculate(str, inv = true, poly = 0xA001, init = 0xFFFF) {

        CRC16.StringToCheck = str
        if (CRC16.CleanString()) {
            var w = CRC16.CRC16Modbus(init, poly)
            var t = w.toString(16).toUpperCase()
            //var t = CRC16.CRC16Modbus().toString(16).toUpperCase(); //converte o valor para Hexadecimal
            if (t.length == 3) {
                t = "0" + t
            } else if (t.length == 2) {
                t = "00" + t
            }
            else if (t.length == 1) {
                t = "000" + t
            }
            if (inv) {
                var te = t.substr(2, 3) + " " + t.substr(0, 2) //inverte os bytes para retornar valor 
            } else {
                var te = t.substr(0, 2) + " " + t.substr(2, 3)
            }

            if (fullStr) {
                return str + " " + te
            } else {
                return te
            }
        }
    }
}

class CRC8 {
    static Calculate(buffer, inv, TAG = 0x07) {

        function HextoDecimal(d) {
            return Number.parseInt("0x" + d.replace(/[\t ]/g, ''))
        }

        function DecimalToHex(d) {
            var hex = Number(parseInt(d)).toString(16)
            hex = hex.toUpperCase()
            return hex
        }

        let crc = 0
        let prevCrc = 0xFF
        let crc8Table = [256]
        let newArray = []

        for (let i = 0; i < 256; i++) {
            crc = i
            for (let j = 0; j < 8; j++) {
                crc = (crc << 1) ^ (((crc & 0x80) > 0) ? TAG : 0)
            }
            crc8Table[i] = crc & 0xFF
        }

        buffer.forEach(element => {
            if (element == undefined) {
                newArray.push(255)
            } else {
                newArray.push(HextoDecimal(element))
            }
        })

        for (let i = 0; i < newArray.length; i++) {
            prevCrc = crc8Table[(prevCrc) ^ (newArray[i])]

        }

        let crcHex = DecimalToHex(prevCrc)

        if (inv) {
            crcHex = crcHex.split("").reverse().join("")
        }

        return crcHex
    }
}

