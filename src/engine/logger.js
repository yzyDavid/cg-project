/*
 * created by Zhenyun Yu.
 */

class Logger {
    static ERROR = 0;
    static INFO = 1;
    static DEBUG = 2;

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
        if (level instanceof 'number') {
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

export {Logger};

export default function getLogger(title, level) {
    if (!level) {
        level = Logger.DEBUG;
    }
    return new Logger(title, level)
}
