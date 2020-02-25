

//%color=#FC325B icon="\uf2c9" block="KSRobot_MLX90614"
namespace KSRobot_MLX90614 {

    export enum Temperature_State {
        //% blockId="ObjectTempC" block="ObjectTempC"
        ObjectTempC = 1,
        //% blockId="AmbientTempC" block="AmbientTempC"
        AmbientTempC = 2,
        //% blockId="ObjectTempF" block="ObjectTempF"
        ObjectTempF = 3,
        //% blockId="AmbientTempF" block="AmbientTempF"
        AmbientTempF = 4
    }

    const MLX90614_I2CADDR = 0x5A

    // RAM
    const MLX90614_RAWIR1 = 0x04
    const MLX90614_RAWIR2 = 0x05
    const MLX90614_TA = 0x06
    const MLX90614_TOBJ1 = 0x07
    const MLX90614_TOBJ2 = 0x08
    // EEPROM
    const MLX90614_TOMAX = 0x20
    const MLX90614_TOMIN = 0x21
    const MLX90614_PWMCTRL = 0x22
    const MLX90614_TARANGE = 0x23
    const MLX90614_EMISS = 0x24
    const MLX90614_CONFIG = 0x25
    const MLX90614_ADDR = 0x0E
    const MLX90614_ID1 = 0x3C
    const MLX90614_ID2 = 0x3D
    const MLX90614_ID3 = 0x3E
    const MLX90614_ID4 = 0x3F


    function i2c_write(reg: number, value: number) {

        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(MLX90614_I2CADDR, buf)
    }

    function i2c_read(reg: NumberFormat.UInt8BE): number {

        pins.i2cWriteNumber(MLX90614_I2CADDR, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(MLX90614_I2CADDR, NumberFormat.UInt8BE);
        return val;
    }

    function i2c_read16(reg: NumberFormat.UInt8BE): number {

        pins.i2cWriteNumber(MLX90614_I2CADDR, reg, NumberFormat.UInt8BE, true);
        let val = pins.i2cReadNumber(MLX90614_I2CADDR, NumberFormat.UInt16LE, true);
        return val;
    }



    function readTemp(reg: NumberFormat.UInt8BE): number {
        let temp = i2c_read16(reg)
        temp *= 0.02
        temp -= 273.15
        return temp
    }

    function readObjectTempF(): number {
        return (readTemp(MLX90614_TOBJ1) * 9 / 5) + 32;
    }
    function readAmbientTempF(): number {
        return (readTemp(MLX90614_TA) * 9 / 5) + 32;
    }
    function readObjectTempC(): number {
        return readTemp(MLX90614_TOBJ1);
    }
    function readAmbientTempC(): number {
        return readTemp(MLX90614_TA);
    }

    //% blockId=KSRobot_Temperature
    //%block="Temperature %state"
    export function read_temperature(state: Temperature_State): number {
        switch (state) {
            case Temperature_State.ObjectTempC:
                return readObjectTempC();
            case Temperature_State.AmbientTempC:
                return readAmbientTempC();
            case Temperature_State.ObjectTempF:
                return readObjectTempF();
            case Temperature_State.AmbientTempF:
                return readAmbientTempF();
            default:
                return 0;
        }
    }
}
