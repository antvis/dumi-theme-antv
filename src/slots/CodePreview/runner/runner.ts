import { wrapper } from "./wrapper";

export class Runner {
  /**
   * The iframe element to run the code in.
   */
  private iframe: HTMLIFrameElement;

  /**
   * @param iframe The iframe element to run the code in.
   */
  constructor(iframe: string | HTMLIFrameElement) {
    this.iframe = typeof iframe === 'string' ? document.getElementById(iframe) as HTMLIFrameElement : iframe;
  }

  /**
   * Set the html of the iframe.
   * @param html The HTML to be rendered in the iframe.
   */
  public html(html: string) {
    this.iframe.contentDocument!.body.innerHTML = html;
  }

  /**
   * Set the style of the iframe.
   * @param css The CSS to be rendered in the iframe.
   */
  public css(css: string) {
    const style = document.createElement('style');
    style.innerHTML = css;
    this.iframe.contentDocument!.head.innerHTML = '';
    this.iframe.contentDocument!.head.appendChild(style);
  }

  /**
   * Set the dependencies of the iframe.
   * @param dependencies The dependencies to be loaded in the iframe.
   */
  public dependencies(dependencies: object) {
    Object.entries(dependencies).forEach(([name, dependency]) => {
      this.iframe.contentWindow![name] = dependency;
    });
  }

  /**
   * Execute code in the iframe.
   * @param code The code to be executed in the iframe.
   */
  public exec(code: string) {
    const script = document.createElement('script');
    script.innerHTML = wrapper(code);
    this.iframe.contentDocument!.body.appendChild(script);
  }
}