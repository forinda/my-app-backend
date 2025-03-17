import kleur from 'kleur';
import { dependency } from '../di';

@dependency()
export class Logger {
  private readonly highlight = {
    info: kleur.blue,
    success: kleur.green,
    warn: kleur.yellow,
    error: kleur.red,
    debug: kleur.gray
  };

  public error(...args: unknown[]): void {
    console.error(this.highlight.error('[ERROR]'), ...args);
  }

  public warn(...args: unknown[]): void {
    console.warn(this.highlight.warn('[WARN]'), ...args);
  }

  public info(...args: unknown[]): void {
    console.info(this.highlight.info('[INFO]'), ...args);
  }

  public success(...args: unknown[]): void {
    console.log(this.highlight.success('[SUCCESS]'), ...args);
  }

  public log(...args: unknown[]): void {
    console.log(...args);
  }

  public debug(...args: unknown[]): void {
    console.debug(this.highlight.debug('[DEBUG]'), ...args);
  }
}
