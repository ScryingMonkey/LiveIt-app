import { LiveItAppPage } from './app.po';

describe('live-it-app App', () => {
  let page: LiveItAppPage;

  beforeEach(() => {
    page = new LiveItAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
