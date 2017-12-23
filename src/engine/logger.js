/*
 * created by Zhenyun Yu.
 */

class Logger {
    static getStringByLevel(level) {
        const dict = {
            0: 'ERROR',
            1: 'INFO',
            2: 'DEBUG'
        };
        return dict[level];
    }

    constructor(title, level) {
        this._title = "Logger";
        this._level = Logger.INFO;
        this.setPrintLevel(level);
        this.setTitle(title);
    }

    setPrintLevel(level) {
        if (level instanceof Number) {
            this._level = level
        }
    }

    setTitle(title) {
        if (title) {
            this._title = title
        }
    }

    _putLog(msg, level) {
        if (level <= this._level) {
            console.log("[" + this._title + "] [" + Logger.getStringByLevel(level) + "] " + msg)
        }
    }

    error(msg) {
        this._putLog(msg, Logger.ERROR);
    }

    info(msg) {
        this._putLog(msg, Logger.INFO);
    }

    debug(msg) {
        this._putLog(msg, Logger.DEBUG);
    }
}

Logger.ERROR = 0;
Logger.INFO = 1;
Logger.DEBUG = 2;


export {Logger};

export default function getLogger(title, level) {
    if (!level) {
        level = Logger.DEBUG;
    }
    return new Logger(title, level)
}
