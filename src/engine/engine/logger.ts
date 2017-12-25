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

    static getStringByLevel(level: Level) {
        return Level[level];
    }

    constructor(title: string, level: Level) {
        this.title = "Logger";
        this.level = Level.INFO;
        this.setPrintLevel(level);
        this.setTitle(title);
    }

    setPrintLevel(level: Level) {
        if (level >= 0 && level <= Level.DEBUG) {
            this.level = Number(level)
        } else {
            throw new DOMException();
        }
    }

    setTitle(title: string) {
        if (title) {
            this.title = title
        }
    }

    private putLog(msg: string, level: Level, fn: (msg: string) => void) {
        if (level <= this.level) {
            fn("[" + this.title + "] [" + Logger.getStringByLevel(level) + "] " + msg)
        }
    }

    error(msg: string) {
        this.putLog(msg, Level.ERROR, console.error);
    }

    info(msg: string) {
        this.putLog(msg, Level.INFO, console.log);
    }

    debug(msg: string) {
        this.putLog(msg, Level.DEBUG, console.debug);
    }
}

export {Logger, Level};

export default function getLogger(title: string, level: Level) {
    if (!level) {
        level = Level.DEBUG;
    }
    return new Logger(title, level)
}
