/*
 * created by Zhenyun Yu.
 */

enum Level {
    ERROR,
    INFO,
    DEBUG
}

class Logger {
    ERROR: number;
    INFO: number = 1;
    DEBUG: number;
    _title: string;
    _level: number;

    static getStringByLevel(level) {
        return Level[level];
    }

    constructor(title, level) {
        this._title = "Logger";
        this._level = Level.INFO;
        this.setPrintLevel(level);
        this.setTitle(title);
    }

    setPrintLevel(level) {
        if (level instanceof Number) {
            this._level = Number(level)
        } else {
            throw new DOMException();
        }
    }

    setTitle(title) {
        if (title) {
            this._title = title
        }
    }

    _putLog(msg, level, fn) {
        if (level <= this._level) {
            fn("[" + this._title + "] [" + Logger.getStringByLevel(level) + "] " + msg)
        }
    }

    error(msg) {
        this._putLog(msg, Level.ERROR, console.error);
    }

    info(msg) {
        this._putLog(msg, Level.INFO, console.log);
    }

    debug(msg) {
        this._putLog(msg, Level.DEBUG, console.debug);
    }
}

export {Logger, Level};

export default function getLogger(title, level) {
    if (!level) {
        level = Level.DEBUG;
    }
    return new Logger(title, level)
}
