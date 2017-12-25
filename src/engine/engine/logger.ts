/*
 * created by Zhenyun Yu.
 */

enum Level {
    ERROR,
    INFO,
    DEBUG
}

class Logger {
    private title: string;
    private level: number;

    static getStringByLevel(level) {
        return Level[level];
    }

    constructor(title, level) {
        this.title = "Logger";
        this.level = Level.INFO;
        this.setPrintLevel(level);
        this.setTitle(title);
    }

    setPrintLevel(level) {
        if (level instanceof Number) {
            this.level = Number(level)
        } else {
            throw new DOMException();
        }
    }

    setTitle(title) {
        if (title) {
            this.title = title
        }
    }

    _putLog(msg, level, fn) {
        if (level <= this.level) {
            fn("[" + this.title + "] [" + Logger.getStringByLevel(level) + "] " + msg)
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
